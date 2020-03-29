/* eslint-disable no-use-before-define */
import State from '../State';

export default class Louisiana extends State {
    constructor() {
        let url =
            'https://www.arcgis.com/apps/opsdashboard/index.html#/69b726e2b82e408f89c3a54f96e8f776';
        super('LA', url);
        this.data = null;
    }

    scrapeData() {
        let res = {};
        let data = document.querySelectorAll('div > svg > g.responsive-text-label > svg > text');
        let i = 0;
        let stateTests = null;
        let commercialTests = null;
        while (i < data.length) {
            if (data[i].innerHTML.includes('Cases Reported')) {
                if (!data.totalCases) {
                    if (!res.totalCases) {
                        res.totalCases = getStringAsNum(data[i - 1].innerHTML);
                    }
                }
            } else if (data[i].innerHTML.includes('Deaths')) {
                if (!res.deaths) {
                    res.deaths = getStringAsNum(data[i - 1].innerHTML);
                }
            } else if (data[i].innerHTML.includes('Hospitals')) {
                if (!res.deaths) {
                    res.hospitalizations = getStringAsNum(data[i + 1].innerHTML);
                }
            }
            else if (data[i].innerHTML.includes('by State Lab')) {
                if (!stateTests) {
                    stateTests = getStringAsNum(data[i - 1].innerHTML);
                }
            } else if (data[i].innerHTML.includes('and Reported to State')) {
                if (!commercialTests) {
                    commercialTests = getStringAsNum(data[i - 1].innerHTML);
                }
            }
            i++;
        }
        res.totalTests = commercialTests + stateTests
        res.totalNegative = res.totalTests - res.totalPositive

        // This is running in headless browser, so function needs
        // to be defined here
        function getStringAsNum(num) {
            //Remove commas
            let res = num.replace(',', '');
            return parseInt(res, 10);
        }
        return res;
    }

    async run() {
        let [page, browser] = await this.setupPuppet();
        await page
            .waitForSelector('div > svg > g.responsive-text-label > svg > text', {
                timeout: 15000,
            })
            .catch(e => console.log('oops'));

        this.data = await page.evaluate(this.scrapeData);
        browser.close();
        let blnDataHasChanged = await super.hasDataChanged(this.data);
        if (blnDataHasChanged) {
            await super.insertNewData(this.data);
        } else {
            console.log('Data has not updated');
        }
    }
}
