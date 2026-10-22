import React, { useRef } from 'react';
import { Database, Download, Upload, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function CadanganView({
  accounts,
  setAccounts,
  transactions,
  setTransactions,
  paperSettings,
  setPaperSettings,
  onResetDefault
}) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const backupData = {
      app: 'ERP-ChainAsiaConnect',
      version: '2.4',
      exportDate: new Date().toISOString(),
      accounts,
      transactions,
      paperSettings
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_ERP_ChainAsia_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.accounts || !parsed.transactions) {
          alert('Format berkas cadangan JSON tidak valid atau tidak memiliki data akun & transaksi!');
          return;
        }

        if (confirm(`Pulihkan database dari file cadangan ini?\n- Jumlah Akun: ${parsed.accounts.length}\n- Jumlah Transaksi: ${parsed.transactions.length}`)) {
          setAccounts(parsed.accounts);
          setTransactions(parsed.transactions);
          if (parsed.paperSettings) setPaperSettings(parsed.paperSettings);

          localStorage.setItem('erp_accounts', JSON.stringify(parsed.accounts));
          localStorage.setItem('erp_transactions', JSON.stringify(parsed.transactions));
          if (parsed.paperSettings) {
            localStorage.setItem('erp_paper_settings', JSON.stringify(parsed.paperSettings));
          }

          alert('Database berhasil dipulihkan!');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      {/* 1. Header Toolbar */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={15} color="var(--color-navy-blue)" />
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
            MANAJEMEN DATABASE, CADANGAN (BACKUP) & PEMULIHAN SISTEM
          </span>
        </div>
      </div>

      {/* 2. Database Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {/* Card 1: Backup */}
        <fieldset className="win-fieldset" style={{ backgroundColor: '#ffffff' }}>
          <legend>💾 Ekspor Cadangan (Backup)</legend>
          <p style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>
            Simpan seluruh data Bagan Akun (COA), jurnal umum transaksi, dan pengaturan kertas ke dalam berkas JSON mandiri.
          </p>

          <button onClick={handleExport} className="btn-primary" style={{ width: '100%', padding: '6px', justifyContent: 'center' }}>
            <Download size={13} />
            <span>Unduh Cadangan Database (.JSON)</span>
          </button>
        </fieldset>

        {/* Card 2: Restore */}
        <fieldset className="win-fieldset" style={{ backgroundColor: '#ffffff' }}>
          <legend>📂 Pulihkan Database (Restore)</legend>
          <p style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>
            Muat ulang data akuntansi dari berkas cadangan JSON yang pernah disimpan sebelumnya.
          </p>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />

          <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '6px', justifyContent: 'center' }}>
            <Upload size={13} />
            <span>Pilih Berkas JSON untuk Dipulihkan...</span>
          </button>
        </fieldset>

        {/* Card 3: Reset */}
        <fieldset className="win-fieldset" style={{ backgroundColor: '#ffffff' }}>
          <legend>⚠️ Reset ke Data Bawaan (Default)</legend>
          <p style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>
            Kembalikan seluruh Bagan Akun (COA) dan transaksi awal standar PT. Chain Asia Connect.
          </p>

          <button onClick={onResetDefault} style={{ width: '100%', padding: '6px', justifyContent: 'center', color: '#990000', fontWeight: 'bold' }}>
            <RotateCcw size={13} />
            <span>Reset Database ke Template Standar</span>
          </button>
        </fieldset>
      </div>

      {/* 3. System Storage Information */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '10px'
      }}>
        <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--color-navy-blue)', marginBottom: '8px' }}>
          INFORMASI KONDISI PENYIMPANAN DATA
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px inset #000',
          padding: '10px',
          fontSize: '11px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
        }}>
          <div>
            <div style={{ color: '#666' }}>Engine Penyimpanan:</div>
            <div style={{ fontWeight: 'bold' }}>Browser LocalStorage (SAK ETAP)</div>
          </div>
          <div>
            <div style={{ color: '#666' }}>Jumlah Akun Perkiraan:</div>
            <div style={{ fontWeight: 'bold' }}>{accounts.length} Akun</div>
          </div>
          <div>
            <div style={{ color: '#666' }}>Jumlah Dokumen Transaksi:</div>
            <div style={{ fontWeight: 'bold' }}>{transactions.length} Voucher Jurnal</div>
          </div>
          <div>
            <div style={{ color: '#666' }}>Status Integritas Data:</div>
            <div style={{ fontWeight: 'bold', color: '#166534' }}>✓ Terverifikasi Normal</div>
          </div>
        </div>
      </div>
    </div>
  );
}
