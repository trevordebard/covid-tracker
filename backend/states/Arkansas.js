/* eslint-disable no-use-before-define */
import cheerio from 'cheerio';
import State from '../State';

export default class Arkansas extends State {
  constructor() {
    super('AR');
    this.data = null;
    this.url =
      'https://www.healthy.arkansas.gov/programs-services/topics/novel-coronavirus';
  }

  async scrapeData() {
    console.log('Scraping data');
    let html;
    let result = null;
    try {
      html = await State.getHTML(this.url);
    } catch (err) {
      return false;
    }
    const $ = cheerio.load(html);
    const tables = $('table').toArray();

    const { caseDataTable, testDataTable } = findTablesWithData(tables);
    if (caseDataTable && testDataTable) {
      result = getCaseDataFromTable(caseDataTable);

      // Calculate test data totals
      const testData = getTestDataFromTable(testDataTable);
      const stateLabTestTotal =
        testData.stateLabNegative + result.stateLabPositive;
      const commercialLabTestTotal =
        testData.commercialLabNegative + result.commercialLabPositive;
      // Set test data
      result.stateLabTestTotal = stateLabTestTotal;
      result.commercialLabTestTotal = commercialLabTestTotal;
      result.totalTests = testData.totalTests;
    }
    return result;
  }

  async run() {
    try {
      this.data = await this.scrapeData();
    } catch (err) {
      console.log('Unable to scrape Arkansas data');
    }
    if (this.data) {
      const blnDataChanged = await this.hasDataChanged(this.data);
      if (blnDataChanged) {
        this.insertNewData(this.data);
      } else {
        console.log('No Change');
      }
    }
  }
}

// TODO: combine getCaseDataFromTable and getTestDataFromTable

// Parse html table to get case data
function getCaseDataFromTable(table) {
  const $ = cheerio.load(table);
  const data = {};
  $(table)
    .find('tbody > tr > td')
    .each((index, element) => {
      const label = $(element).text();
      const value = $(element)
        .next()
        .text();
      if (label.includes('Confirmed')) {
        data.totalCases = parseInt(value, 10);
      } else if (label.includes('Health Lab')) {
        data.stateLabPositive = parseInt(value, 10);
      } else if (label.includes('Commercial')) {
        data.commercialLabPositive = parseInt(value, 10);
      }
    });
  return data;
}

// Get test data from test html table
function getTestDataFromTable(table) {
  const $ = cheerio.load(table);
  const data = {};
  $(table)
    .find('tbody > tr > td')
    .each((i, element) => {
      const label = $(element).text();
      const value = $(element)
        .next()
        .text();
      if (label.includes('Past PUIs with negative')) {
        data.totalTests = parseInt(value, 10);
      } else if (label.includes('Department of Health Lab negative')) {
        data.stateLabNegative = parseInt(value, 10);
      } else if (label.includes('Commercial Lab negative')) {
        data.commercialLabNegative = parseInt(value, 10);
      }
    });
  return data;
}

// Find the html table that has the case data
function findTablesWithData(tables) {
  const $ = cheerio.load(tables);
  let caseDataTable = null;
  let testDataTable = null;
  tables.forEach(table => {
    if (
      $(table)
        .find('thead tr th')
        .text()
        .split(' ')[0]
        .toLowerCase() === 'status'
    ) {
      caseDataTable = table;
    } else if (
      $(table)
        .find('tbody tr td')
        .text()
        .includes('Past PUIs')
    ) {
      testDataTable = table;
    }
  });
  return { caseDataTable, testDataTable };
}
