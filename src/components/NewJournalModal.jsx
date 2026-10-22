import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatRupiah, formatNumber } from '../utils/accountingMath';

export default function NewJournalModal({
  isOpen,
  onClose,
  accounts,
  onSave
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const autoVoucher = `JV-2610-${Math.floor(100 + Math.random() * 900)}`;

  const [date, setDate] = useState(todayStr);
  const [voucherNo, setVoucherNo] = useState(autoVoucher);
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState([
    { accountCode: accounts[0]?.code || '', debit: '', credit: '', memo: '' },
    { accountCode: accounts[1]?.code || '', debit: '', credit: '', memo: '' }
  ]);

  const handleLineChange = (index, field, value) => {
    const updated = [...lines];
    updated[index][field] = value;

    // Mutually exclusive: if typing in debit, clear credit and vice versa
    if (field === 'debit' && value !== '') {
      updated[index]['credit'] = '';
    } else if (field === 'credit' && value !== '') {
      updated[index]['debit'] = '';
    }

    setLines(updated);
  };

  const handleAddLine = () => {
    setLines([...lines, { accountCode: accounts[0]?.code || '', debit: '', credit: '', memo: '' }]);
  };

  const handleRemoveLine = (index) => {
    if (lines.length <= 2) {
      alert('Entri jurnal double-entry minimal memerlukan 2 baris (Debit & Kredit)!');
      return;
    }
    setLines(lines.filter((_, i) => i !== index));
  };

  // Calculations
  const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = totalDebit > 0 && totalCredit > 0 && difference === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Harap isi keterangan transaksi jurnal!');
      return;
    }
    if (!isBalanced) {
      alert(`Transaksi belum seimbang! Selisih: ${formatRupiah(difference)}. Debit harus sama dengan Kredit.`);
      return;
    }

    const newTx = {
      id: 'tx-' + Date.now(),
      voucherNo,
      date,
      description,
      reference,
      lines: lines.map(l => ({
        accountCode: l.accountCode,
        debit: parseFloat(l.debit) || 0,
        credit: parseFloat(l.credit) || 0,
        memo: l.memo
      }))
    };

    onSave(newTx);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ width: '740px' }}>
        {/* Title Bar */}
        <div className="modal-header">
          <div className="modal-title">
            <span>📑 Entri Transaksi Jurnal Umum Baru (Double-Entry)</span>
          </div>
          <button className="win-ctrl-btn" onClick={onClose}>✕</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            {/* Header Form Grid */}
            <fieldset className="win-fieldset">
              <legend>Informasi Dokumen Transaksi</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '6px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Tanggal Transaksi:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>No. Voucher / Bukti:</label>
                  <input
                    type="text"
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    style={{ width: '100%', fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>No. Referensi / Invoice:</label>
                  <input
                    type="text"
                    placeholder="Contoh: INV-2026-099"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Keterangan Transaksi:</label>
                <input
                  type="text"
                  placeholder="Keterangan lengkap transaksi jurnal pembukuan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
            </fieldset>

            {/* Lines Items Table */}
            <fieldset className="win-fieldset">
              <legend>Rincian Akun & Nominal (Debit / Kredit)</legend>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-silver)', fontSize: '11px' }}>
                    <th style={{ textAlign: 'left', padding: '4px', border: '1px solid #808080' }}>Akun Perkiraan (COA)</th>
                    <th style={{ textAlign: 'left', padding: '4px', border: '1px solid #808080' }}>Memo Baris</th>
                    <th style={{ width: '130px', textAlign: 'right', padding: '4px', border: '1px solid #808080' }}>Debit (Rp)</th>
                    <th style={{ width: '130px', textAlign: 'right', padding: '4px', border: '1px solid #808080' }}>Kredit (Rp)</th>
                    <th style={{ width: '35px', textAlign: 'center', padding: '4px', border: '1px solid #808080' }}>#</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '2px' }}>
                        <select
                          value={line.accountCode}
                          onChange={(e) => handleLineChange(idx, 'accountCode', e.target.value)}
                          style={{ width: '100%', padding: '3px' }}
                        >
                          {accounts.map(acc => (
                            <option key={acc.code} value={acc.code}>
                              {acc.code} - {acc.name} ({acc.category})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '2px' }}>
                        <input
                          type="text"
                          placeholder="Catatan..."
                          value={line.memo}
                          onChange={(e) => handleLineChange(idx, 'memo', e.target.value)}
                          style={{ width: '100%', padding: '3px' }}
                        />
                      </td>
                      <td style={{ padding: '2px' }}>
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          value={line.debit}
                          onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                          style={{ width: '100%', textAlign: 'right', padding: '3px', fontFamily: 'Courier New, monospace' }}
                        />
                      </td>
                      <td style={{ padding: '2px' }}>
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          value={line.credit}
                          onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                          style={{ width: '100%', textAlign: 'right', padding: '3px', fontFamily: 'Courier New, monospace' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center', padding: '2px' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          style={{ padding: '2px 5px', fontSize: '10px', color: '#b00' }}
                          title="Hapus baris"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={handleAddLine}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                + Tambah Baris Akun
              </button>
            </fieldset>

            {/* Balancing Verification Summary Box */}
            <div style={{
              backgroundColor: isBalanced ? '#f0fdf4' : '#fef2f2',
              border: `2px inset ${isBalanced ? '#166534' : '#991b1b'}`,
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px'
            }}>
              <div>
                <span>Total Debit: </span>
                <strong style={{ fontFamily: 'Courier New, monospace', color: '#000' }}>{formatRupiah(totalDebit)}</strong>
                <span style={{ margin: '0 8px' }}>|</span>
                <span>Total Kredit: </span>
                <strong style={{ fontFamily: 'Courier New, monospace', color: '#000' }}>{formatRupiah(totalCredit)}</strong>
              </div>

              <div>
                {isBalanced ? (
                  <span style={{ color: '#166534', fontWeight: 'bold' }}>
                    ✓ SEIMBANG (0.00)
                  </span>
                ) : (
                  <span style={{ color: '#991b1b', fontWeight: 'bold' }}>
                    ⚠ SELISIH: {formatRupiah(difference)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} style={{ padding: '4px 14px' }}>
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!isBalanced || !description.trim()}
              style={{ padding: '4px 18px', fontWeight: 'bold' }}
            >
              Simpan Jurnal Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
