import React, { useState } from 'react';
import { calculateGeneralLedger, formatRupiah, formatNumber } from '../utils/accountingMath';
import { BookOpen, Search, Printer, ArrowRight } from 'lucide-react';

export default function BukuBesarView({
  accounts,
  transactions,
  onPrint
}) {
  const [selectedAccountCode, setSelectedAccountCode] = useState(accounts[0]?.code || '1-1002');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const ledger = calculateGeneralLedger(selectedAccountCode, accounts, transactions, dateStart, dateEnd);
  const { account, rows, endingBalance, openingBalance } = ledger;

  const totalDebit = rows.filter(r => r.voucherNo !== 'SALDO-AWAL').reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.filter(r => r.voucherNo !== 'SALDO-AWAL').reduce((s, r) => s + r.credit, 0);

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      {/* 1. Account Selector Bar */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px 10px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: '600', fontSize: '11.5px' }}>Pilih Akun Buku Besar:</label>
          <select
            value={selectedAccountCode}
            onChange={(e) => setSelectedAccountCode(e.target.value)}
            style={{ minWidth: '300px', fontWeight: '500' }}
          >
            {accounts.map(acc => (
              <option key={acc.code} value={acc.code}>
                [{acc.code}] {acc.name} ({acc.category} - Saldo Normal: {acc.normalBalance === 'D' ? 'Debit' : 'Kredit'})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
          <span>Periode:</span>
          <input
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            style={{ width: '125px', padding: '2px 4px' }}
          />
          <span>s/d</span>
          <input
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            style={{ width: '125px', padding: '2px 4px' }}
          />
          <button onClick={onPrint} style={{ marginLeft: '6px' }}>
            <Printer size={12} />
            <span>Cetak Akun Ini</span>
          </button>
        </div>
      </div>

      {/* 2. Account Overview Header Box */}
      {account && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px inset #000',
          padding: '8px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          fontSize: '11.5px'
        }}>
          <div>
            <div style={{ color: '#666', fontSize: '10.5px' }}>Kode & Nama Akun:</div>
            <div style={{ fontWeight: 'bold', color: 'var(--color-navy-blue)' }}>[{account.code}] {account.name}</div>
            <div style={{ color: '#777', fontSize: '10px' }}>Kategori: {account.category} ({account.subCategory})</div>
          </div>

          <div>
            <div style={{ color: '#666', fontSize: '10.5px' }}>Saldo Awal Buku:</div>
            <div style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold', fontSize: '13px' }}>
              {formatRupiah(account.initialBalance || 0)}
            </div>
            <div style={{ color: '#777', fontSize: '10px' }}>Posisi: {account.normalBalance === 'D' ? 'Debit' : 'Kredit'}</div>
          </div>

          <div>
            <div style={{ color: '#666', fontSize: '10.5px' }}>Total Mutasi Periode:</div>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>
              Deb: {formatNumber(totalDebit)}
            </div>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>
              Kre: {formatNumber(totalCredit)}
            </div>
          </div>

          <div>
            <div style={{ color: '#666', fontSize: '10.5px' }}>Saldo Akhir Berjalan:</div>
            <div style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold', fontSize: '14px', color: endingBalance >= 0 ? '#00007c' : '#b00' }}>
              {formatRupiah(endingBalance)}
            </div>
            <div style={{ color: '#166534', fontSize: '10px', fontWeight: '600' }}>Aktif & Terverifikasi</div>
          </div>
        </div>
      )}

      {/* 3. General Ledger Table with Running Balance */}
      <div className="excel-table-container" style={{ flex: 1, minHeight: '300px' }}>
        <table className="excel-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Tanggal</th>
              <th style={{ width: '120px' }}>No. Bukti / Voucher</th>
              <th>Keterangan / Uraian Transaksi</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Debit (IDR)</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Kredit (IDR)</th>
              <th style={{ width: '150px', textAlign: 'right' }}>Saldo Berjalan (IDR)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td>{r.date}</td>
                <td style={{ fontFamily: 'Courier New, monospace', fontWeight: r.voucherNo === 'SALDO-AWAL' ? 'bold' : 'normal' }}>
                  {r.voucherNo}
                </td>
                <td style={{ fontWeight: r.voucherNo === 'SALDO-AWAL' ? '600' : 'normal' }}>
                  {r.description}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                  {r.debit > 0 ? formatNumber(r.debit) : '-'}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                  {r.credit > 0 ? formatNumber(r.credit) : '-'}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: 'bold', color: 'var(--color-navy-blue)' }}>
                  {formatNumber(r.balance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: 'var(--color-silver)', fontWeight: 'bold' }}>
              <td colSpan={3} style={{ textAlign: 'right', padding: '6px 10px' }}>
                TOTAL MUTASI & SALDO AKHIR:
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                {formatNumber(totalDebit)}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                {formatNumber(totalCredit)}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', color: '#00007c', fontSize: '12px' }}>
                {formatNumber(endingBalance)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
