import axios from 'axios';
import puppeteer from 'puppeteer';
import { getLatestEntry, addData } from './utils/db';

export default class State {
  constructor(state, url) {
    this.state = state;
    this.url = url;
    this.data = null;
  }

  async setupPuppet(url) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
      await page.goto(this.url, { waitUntil: 'networkidle0' });
      return [page, browser];
    } catch (err) {
      console.log('There was an error going to URL');
      throw err;
    }
  }

  async run() {
    const [page, browser] = await this.setupPuppet();
    await page
      .waitForSelector('div > svg > g.responsive-text-label > svg > text', {
        timeout: 15000,
      })
      .catch(e => console.log('Unable to wait for selector'));
    this.data = await page.evaluate(this.scrapeData);
    browser.close();
    const blnDataHasChanged = await this.hasDataChanged(this.data);
    if (blnDataHasChanged) {
      this.insertNewData(this.data);
    } else {
      console.log(`${this.state} data has not updated`);
    }
  }

  async hasDataChanged({ totalCases, totalTests, deaths, hospitalizations }) {
    console.log('Checking if data has changed.');
    const latestEntry = await getLatestEntry(this.state);

    // hospitalizations can be undefined in latest entry
    if (
      totalCases === latestEntry.totalCases &&
      totalTests === latestEntry.totalTests &&
      deaths === latestEntry.deaths &&
      hospitalizations == latestEntry.hospitalizations
    ) {
      return false;
    }
    return true;
  }

  async getData() {
    return getLatestEntry(this.state);
  }

  insertNewData({ totalCases, totalTests, totalPositive, totalNegative, deaths, hospitalizations }) {
    console.log('Inserting new data');
    addData(this.state, totalCases, totalTests, totalPositive, totalNegative, deaths, hospitalizations);
  }

  static async getHTML(url) {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error('Error in getHTML:');
      console.error(err);
    }
  }
}
