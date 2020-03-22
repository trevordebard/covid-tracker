import { Client } from 'pg';

const client = new Client({
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
});
client.connect();

// // Add new case to database
export async function addData(
  state,
  totalCases,
  stateLabPositive,
  commercialLabPositive,
  totalTests,
  commercialLabTestTotal,
  stateLabTestTotal,
) {
  const now = new Date();
  const sql = `INSERT INTO Cases ("state", "created", "totalCases", "stateLabPositive", "commercialLabPositive", "totalTests", "commercialLabTestTotal", "stateLabTestTotal") VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;
  const values = [
    state,
    now,
    totalCases,
    stateLabPositive,
    commercialLabPositive,
    totalTests,
    commercialLabTestTotal,
    stateLabTestTotal,
  ];
  try {
    const res = await client.query(sql, values);
    console.log('Successfully added new cases to the database');
  } catch (err) {
    console.log('There was an error inserting a new case to the database');
    console.log(err);
  }
}

// Get the latest case data for a state
export async function getLatestEntry(state) {
  let res;
  const sql = `
        select *
        from (
            select max(created) as recent, state
            from cases
            group by state
        ) r inner join cases c
        on r.recent=c.created and r.state = c.state
        where c.state=$1
    `;
  try {
    res = await client.query(sql, [state]);
    // TODO: handle no results returned. This could be valid if a new state is added
    if (res.rows.length > 1) {
      console.log(
        `Error in getLatestEntry. Query returned: ${res.rows.length} rows. Expected one row.`,
      );
    }
  } catch (err) {
    console.log('Unknown in getLatestData');
    console.log(err.stack);
    return err;
  }
  return res.rows[0];
}
