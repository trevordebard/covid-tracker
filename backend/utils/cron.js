// This file will run the scrapers and update the database for each state every five minutes

import cron from 'node-cron';
import State from '../State';

export function scheduleCron() {
  console.log('Scheduling cron...');
  cron.schedule(`*/5 * * * *`, async () => {
    console.log('Cron running');
    const AR = State('AR');
    const LA = State('LA');
    const TX = State('TX');
    AR.run();
    LA.run();
    TX.run();
  });
}
