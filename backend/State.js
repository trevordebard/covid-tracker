import axios from 'axios';
import puppeteer from 'puppeteer';
import { getLatestEntry, addData, updateLastChecked } from './utils/db';

export default class State {
  constructor(state, url) {
    this.state = state;
    this.url = url;
    this.data = null;
  }

  async setupPuppet() {
    let browser = null;
    let page = null;
    try {
      browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      page = await browser.newPage();
      await page.goto(this.url, { waitUntil: 'networkidle0' });
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

  async run() {
    let [page, browser] = [null, null];
    try {
      [page, browser] = await this.setupPuppet();
      await page.waitForSelector('div > svg > g.responsive-text-label > svg > text', {
        timeout: 15000,
      });
      this.data = await page.evaluate(this.scrapeData);
    } catch (e) {
      console.log('There was an error seting up puppet or evaluating the page in State.js');
      throw e;
    } finally {
      if (browser) {
        console.log('closing browser2');
        browser.close();
      }
    }
    let blnDataHasChanged = null;
    if (this.data) {
      try {
        blnDataHasChanged = await this.hasDataChanged(this.data);
      } catch (e) {
        throw e;
      }
    }
    if (blnDataHasChanged) {
      this.insertNewData(this.data);
    } else if (blnDataHasChanged === false) {
      updateLastChecked(this.state);
      console.log(`${this.state} data has not updated`);
    }
  }

  async hasDataChanged({ totalCases, totalTests, deaths, hospitalizations }) {
    console.log('Checking if data has changed.');
    const latestEntry = await getLatestEntry(this.state);

    // intentionally using == because we want null and undefined comparisons to return true
    if (
      totalCases == latestEntry.totalCases &&
      totalTests == latestEntry.totalTests &&
      deaths == latestEntry.deaths &&
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
