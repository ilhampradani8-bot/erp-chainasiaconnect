import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PengaturanKodeAksesView({
  storedAccessCode,
  setStoredAccessCode,
  onLockSystem
}) {
  const [currentCode, setCurrentCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [message, setMessage] = useState(null);

  const handleUpdateCode = (e) => {
    e.preventDefault();

    if (currentCode.trim() !== storedAccessCode) {
      setMessage({ type: 'error', text: 'Kode akses lama tidak sesuai!' });
      return;
    }

    if (!newCode.trim()) {
      setMessage({ type: 'error', text: 'Kode akses baru tidak boleh kosong!' });
      return;
    }

    if (newCode.trim() !== confirmCode.trim()) {
      setMessage({ type: 'error', text: 'Konfirmasi kode akses baru tidak cocok!' });
      return;
    }

    setStoredAccessCode(newCode.trim());
    localStorage.setItem('erp_access_code', newCode.trim());
    setMessage({ type: 'success', text: 'Kode akses otorisasi berhasil diperbarui!' });

    setCurrentCode('');
    setNewCode('');
    setConfirmCode('');

    setTimeout(() => setMessage(null), 4000);
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
          <KeyRound size={15} color="var(--color-navy-blue)" />
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
            PENGATURAN KODE AKSES OTORISASI & KEAMANAN SISTEM
          </span>
        </div>

        <button onClick={onLockSystem} className="btn-primary" style={{ padding: '3px 12px' }}>
          <Lock size={12} />
          <span>Kunci Layar Sekarang (Lock)</span>
        </button>
      </div>

      {/* 2. Form Box */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
        <form onSubmit={handleUpdateCode}>
          <fieldset className="win-fieldset" style={{ backgroundColor: '#ffffff', padding: '16px' }}>
            <legend>Ubah Kode Akses (PIN Otorisasi)</legend>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '3px' }}>
                Kode Akses Lama (Saat Ini):
              </label>
              <input
                type="password"
                placeholder="Masukkan kode akses saat ini..."
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                style={{ width: '100%', fontFamily: 'Courier New, monospace', fontSize: '14px', letterSpacing: '2px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '3px' }}>
                Kode Akses Baru:
              </label>
              <input
                type="password"
                placeholder="Ketik kode akses baru..."
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                style={{ width: '100%', fontFamily: 'Courier New, monospace', fontSize: '14px', letterSpacing: '2px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '3px' }}>
                Konfirmasi Kode Akses Baru:
              </label>
              <input
                type="password"
                placeholder="Ulangi kode akses baru..."
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                style={{ width: '100%', fontFamily: 'Courier New, monospace', fontSize: '14px', letterSpacing: '2px' }}
                required
              />
            </div>

            {message && (
              <div style={{
                padding: '6px 10px',
                marginBottom: '14px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                border: `1px solid ${message.type === 'success' ? '#166534' : '#991b1b'}`,
                color: message.type === 'success' ? '#166534' : '#991b1b',
                fontWeight: 'bold'
              }}>
                {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{message.text}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '6px 20px', fontWeight: 'bold' }}
              >
                Simpan Kode Akses Baru
              </button>
            </div>
          </fieldset>
        </form>

        {/* Security Info Card */}
        <div style={{
          backgroundColor: 'var(--color-silver)',
          border: '2px solid',
          borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
          padding: '12px'
        }}>
          <div style={{
            fontSize: '11.5px',
            fontWeight: 'bold',
            color: 'var(--color-navy-blue)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={16} />
            <span>PANDUAN KEAMANAN ERP</span>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '2px inset #000',
            padding: '10px',
            fontSize: '11px',
            lineHeight: 1.5,
            color: '#333'
          }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Fungsi Kode Akses:</strong>
              <br />
              Mencegah pihak yang tidak berkepentingan mengubah jurnal, melihat laporan laba rugi, atau memodifikasi bagan akun (COA).
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Sesi Keamanan:</strong>
              <br />
              Setelah Anda memasukkan kode akses, sistem akan tetap terbuka selama sesi browser berjalan. Anda dapat mengunci layar kapan saja dengan tombol <strong>Kunci Layar (Lock)</strong>.
            </p>
            <div style={{
              marginTop: '12px',
              padding: '6px',
              backgroundColor: '#fef08a',
              border: '1px solid #ca8a04',
              color: '#854d0e',
              fontSize: '10.5px'
            }}>
              💡 <em>Catatan:</em> Kode akses awal bawaan sistem adalah <strong>123456</strong>. Segera ganti dengan kode rahasia bagian akuntansi Anda.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
