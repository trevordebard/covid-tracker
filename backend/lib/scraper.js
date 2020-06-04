import puppeteer from 'puppeteer';
import scrapeAR from '../states/scrapeAR';
import scrapeLA from '../states/scrapeLA';
import scrapeTX from '../states/scrapeTX';

const urls = {
  LA: 'https://www.arcgis.com/apps/opsdashboard/index.html#/69b726e2b82e408f89c3a54f96e8f776',
  TX: 'https://txdshs.maps.arcgis.com/apps/opsdashboard/index.html#/ed483ecd702b4298ab01e8b9cafc8b83',
};
export default context => {
  let browser = null;
  let page = null;
  async function setupPuppet() {
    try {
      browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      page = await browser.newPage();
      console.log(context.state);
      await page.goto(urls[context.state], { waitUntil: 'networkidle2', timeout: 65000 });
      return [page, browser];
    } catch (err) {
      console.error('There was an issue in setupPuppet');
      if (browser) {
        console.log('closing browser1');
        browser.close();
      }
      throw err;
    }
  }
  return {
    async scrape() {
      if (context.state === 'AR') {
        context.data = await scrapeAR();
        return;
      }
      try {
        await setupPuppet();
        await page.waitForFunction(
          `document.querySelectorAll('div > svg > g.responsive-text-label > svg > text').length > 0`,
          { timeout: 35000 }
        );
        const func = getScrapeFunction(context.state);
        context.data = await page.evaluate(func);
      } catch (e) {
        console.log(`There was an error seting up puppet or evaluating the page for ${context.state}`);
        throw e;
      } finally {
        if (browser) {
          console.log('closing browser2');
          browser.close();
        }
      }
    },
  };
};
function getScrapeFunction(state) {
  switch (state) {
    case 'AR':
      return scrapeAR;
    case 'LA':
      return scrapeLA;
    case 'TX':
      return scrapeTX;
    default:
      console.log('No scrape function setup');
  }
}
