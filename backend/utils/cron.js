// This file will run the scrapers and update the database for each state every five minutes

import cron from 'node-cron';
import Arkansas from '../states/Arkansas';

cron.schedule(`* * * * *`, async () => {
  console.log('Cron running');
  const AR = new Arkansas();
  await AR.run();
});
