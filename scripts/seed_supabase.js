import { Client } from 'pg';
import { INITIAL_ACCOUNTS, DEFAULT_PAPER_SETTINGS } from '../src/data/accountingStore.js';

async function main() {
  const client = new Client({
    host: 'aws-0-ap-northeast-2.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.aeyzxmydkaifizbyuyex',
    password: 'Dani22334455@!',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Supabase PostgreSQL');

  // Disable RLS and grant permissions
  await client.query(`
    ALTER TABLE IF EXISTS accounts DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS journal_entries DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS journal_lines DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS paper_settings DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS system_settings DISABLE ROW LEVEL SECURITY;

    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
  `);

  // Clear any existing journals & accounts
  await client.query('DELETE FROM journal_lines');
  await client.query('DELETE FROM journal_entries');
  await client.query('DELETE FROM accounts');
  console.log('Purged old transactions & accounts');

  // Insert fresh clean accounts with initial_balance = 0
  for (const acc of INITIAL_ACCOUNTS) {
    await client.query(
      `INSERT INTO accounts (id, code, name, category, sub_category, normal_balance, initial_balance, description)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)`,
      [acc.code, acc.name, acc.category, acc.subCategory, acc.normalBalance, 0, acc.description]
    );
  }
  console.log(`Successfully seeded ${INITIAL_ACCOUNTS.length} clean accounts with 0 balance!`);

  // Upsert paper settings
  await client.query(
    `INSERT INTO paper_settings (
       id, paper_size, orientation, margin_top, margin_bottom, margin_left, margin_right,
       company_name, company_tagline, company_address, company_contact, company_npwp,
       signatory_name, signatory_title, document_footer_note,
       show_logo, logo_url, logo_width, show_signature, signatory_city, signatory_date_mode,
       signatory_custom_date, signature_image_url, show_stamp, stamp_text, stamp_image_url, stamp_color
     ) VALUES (
       'default', 'A4', 'portrait', 15, 15, 15, 15,
       $1, $2, $3, $4, $5,
       $6, $7, $8,
       true, '', 70, true, 'Jakarta', 'auto',
       '', '', true, $9, '', '#991b1b'
     ) ON CONFLICT (id) DO UPDATE SET
       company_name = EXCLUDED.company_name,
       company_tagline = EXCLUDED.company_tagline,
       company_address = EXCLUDED.company_address,
       company_contact = EXCLUDED.company_contact,
       company_npwp = EXCLUDED.company_npwp,
       signatory_name = EXCLUDED.signatory_name,
       signatory_title = EXCLUDED.signatory_title,
       document_footer_note = EXCLUDED.document_footer_note,
       stamp_text = EXCLUDED.stamp_text;`,
    [
      DEFAULT_PAPER_SETTINGS.companyName,
      DEFAULT_PAPER_SETTINGS.companyTagline,
      DEFAULT_PAPER_SETTINGS.companyAddress,
      DEFAULT_PAPER_SETTINGS.companyContact,
      DEFAULT_PAPER_SETTINGS.companyNPWP,
      DEFAULT_PAPER_SETTINGS.signatoryName,
      DEFAULT_PAPER_SETTINGS.signatoryTitle,
      DEFAULT_PAPER_SETTINGS.documentFooterNote,
      DEFAULT_PAPER_SETTINGS.stampText
    ]
  );
  console.log('Paper settings synchronized');

  // Ensure default access code
  await client.query(
    `INSERT INTO system_settings (key, value)
     VALUES ('access_code', '1995')
     ON CONFLICT (key) DO NOTHING;`
  );

  const accCount = await client.query('SELECT count(*) FROM accounts');
  const txCount = await client.query('SELECT count(*) FROM journal_entries');
  console.log('FINAL STATE IN SUPABASE:');
  console.log('- Accounts:', accCount.rows[0].count);
  console.log('- Journal Transactions:', txCount.rows[0].count);

  await client.end();
}

main().catch(console.error);
