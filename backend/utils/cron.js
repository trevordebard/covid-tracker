// This file will run the scrapers and update the database for each state every five minutes

import cron from 'node-cron';
import Arkansas from '../states/Arkansas';

export function scheduleCron() {
  console.log('Scheduling cron...');
  cron.schedule(`*/5 * * * *`, async () => {
    console.log('Cron running');
    const AR = new Arkansas();
    await AR.run();
  });
}
