import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

async function cleanSlate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing in environment!');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL. Clearing journal transactions...');

    // 1. Truncate all journal transactions
    await client.query('TRUNCATE TABLE journal_lines, journal_entries CASCADE;');
    console.log('Cleared all journal entries and lines (0 transactions).');

    // 2. Reset accounts initial balances to 0 so the accounting slate is completely clean
    await client.query('UPDATE accounts SET initial_balance = 0;');
    console.log('Reset all account initial balances to 0.');

    // 3. Verify counts
    const txCount = await client.query('SELECT count(*) as count FROM journal_entries;');
    const accCount = await client.query('SELECT count(*) as count FROM accounts;');

    console.log(`Clean slate verified!`);
    console.log(`- Total Akun (COA): ${accCount.rows[0].count} akun siap pakai.`);
    console.log(`- Total Transaksi: ${txCount.rows[0].count} transaksi (Bersih).`);
  } catch (err) {
    console.error('Clean slate error:', err);
  } finally {
    await client.end();
  }
}

cleanSlate();
