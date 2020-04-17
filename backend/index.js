import './utils/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { scheduleCron } from './utils/cron';
import { getLatestEntry, getHistory } from './utils/db';
import State from './State';

// TODO: Entire app needs to handle promises and errors significantly better than it currently is
if (process.env.RUN_CRON) {
  scheduleCron();
}
const app = express();
app.use(express.static(path.join(__dirname, '../public')));
const allowedOrigins = [
  'http://localhost:2043',
  'http://localhost:1234',
  'http://167.172.224.227:2093',
  'http://167.172.224.227:1234',
  'http://172.16.245.35:1234',
  'https://ronatrace.xyz',
  'https://www.ronatrace.xyz',
];
app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.get('/api/history', async (req, res) => {
  const data = await getHistory(req.query.state);
  if (data.rows.length > 0) {
    res.json(data.rows);
  } else {
    res.status(500).send('Error getting history');
  }
});
app.get('/api/AR', async (req, res, next) => {
  const AR = State('AR');
  try {
    const data = await AR.getData();
    return res.json(data);
  } catch (err) {
    return res.status(500).send('Error retrieving data');
  }
});
app.get('/api/LA', async (req, res, next) => {
  const LA = State('LA');
  try {
    const data = await LA.getData();
    return res.json(data);
  } catch (err) {
    return res.status(500).send('Error retrieving data');
  }
});
app.get('/api/TX', async (req, res, next) => {
  const TX = State('TX');
  try {
    const data = await TX.getData();
    return res.json(data);
  } catch (err) {
    return res.status(500).send('Error retrieving data');
  }
});

if (process.env.NODE_ENV === 'production') {
  app.listen(process.env.PROD_PORT, () => {
    console.log(`Example App running on port ${process.env.PROD_PORT}`);
  });
} else {
  app.get('/test', async (req, res, next) => {
    console.log('testing...');
    if (req.query.state === 'AR') {
      const AR = State('AR');
      await AR.run();
    } else if (req.query.state === 'LA') {
      const LA = State('LA');
      await LA.run();
    } else if (req.query.state === 'TX') {
      const TX = State('TX');
      await TX.run();
    } else {
      const AR = State('AR');
      AR.run();
      const LA = State('LA');
      LA.run();
      const TX = State('TX');
      TX.run();
    }
  });
  app.get('/latest', (req, res) => {
    getLatestEntry(req.query.state, req.query.date).then(data => {
      res.json(data);
    });
  });

  app.listen(process.env.DEV_PORT, () => {
    console.log(`Example App running on port ${process.env.DEV_PORT}`);
  });
}
