import React, { useState } from 'react';
import { formatRupiah, formatNumber } from '../utils/accountingMath';
import { Scale, Printer, CheckCircle, AlertTriangle, Search } from 'lucide-react';

export default function NeracaSaldoView({
  trialBalanceData,
  onPrint
}) {
  const { rows, totalDebit, totalCredit, isBalanced, difference } = trialBalanceData;
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredRows = rows.filter(r => {
    const matchesCat = filterCategory === 'ALL' || r.account.category === filterCategory;
    const matchesSearch =
      r.account.code.toLowerCase().includes(search.toLowerCase()) ||
      r.account.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      {/* 1. Toolbar & Category Filter */}
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
          <span style={{ fontWeight: '600', fontSize: '11.5px' }}>Filter Kategori Akun:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '2px 6px' }}
          >
            <option value="ALL">Semua Kategori (1 s/d 9)</option>
            <option value="ASET">1 - Aset / Aktiva</option>
            <option value="KEWAJIBAN">2 - Kewajiban / Hutang</option>
            <option value="EKUITAS">3 - Ekuitas / Modal</option>
            <option value="PENDAPATAN">4 - Pendapatan</option>
            <option value="HPP">5 - HPP (Beban Pokok)</option>
            <option value="BEBAN">6 - Beban Operasional</option>
            <option value="PENDAPATAN_LAIN">8 - Pendapatan Lain-lain</option>
            <option value="BEBAN_LAIN">9 - Beban Lain-lain</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="search"
            placeholder="Cari kode / nama akun..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '200px', padding: '3px 6px' }}
          />
          <button onClick={onPrint}>
            <Printer size={12} />
            <span>Cetak Neraca Saldo</span>
          </button>
        </div>
      </div>

      {/* 2. Verification Balance Header Banner */}
      <div style={{
        backgroundColor: isBalanced ? '#f0fdf4' : '#fef2f2',
        border: `2px inset ${isBalanced ? '#166534' : '#991b1b'}`,
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={16} color={isBalanced ? '#166534' : '#991b1b'} />
          <span>
            <strong>NERACA SALDO (TRIAL BALANCE) PERIODE OKTOBER 2026</strong> - Standar Akuntansi Keuangan
          </span>
        </div>

        <div>
          {isBalanced ? (
            <span style={{ color: '#166534', fontWeight: 'bold' }}>
              ✓ KESEIMBANGAN: SEIMBANG (Total Debit = Total Kredit)
            </span>
          ) : (
            <span style={{ color: '#991b1b', fontWeight: 'bold' }}>
              ⚠ TERJADI SELISIH: Rp {difference.toLocaleString('id-ID')}
            </span>
          )}
        </div>
      </div>

      {/* 3. Trial Balance Table */}
      <div className="excel-table-container" style={{ flex: 1, minHeight: '300px' }}>
        <table className="excel-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Kode Akun</th>
              <th>Nama Akun Perkiraan</th>
              <th style={{ width: '110px' }}>Kategori</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Mutasi Debit (Rp)</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Mutasi Kredit (Rp)</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Saldo Akhir Debit (Rp)</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Saldo Akhir Kredit (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => {
              const acc = r.account;
              return (
                <tr key={acc.code}>
                  <td style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold', color: 'var(--color-navy-blue)' }}>
                    {acc.code}
                  </td>
                  <td>{acc.name}</td>
                  <td>
                    <span className="badge badge-review" style={{ fontSize: '9.5px' }}>
                      {acc.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                    {r.mutDebit > 0 ? formatNumber(r.mutDebit) : '-'}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                    {r.mutCredit > 0 ? formatNumber(r.mutCredit) : '-'}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: r.finalDebit > 0 ? '600' : 'normal' }}>
                    {r.finalDebit > 0 ? formatNumber(r.finalDebit) : '-'}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: r.finalCredit > 0 ? '600' : 'normal' }}>
                    {r.finalCredit > 0 ? formatNumber(r.finalCredit) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: 'var(--color-silver)', fontWeight: 'bold' }}>
              <td colSpan={5} style={{ textAlign: 'right', padding: '6px 10px' }}>
                TOTAL KESELURUHAN NERACA SALDO:
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontSize: '12px', color: 'var(--color-navy-blue)' }}>
                {formatNumber(totalDebit)}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontSize: '12px', color: 'var(--color-navy-blue)' }}>
                {formatNumber(totalCredit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
