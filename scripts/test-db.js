import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

async function testConnections() {
  const cs = process.env.DATABASE_URL;
  if (!cs) {
    console.error('DATABASE_URL is not set in environment or .env');
    return;
  }

  console.log('Testing connection to Supabase PostgreSQL...');
  const client = new Client({
    connectionString: cs,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000
  });

  try {
    await client.connect();
    const res = await client.query('SELECT NOW() as now, version() as version;');
    console.log('SUCCESS! Database connected:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.log('Failed with error:', err.message);
    try { await client.end(); } catch {}
  }
}

testConnections();
