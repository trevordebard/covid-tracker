/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
import State from '../State';

export default class Texas extends State {
  constructor() {
    const url = 'https://txdshs.maps.arcgis.com/apps/opsdashboard/index.html#/ed483ecd702b4298ab01e8b9cafc8b83';
    super('TX', url);
    this.data = null;
  }

  scrapeData() {
    const res = {};
    const data = document.querySelectorAll('div > svg > g.responsive-text-label > svg > text');
    let i = 0;
    let stateTests = null;
    let commercialTests = null;
    while (i < data.length) {
      if (data[i].innerHTML.includes('Cases Reported')) {
        if (!data.totalCases) {
          if (!res.totalCases) {
            // Texas doesn't differentiate
            res.totalCases = getStringAsNum(data[i - 1].innerHTML);
            res.totalPositive = getStringAsNum(data[i - 1].innerHTML);
          }
        }
      } else if (data[i].innerHTML.includes('Deaths')) {
        if (!res.deaths) {
          res.deaths = getStringAsNum(data[i - 1].innerHTML);
        }
      }
      // Texas doesn't report this (3/29)
      else if (data[i].innerHTML.includes('Hospital')) {
        if (!res.deaths) {
          res.hospitalizations = getStringAsNum(data[i + 1].innerHTML);
        }
      } else if (data[i].innerHTML.includes('Total Tests')) {
        if (!res.totalTests) {
          res.totalTests = getStringAsNum(data[i - 1].innerHTML);
        }
      } else if (data[i].innerHTML.includes('Public Lab')) {
        if (!stateTests) {
          stateTests = getStringAsNum(data[i - 1].innerHTML);
        }
      } else if (data[i].innerHTML.includes('Private Lab')) {
        if (!commercialTests) {
          commercialTests = getStringAsNum(data[i - 1].innerHTML);
        }
      }
      i += 1;
    }
    res.totalTests = commercialTests + stateTests;
    res.totalNegative = res.totalTests - res.totalPositive;

    // This is running in headless browser, so function needs
    // to be defined here
    function getStringAsNum(num) {
      // Remove commas
      const val = num.replace(',', '');
      return parseInt(val, 10);
    }
    return res;
  }

  async run() {
    let [page, browser] = [null, null];
    try {
      [page, browser] = await this.setupPuppet();
      await page.waitForSelector('div > svg > g.responsive-text-label > svg > text', {
        timeout: 15000,
      });
    } catch (err) {
      throw Error('There was an error setting up puppet');
    }

    this.data = await page.evaluate(this.scrapeData);
    browser.close();
    const blnDataHasChanged = await super.hasDataChanged(this.data);
    if (blnDataHasChanged) {
      await super.insertNewData(this.data);
    } else {
      console.log(`${this.state} data has not updated`);
    }
  }
}
