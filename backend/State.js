import { updateLastChecked } from './utils/db';
import htmlConsumer from './lib/htmlConsumer';
import dataHandler from './lib/dataHandler';
import scraper from './lib/scraper';

export default function State(state) {
  const self = {
    state,
    data: null,
  };
  const runner = context => ({
    async run() {
      console.log(`running ${context.state}`);
      await context.scrape();
      let blnDataHasChanged = null;
      if (context.data) {
        blnDataHasChanged = await context.hasDataChanged(context.data).catch(() => (blnDataHasChanged = null));
      }
      if (blnDataHasChanged) {
        context.insertNewData(context.data);
      } else if (blnDataHasChanged === false) {
        updateLastChecked(context.state);
        console.log(`${context.state} data has not updated`);
      }
    },
  });
  return Object.assign(self, runner(self), htmlConsumer(self), dataHandler(self), scraper(self));
}
