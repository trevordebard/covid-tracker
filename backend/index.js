import './utils/config';
import express from 'express';
import Arkansas from './states/Arkansas';
import cors from 'cors';
import bodyparser from 'body-parser'

import { scheduleCron } from './utils/cron';

// TODO: Entire app needs to handle promises and errors significantly better than it currently is
if (process.env.RUN_CRON) {
  scheduleCron();
}
const app = express();
const allowedOrigins = ['http://localhost:2043', 'http://localhost:1234', 'http://167.172.224.227:2093', 'http://167.172.224.227', 'http://167.172.224.227:1234']
app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      console.log(origin)
      if (!origin) return callback(null, true);
      console.log(origin)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.get('/api/AR', (req, res, next) => {
  const AR = new Arkansas();
  AR.getData().then(r => res.json(r))
});

app.listen(2093, () => {
  console.log(`Example App running on port http://localhost:2093`);
});
