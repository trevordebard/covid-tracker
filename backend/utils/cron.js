// This file will run the scrapers and update the database for each state every five minutes

import cron from 'node-cron';
import State from '../State';

export function scheduleCron() {
  console.log('Scheduling cron...');
  cron.schedule(`*/15 * * * *`, async () => {
    console.log('Cron running');
    const AR = State('AR');
    const LA = State('LA');
    const TX = State('TX');
    try {
      await AR.run();
    } catch (e) {
      console.error('AR Failed');
      console.error(e);
    }
    try {
      try {
        await LA.run();
      } catch (e) {
        console.error('LA Failed');
        console.error(e);
      }
      await TX.run();
    } catch (e) {
      console.error('TX Failed');
      console.error(e);
    }
  });
}
