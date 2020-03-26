import './utils/config';
import express from 'express';
import Arkansas from './states/Arkansas';
import cors from 'cors';

import { scheduleCron } from './utils/cron';

// TODO: Entire app needs to handle promises and errors significantly better than it currently is
if (process.env.RUN_CRON) {
  scheduleCron();
}
const app = express();

var whitelist = [
  'http://localhost:1234',
  'http://localhost:2093',
  'http://localhost:8888',
  'https://167.172.224.227',
  'https://167.172.224.227:1234',
  'http://167.172.224.227:1234',

];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));
app.get('/api/AR', async (req, res, next) => {
  const AR = new Arkansas();
  res.json(await AR.getData());
});

app.listen(8888, () => {
  console.log(`Example App running on port http://localhost:2093`);
});
