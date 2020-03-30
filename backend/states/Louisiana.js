/* eslint-disable no-use-before-define */
import State from '../State';

export default class Louisiana extends State {
  constructor() {
    const url = 'https://www.arcgis.com/apps/opsdashboard/index.html#/69b726e2b82e408f89c3a54f96e8f776';
    super('LA', url);
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
            // Louisiana doesn't differentiate
            res.totalCases = getStringAsNum(data[i - 1].innerHTML);
            res.totalPositive = getStringAsNum(data[i - 1].innerHTML);
          }
        }
      } else if (data[i].innerHTML.includes('Deaths')) {
        if (!res.deaths) {
          res.deaths = getStringAsNum(data[i - 1].innerHTML);
        }
      } else if (data[i].innerHTML.includes('Hospitals')) {
        if (!res.hospitalizations) {
          res.hospitalizations = getStringAsNum(data[i + 1].innerHTML);
        }
      } else if (data[i].innerHTML.includes('by State Lab')) {
        if (!stateTests) {
          stateTests = getStringAsNum(data[i - 1].innerHTML);
        }
      } else if (data[i].innerHTML.includes('and Reported to State')) {
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
}
