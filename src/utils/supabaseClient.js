import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SUPABASE_URL)
  ? import.meta.env.PUBLIC_SUPABASE_URL
  : 'https://aeyzxmydkaifizbyuyex.supabase.co';

export const SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SUPABASE_KEY)
  ? import.meta.env.PUBLIC_SUPABASE_KEY
  : 'sb_publishable_jsj-JTNUpwucIg6rWcTR2g_XaROc0C8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  global: {
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  }
});

// Fetch all accounts from Supabase PostgreSQL
export async function fetchAccountsFromDb() {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(row => ({
        code: row.code,
        name: row.name,
        category: row.category,
        subCategory: row.sub_category,
        normalBalance: row.normal_balance,
        initialBalance: parseFloat(row.initial_balance) || 0,
        description: row.description
      }));
    }
  } catch (err) {
    console.warn('[Supabase] Failed to fetch accounts from DB, using local state:', err.message);
  }
  return null;
}

// Upsert account
export async function saveAccountToDb(account) {
  try {
    const payload = {
      code: account.code,
      name: account.name,
      category: account.category,
      sub_category: account.subCategory,
      normal_balance: account.normalBalance,
      initial_balance: account.initialBalance || 0,
      description: account.description,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('accounts').upsert(payload, { onConflict: 'code' });
    if (error) throw error;
  } catch (err) {
    console.warn('[Supabase] Failed to save account to DB:', err.message);
  }
}

// Delete account
export async function deleteAccountFromDb(code) {
  try {
    const { error } = await supabase.from('accounts').delete().eq('code', code);
    if (error) throw error;
  } catch (err) {
    console.warn('[Supabase] Failed to delete account from DB:', err.message);
  }
}

// Fetch all journal transactions
export async function fetchTransactionsFromDb() {
  try {
    const { data: entries, error: errEntries } = await supabase
      .from('journal_entries')
      .select('id, voucher_no, date, description, reference')
      .order('date', { ascending: false });

    if (errEntries) throw errEntries;

    const { data: lines, error: errLines } = await supabase
      .from('journal_lines')
      .select('*')
      .order('line_order', { ascending: true });

    if (!entries || entries.length === 0) {
      return [];
    }

    const lineMap = {};
      lines.forEach(l => {
        if (!lineMap[l.journal_id]) lineMap[l.journal_id] = [];
        lineMap[l.journal_id].push({
          accountCode: l.account_code,
          debit: parseFloat(l.debit) || 0,
          credit: parseFloat(l.credit) || 0,
          memo: l.memo
        });
      });

      return entries.map(e => ({
        id: e.id,
        voucherNo: e.voucher_no,
        date: e.date,
        description: e.description,
        reference: e.reference,
        lines: lineMap[e.id] || []
      }));
  } catch (err) {
    console.warn('[Supabase] Failed to fetch transactions from DB, using local state:', err.message);
  }
  return null;
}

// Save journal transaction
export async function saveTransactionToDb(tx) {
  try {
    const { data: entry, error: errEntry } = await supabase
      .from('journal_entries')
      .upsert({
        voucher_no: tx.voucherNo,
        date: tx.date,
        description: tx.description,
        reference: tx.reference || ''
      }, { onConflict: 'voucher_no' })
      .select('id')
      .single();

    if (errEntry) throw errEntry;

    if (entry && tx.lines) {
      await supabase.from('journal_lines').delete().eq('journal_id', entry.id);

      const linesPayload = tx.lines.map((l, idx) => ({
        journal_id: entry.id,
        account_code: l.accountCode,
        debit: parseFloat(l.debit) || 0,
        credit: parseFloat(l.credit) || 0,
        memo: l.memo || '',
        line_order: idx
      }));

      await supabase.from('journal_lines').insert(linesPayload);
    }
  } catch (err) {
    console.warn('[Supabase] Failed to save transaction to DB:', err.message);
  }
}

// Delete journal transaction
export async function deleteTransactionFromDb(voucherNo) {
  try {
    const { error } = await supabase.from('journal_entries').delete().eq('voucher_no', voucherNo);
    if (error) throw error;
  } catch (err) {
    console.warn('[Supabase] Failed to delete transaction from DB:', err.message);
  }
}

// Paper Settings
export async function fetchPaperSettingsFromDb() {
  try {
    const { data, error } = await supabase
      .from('paper_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) throw error;
    if (data) {
      return {
        paperSize: data.paper_size,
        orientation: data.orientation,
        marginTop: data.margin_top,
        marginBottom: data.margin_bottom,
        marginLeft: data.margin_left,
        marginRight: data.margin_right,
        companyName: data.company_name,
        companyTagline: data.company_tagline,
        companyAddress: data.company_address,
        companyContact: data.company_contact,
        companyNPWP: data.company_npwp,
        signatoryName: data.signatory_name,
        signatoryTitle: data.signatory_title,
        documentFooterNote: data.document_footer_note
      };
    }
  } catch (err) {
    console.warn('[Supabase] Failed to fetch paper settings:', err.message);
  }
  return null;
}

export async function savePaperSettingsToDb(settings) {
  try {
    await supabase.from('paper_settings').upsert({
      id: 'default',
      paper_size: settings.paperSize,
      orientation: settings.orientation,
      margin_top: settings.marginTop,
      margin_bottom: settings.marginBottom,
      margin_left: settings.marginLeft,
      margin_right: settings.marginRight,
      company_name: settings.companyName,
      company_tagline: settings.companyTagline,
      company_address: settings.companyAddress,
      company_contact: settings.companyContact,
      company_npwp: settings.companyNPWP,
      signatory_name: settings.signatoryName,
      signatory_title: settings.signatoryTitle,
      document_footer_note: settings.documentFooterNote,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Supabase] Failed to save paper settings:', err.message);
  }
}

// Access Code
export async function fetchAccessCodeFromDb() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'access_code')
      .single();

    if (error) throw error;
    if (data && data.value) return data.value;
  } catch (err) {
    console.warn('[Supabase] Failed to fetch access code from DB:', err.message);
  }
  return null;
}

export async function saveAccessCodeToDb(code) {
  try {
    await supabase.from('system_settings').upsert({
      key: 'access_code',
      value: code,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Supabase] Failed to save access code:', err.message);
  }
}
