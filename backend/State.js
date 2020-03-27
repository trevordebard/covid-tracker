import axios from 'axios';
import puppeteer from 'puppeteer';
import { getLatestEntry, addData } from './utils/db';

export default class State {
  constructor(state, url) {
    this.state = state;
    this.url = url;
  }

  async setupPuppet(url) {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(this.url, { waitUntil: 'networkidle0' });
    return [page, browser];
  }

  async hasDataChanged({ totalCases, totalTests }) {
    console.log('Checking if data has changed.');
    const latestEntry = await getLatestEntry(this.state);
    if (
      totalCases === latestEntry.totalCases &&
      totalTests === latestEntry.totalTests
    ) {
      return false;
    }
    return true;
  }

  async getData() {
    return getLatestEntry(this.state);
  }

  insertNewData({ totalCases, totalTests, totalPositive, totalNegative }) {
    console.log('Inserting new data');
    addData(this.state, totalCases, totalTests, totalPositive, totalNegative);
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
