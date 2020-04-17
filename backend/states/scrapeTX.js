export default () => {
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
    } else if (data[i].innerHTML.includes('Fatal')) {
      if (!res.deaths) {
        res.deaths = getStringAsNum(data[i - 1].innerHTML);
      }
    }
    // Texas doesn't report this (3/29)
    else if (data[i].innerHTML.includes('Hospital')) {
      if (!res.hospitalizations) {
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
};
