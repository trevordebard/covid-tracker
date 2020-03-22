import axios from 'axios';
import { getLatestEntry, addData } from './utils/db';

export default class State {
  constructor(state) {
    this.state = state;
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

  insertNewData({
    totalCases,
    stateLabPositive,
    commercialLabPositive,
    totalTests,
    commercialLabTestTotal,
    stateLabTestTotal,
  }) {
    console.log('Inserting new data');
    addData(
      this.state,
      totalCases,
      stateLabPositive,
      commercialLabPositive,
      totalTests,
      commercialLabTestTotal,
      stateLabTestTotal,
    );
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
