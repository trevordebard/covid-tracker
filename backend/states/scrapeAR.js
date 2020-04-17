export default () => {
  const res = {};
  const data = document.querySelectorAll('div > svg > g.responsive-text-label > svg > text');
  let i = 0;
  while (i < data.length) {
    if (data[i].innerHTML.includes('Cumulative Cases')) {
      const ancestorParentSelector =
        'div > div.flex-justify-center.widget-body.flex-fluid.full-width.flex-vertical.overflow-y-hidden.overflow-x-hidden';
      // Verify we are getting Arkansas cases and not US
      if (
        data[i].closest(ancestorParentSelector) &&
        data[i].closest(ancestorParentSelector).previousElementSibling.innerText.includes('Arkansas')
      ) {
        // check if total cases is set because US data uses 'Cumulative Cases' as label too
        if (!data.totalCases) {
          if (!res.totalCases) {
            res.totalCases = getStringAsNum(data[i + 1].innerHTML);
            i += 1;
          }
        }
      }
    } else if (data[i].innerHTML.includes('Deaths')) {
      // check if total cases is set because US data uses 'Death' as label too
      if (!res.deaths) {
        res.deaths = getStringAsNum(data[i + 1].innerHTML);
        i += 1;
      }
    } else if (data[i].innerHTML.includes('Total Tested')) {
      if (!res.totalTests) {
        res.totalTests = getStringAsNum(data[i + 1].innerHTML);
        i += 1;
      }
    } else if (data[i].innerHTML.includes('Positive Tests')) {
      if (!res.totalPositive) {
        res.totalPositive = getStringAsNum(data[i + 1].innerHTML);
        i += 1;
      }
    } else if (data[i].innerHTML.includes('Negative Tests')) {
      if (!res.totalNegative) {
        res.totalNegative = getStringAsNum(data[i + 1].innerHTML);
        i += 1;
      }
    }
    i += 1;
  }

  // This is running in headless browser, so function needs
  // to be defined here
  function getStringAsNum(num) {
    // Remove commas
    const res = num.replace(',', '');
    return parseInt(res, 10);
  }
  return res;
};
