import { Client } from 'pg';

const client = new Client({
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
});
client.connect();

// Add new case to database
export async function addData(state, totalCases, totalTests, totalPositive, totalNegative, deaths, hospitalizations) {
  console.log(state, totalCases, totalTests, totalPositive, totalNegative);
  const now = new Date();
  console.log(now);
  const sql = `INSERT INTO Cases ("state", "created", "totalCases", "totalTests", "totalPositive", "totalNegative", "deaths", "hospitalizations", "lastChecked") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
  const values = [state, now, totalCases, totalTests, totalPositive, totalNegative, deaths, hospitalizations, now];
  try {
    const res = await client.query(sql, values);
    console.log('Successfully added new cases to the database');
  } catch (err) {
    console.log('There was an error inserting a new case to the database');
    console.log(err);
  }
}

// Get the latest case data for a state
export async function getLatestEntry(state, date) {
  let res;
  const sql = `
        select *
        from (
            select max(created) as recent, state
            from cases
            ${date ? 'where cast(created As date) = $2' : ''}
            group by state
        ) r inner join cases c
        on r.recent=c.created and r.state = c.state
        where c.state=$1
    `;
  try {
    if (date) {
      res = await client.query(sql, [state, date]);
    } else {
      res = await client.query(sql, [state]);
    }
    // TODO: handle no results returned. This could be valid if a new state is added
    if (res.rows.length > 1) {
      console.log(`Error in getLatestEntry. Query returned: ${res.rows.length} rows. Expected one row.`);
    } else {
      return res.rows[0];
    }
  } catch (err) {
    console.log('Unknown in getLatestData');
    console.log(err);
  }
}

export async function updateLastChecked(state) {
  console.log(`Updating lastChecked for ${state}`);
  const now = new Date();
  const { id } = await getLatestEntry(state);
  const sql = `update cases set "lastChecked"=$1 where id=$2`;
  try {
    client.query(sql, [now, id]);
  } catch (e) {
    console.log(`Unable to update lastChecked in cases for id: ${id} with value ${now}`);
  }
}

export function getHistory(state) {
  console.log(`Getting ${state}'s history...`);
  const sql = `
    SELECT r.state, r.recent, c."totalPositive", c."totalNegative", c."totalCases", c.deaths, c."totalTests", c.hospitalizations
    FROM
      (SELECT state,
              max(created) AS recent
      FROM cases
      WHERE state = $1
      GROUP BY state,
                CAST(created AS date)) r
    INNER JOIN cases c ON r.recent = c.created
    AND r.state = c.state
    ORDER BY c.created DESC;
  `;

  return client.query(sql, [state]);
}
