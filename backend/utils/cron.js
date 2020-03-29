// This file will run the scrapers and update the database for each state every five minutes

import cron from 'node-cron';
import Arkansas from '../states/Arkansas';
import Louisiana from '../states/Louisiana';
import Texas from '../states/Texas';

export function scheduleCron() {
  console.log('Scheduling cron...');
  cron.schedule(`*/5 * * * *`, async () => {
    console.log('Cron running');
    const AR = new Arkansas();
    const LA = new Louisiana();
    const TX = new Texas();
    await AR.run();
    await LA.run();
    await TX.run();
  });
}
