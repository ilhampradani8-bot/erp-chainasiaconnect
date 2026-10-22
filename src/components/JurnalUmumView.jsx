import React, { useState } from 'react';
import { PlusCircle, Search, Trash2, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatRupiah, formatNumber } from '../utils/accountingMath';

export default function JurnalUmumView({
  transactions,
  setTransactions,
  accounts,
  onOpenNewModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.reference && tx.reference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStart = !startDate || tx.date >= startDate;
    const matchesEnd = !endDate || tx.date <= endDate;

    return matchesSearch && matchesStart && matchesEnd;
  });

  const handleDeleteTransaction = (id, voucherNo) => {
    if (confirm(`Yakin ingin membatalkan dan menghapus jurnal bukti "${voucherNo}"?`)) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('erp_transactions', JSON.stringify(updated));
    }
  };

  const getAccountName = (code) => {
    const acc = accounts.find(a => a.code === code);
    return acc ? `${acc.code} - ${acc.name}` : code;
  };

  // Grand totals of filtered transactions
  let totalDebitFiltered = 0;
  let totalCreditFiltered = 0;
  filtered.forEach(tx => {
    tx.lines.forEach(l => {
      totalDebitFiltered += Number(l.debit) || 0;
      totalCreditFiltered += Number(l.credit) || 0;
    });
  });

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      {/* 1. Header Toolbar & Filters */}
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
          <button onClick={onOpenNewModal} className="btn-primary" style={{ padding: '4px 12px' }}>
            <PlusCircle size={13} color="#00007c" />
            <span>+ Entri Jurnal Baru</span>
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-gray)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
            <span>Periode:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '125px', padding: '2px 4px' }}
            />
            <span>s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '125px', padding: '2px 4px' }}
            />
            {(startDate || endDate) && (
              <button onClick={() => { setStartDate(''); setEndDate(''); }} style={{ fontSize: '10px' }}>
                Reset
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={13} color="#555" />
          <input
            type="search"
            placeholder="Cari voucher / keterangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '220px', padding: '3px 6px' }}
          />
        </div>
      </div>

      {/* 2. Spreadsheet Table of Journal Entries */}
      <div className="excel-table-container" style={{ flex: 1, minHeight: '300px' }}>
        <table className="excel-table">
          <thead>
            <tr>
              <th style={{ width: '85px' }}>Tanggal</th>
              <th style={{ width: '110px' }}>No. Voucher</th>
              <th>Keterangan / Akun Perkiraan (Indented)</th>
              <th style={{ width: '100px' }}>Ref / Bukti</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Debit (IDR)</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Kredit (IDR)</th>
              <th style={{ width: '60px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                  Tidak ada transaksi jurnal yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <React.Fragment key={tx.id}>
                  {/* Voucher Header Row */}
                  <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                    <td style={{ borderBottom: 'none' }}>{tx.date}</td>
                    <td style={{ fontFamily: 'Courier New, monospace', color: 'var(--color-navy-blue)', borderBottom: 'none' }}>
                      {tx.voucherNo}
                    </td>
                    <td style={{ borderBottom: 'none', color: '#000' }}>
                      <strong>{tx.description}</strong>
                    </td>
                    <td style={{ borderBottom: 'none', color: '#555' }}>
                      {tx.reference || '-'}
                    </td>
                    <td style={{ borderBottom: 'none' }}></td>
                    <td style={{ borderBottom: 'none' }}></td>
                    <td style={{ textAlign: 'center', borderBottom: 'none' }}>
                      <button
                        onClick={() => handleDeleteTransaction(tx.id, tx.voucherNo)}
                        title="Hapus Jurnal Ini"
                        style={{ padding: '1px 4px', fontSize: '10px', color: '#b00' }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>

                  {/* Line Items Rows */}
                  {tx.lines.map((line, lIdx) => {
                    const isCredit = Number(line.credit) > 0;
                    return (
                      <tr key={`${tx.id}-${lIdx}`} style={{ backgroundColor: '#ffffff' }}>
                        <td style={{ borderTop: 'none', color: 'transparent' }}>.</td>
                        <td style={{ borderTop: 'none', color: 'transparent' }}>.</td>
                        <td style={{ paddingLeft: isCredit ? '30px' : '10px' }}>
                          <span style={{ fontFamily: 'Courier New, monospace', marginRight: '6px', color: '#444' }}>
                            [{line.accountCode}]
                          </span>
                          <span>{getAccountName(line.accountCode).split(' - ')[1] || line.accountCode}</span>
                          {line.memo && (
                            <span style={{ fontSize: '10.5px', color: '#666', fontStyle: 'italic', marginLeft: '6px' }}>
                              - {line.memo}
                            </span>
                          )}
                        </td>
                        <td style={{ color: '#888', fontSize: '10.5px' }}>{tx.reference || ''}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                          {Number(line.debit) > 0 ? formatNumber(line.debit) : '-'}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                          {Number(line.credit) > 0 ? formatNumber(line.credit) : '-'}
                        </td>
                        <td></td>
                      </tr>
                    );
                  })}

                  {/* Small Separator Row */}
                  <tr style={{ height: '3px', backgroundColor: '#e5e5e5' }}>
                    <td colSpan={7} style={{ padding: 0, height: '3px', border: 'none' }}></td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: 'var(--color-silver)', fontWeight: 'bold' }}>
              <td colSpan={4} style={{ textAlign: 'right', padding: '6px 10px' }}>
                TOTAL MUTASI JURNAL:
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontSize: '12px' }}>
                {formatNumber(totalDebitFiltered)}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontSize: '12px' }}>
                {formatNumber(totalCreditFiltered)}
              </td>
              <td style={{ textAlign: 'center' }}>
                {totalDebitFiltered === totalCreditFiltered ? '✓ OK' : '⚠ SELISIH'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 3. Status Bar */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '1px inset #808080',
        padding: '3px 8px',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Total Voucher Ditampilkan: {filtered.length} Dokumen</span>
        <span>Keseimbangan Jurnal: {totalDebitFiltered === totalCreditFiltered ? 'SEIMBANG (Debit = Kredit)' : 'TIDAK SEIMBANG'}</span>
      </div>
    </div>
  );
}
