import { getLatestEntry, addData } from '../utils/db';

export default () => ({
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
  },
  async getData() {
    try {
      return await getLatestEntry(this.state);
    } catch (err) {
      console.log('Unable to get latest entry');
      throw err;
    }
  },
  insertNewData({ totalCases, totalTests, totalPositive, totalNegative, deaths, hospitalizations }) {
    addData(this.state, totalCases, totalTests, totalPositive, totalNegative, deaths, hospitalizations).catch(() =>
      console.log('Failed to insert data')
    );
  },
});
