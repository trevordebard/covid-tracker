import './utils/config';
import express from 'express';
import Arkansas from './states/Arkansas';
// import './utils/cron';

const app = express();

app.get('/AR', async (req, res, next) => {
  const AR = new Arkansas();
  res.json(await AR.getData());
});

app.listen(2093, () => {
  console.log(`Example App running on port http://localhost:2093`);
});

const AR = new Arkansas();
AR.run();
