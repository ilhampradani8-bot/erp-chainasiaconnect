import React, { useState } from 'react';
import { KeyRound, Lock, ShieldAlert } from 'lucide-react';

export default function AccessCodeModal({
  isOpen,
  onAuthenticate,
  storedAccessCode
}) {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim() === storedAccessCode) {
      setErrorMsg('');
      setInputCode('');
      onAuthenticate();
    } else {
      setErrorMsg('Kode akses salah! Akses ke sistem akuntansi ditolak.');
      setAttempts(prev => prev + 1);
      setInputCode('');
    }
  };

  return (
    <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 128, 128, 0.85)', backdropFilter: 'blur(1px)' }}>
      <div className="modal-card" style={{ width: '420px', boxShadow: '4px 4px 0px #000' }}>
        {/* Title Bar Windows 95 */}
        <div className="modal-header">
          <div className="modal-title">
            <span>🔒 Otentikasi Akses Sistem ERP Akuntansi</span>
          </div>
          <span style={{ fontSize: '10px', color: '#ccc' }}>SAK ETAP</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              {/* Retro Computer / Key Icon */}
              <div style={{
                backgroundColor: 'var(--color-silver)',
                border: '2px solid',
                borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <KeyRound size={32} color="#00007c" />
              </div>

              {/* Input Area */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                  PT. CHAIN ASIA CONNECT
                </div>
                <div style={{ fontSize: '11px', color: '#333', marginBottom: '12px', lineHeight: 1.4 }}>
                  Sistem terkunci demi keamanan data pembukuan. Masukkan <strong>Kode Akses Otorisasi</strong> untuk membuka aplikasi:
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                    Kode Akses (PIN):
                  </label>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Masukkan kode akses..."
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    style={{
                      width: '100%',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '16px',
                      letterSpacing: '4px',
                      padding: '6px',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  />
                </div>

                {errorMsg ? (
                  <div style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #991b1b',
                    color: '#991b1b',
                    fontSize: '10.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldAlert size={14} />
                    <span>{errorMsg}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '6px', fontStyle: 'italic' }}>
                    *Kode akses bawaan default: <strong>123456</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="modal-footer" style={{ justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '5px 20px', fontWeight: 'bold' }}
            >
              Buka Sistem (OK)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
