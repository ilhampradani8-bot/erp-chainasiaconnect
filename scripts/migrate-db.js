import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, DEFAULT_PAPER_SETTINGS } from '../src/data/accountingStore.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/postgres';

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in environment or .env!');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL. Creating schema...');

    // 1. Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(30) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        sub_category VARCHAR(100),
        normal_balance VARCHAR(2) NOT NULL CHECK (normal_balance IN ('D', 'K')),
        initial_balance NUMERIC(18,2) DEFAULT 0,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS journal_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        voucher_no VARCHAR(60) UNIQUE NOT NULL,
        date DATE NOT NULL,
        description TEXT NOT NULL,
        reference VARCHAR(120),
        created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS journal_lines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        journal_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
        account_code VARCHAR(30) NOT NULL REFERENCES accounts(code) ON UPDATE CASCADE,
        debit NUMERIC(18,2) DEFAULT 0 CHECK (debit >= 0),
        credit NUMERIC(18,2) DEFAULT 0 CHECK (credit >= 0),
        memo VARCHAR(255),
        line_order INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS paper_settings (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
        paper_size VARCHAR(50) DEFAULT 'A4',
        orientation VARCHAR(20) DEFAULT 'portrait',
        margin_top INT DEFAULT 15,
        margin_bottom INT DEFAULT 15,
        margin_left INT DEFAULT 15,
        margin_right INT DEFAULT 15,
        company_name VARCHAR(255),
        company_tagline VARCHAR(255),
        company_address TEXT,
        company_contact VARCHAR(255),
        company_npwp VARCHAR(100),
        signatory_name VARCHAR(255),
        signatory_title VARCHAR(255),
        document_footer_note TEXT,
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('Tables created successfully!');

    // 2. Seed Initial Accounts if empty
    const checkAccounts = await client.query('SELECT count(*) as count FROM accounts');
    if (parseInt(checkAccounts.rows[0].count, 10) === 0) {
      console.log('Seeding initial Chart of Accounts...');
      for (const acc of INITIAL_ACCOUNTS) {
        await client.query(
          `INSERT INTO accounts (code, name, category, sub_category, normal_balance, initial_balance, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (code) DO NOTHING`,
          [acc.code, acc.name, acc.category, acc.subCategory || '', acc.normalBalance, acc.initialBalance || 0, acc.description || '']
        );
      }
      console.log(`Seeded ${INITIAL_ACCOUNTS.length} accounts.`);
    } else {
      console.log(`Accounts already has ${checkAccounts.rows[0].count} records.`);
    }

    // 3. Seed Initial Transactions if empty
    const checkTx = await client.query('SELECT count(*) as count FROM journal_entries');
    if (parseInt(checkTx.rows[0].count, 10) === 0) {
      console.log('Seeding initial Journal Entries...');
      for (const tx of INITIAL_TRANSACTIONS) {
        const res = await client.query(
          `INSERT INTO journal_entries (voucher_no, date, description, reference)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [tx.voucherNo, tx.date, tx.description, tx.reference || '']
        );
        const journalId = res.rows[0].id;
        for (let i = 0; i < tx.lines.length; i++) {
          const l = tx.lines[i];
          await client.query(
            `INSERT INTO journal_lines (journal_id, account_code, debit, credit, memo, line_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [journalId, l.accountCode, l.debit || 0, l.credit || 0, l.memo || '', i]
          );
        }
      }
      console.log(`Seeded ${INITIAL_TRANSACTIONS.length} journal transactions.`);
    } else {
      console.log(`Journal entries already has ${checkTx.rows[0].count} records.`);
    }

    // 4. Seed Paper Settings & Access Code
    await client.query(
      `INSERT INTO paper_settings (id, paper_size, orientation, margin_top, margin_bottom, margin_left, margin_right, company_name, company_tagline, company_address, company_contact, company_npwp, signatory_name, signatory_title, document_footer_note)
       VALUES ('default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (id) DO NOTHING`,
      [
        DEFAULT_PAPER_SETTINGS.paperSize,
        DEFAULT_PAPER_SETTINGS.orientation,
        DEFAULT_PAPER_SETTINGS.marginTop,
        DEFAULT_PAPER_SETTINGS.marginBottom,
        DEFAULT_PAPER_SETTINGS.marginLeft,
        DEFAULT_PAPER_SETTINGS.marginRight,
        DEFAULT_PAPER_SETTINGS.companyName,
        DEFAULT_PAPER_SETTINGS.companyTagline,
        DEFAULT_PAPER_SETTINGS.companyAddress,
        DEFAULT_PAPER_SETTINGS.companyContact,
        DEFAULT_PAPER_SETTINGS.companyNPWP,
        DEFAULT_PAPER_SETTINGS.signatoryName,
        DEFAULT_PAPER_SETTINGS.signatoryTitle,
        DEFAULT_PAPER_SETTINGS.documentFooterNote
      ]
    );

    await client.query(
      `INSERT INTO system_settings (key, value)
       VALUES ('access_code', '123456')
       ON CONFLICT (key) DO NOTHING`
    );

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

migrate();
