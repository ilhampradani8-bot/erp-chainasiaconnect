import React, { useState, useEffect } from 'react';

export default function Taskbar95({
  activeView,
  setActiveView,
  isBalanced,
  difference,
  onOpenNewJournalModal
}) {
  const [time, setTime] = useState('');
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const viewTitles = {
    dashboard: '📊 Dashboard Finansial',
    jurnal: '📑 Jurnal Umum (General Journal)',
    bukubesar: '📖 Buku Besar (General Ledger)',
    neracasaldo: '⚖️ Neraca Saldo (Trial Balance)',
    labarugi: '📈 Laporan Laba Rugi',
    neraca: '🏛️ Neraca Keuangan (Balance Sheet)',
    baganakun: '🗂️ Pengaturan Bagan Akun (COA)',
    pengaturankertas: '🖨️ Pengaturan Kertas & Kop',
    pengaturankode: '🔐 Pengaturan Kode Akses',
    cadangan: '💾 Cadangan & Pemulihan Data'
  };

  return (
    <div style={{
      height: '30px',
      backgroundColor: 'var(--color-silver)',
      borderTop: '2px solid var(--color-platinum)',
      boxShadow: '0 -1px 0 var(--color-gray)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '2px 4px',
      position: 'relative',
      zIndex: 1000,
      userSelect: 'none'
    }}>
      {/* Left: Start Button & Active Task */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '100%' }}>
        {/* Windows 95 Start Button */}
        <button
          onClick={() => setStartOpen(!startOpen)}
          className={`os-btn ${startOpen ? 'active' : ''}`}
          style={{
            height: '24px',
            padding: '2px 8px',
            fontWeight: 'bold',
            fontSize: '11.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span style={{ fontSize: '13px' }}>⊞</span>
          <span>Start</span>
        </button>

        {/* Start Menu Popover */}
        {startOpen && (
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '2px',
            width: '240px',
            backgroundColor: 'var(--color-silver)',
            border: '2px solid',
            borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
            boxShadow: '2px 2px 0px #000',
            display: 'flex',
            zIndex: 2000
          }}>
            {/* Blue Banner Side */}
            <div style={{
              width: '28px',
              backgroundColor: 'var(--color-navy-blue)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '6px 2px',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontWeight: 'bold',
              letterSpacing: '2px',
              fontSize: '12px'
            }}>
              WINDOWS 95
            </div>

            {/* Menu Items */}
            <div style={{ flex: 1, padding: '4px 2px' }}>
              <div
                onClick={() => { setActiveView('dashboard'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>📊 Dashboard & Grafik</span>
              </div>
              <div
                onClick={() => { setActiveView('jurnal'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>📑 Jurnal Umum</span>
              </div>
              <div
                onClick={() => { setActiveView('bukubesar'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>📖 Buku Besar Per Akun</span>
              </div>
              <div
                onClick={() => { setActiveView('neracasaldo'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>⚖️ Neraca Saldo</span>
              </div>
              <div
                onClick={() => { setActiveView('labarugi'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>📈 Laporan Laba Rugi</span>
              </div>
              <div
                onClick={() => { setActiveView('neraca'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>🏛️ Neraca (Balance Sheet)</span>
              </div>
              <div style={{ height: '1px', backgroundColor: '#808080', borderBottom: '1px solid #fff', margin: '3px 0' }} />
              <div
                onClick={() => { setActiveView('baganakun'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>🗂️ Pengaturan Bagan Akun (COA)</span>
              </div>
              <div
                onClick={() => { setActiveView('pengaturankertas'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>🖨️ Pengaturan Kertas & Kop</span>
              </div>
              <div
                onClick={() => { setActiveView('pengaturankode'); setStartOpen(false); }}
                style={startItemStyle}
              >
                <span>🔐 Pengaturan Kode Akses</span>
              </div>
              <div
                onClick={() => { onOpenNewJournalModal(); setStartOpen(false); }}
                style={{ ...startItemStyle, fontWeight: 'bold' }}
              >
                <span>➕ Entri Transaksi Baru</span>
              </div>
            </div>
          </div>
        )}

        {/* Running Program Button (Sunken / Inset style) */}
        <div style={{
          backgroundColor: '#dfdfdf',
          border: '2px inset #000',
          borderRightColor: '#fff',
          borderBottomColor: '#fff',
          height: '24px',
          padding: '2px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: '500',
          color: '#000',
          minWidth: '220px'
        }}>
          <span>🗄️</span>
          <span>{viewTitles[activeView] || 'ERP-ChainAsia'}</span>
        </div>
      </div>

      {/* Center Status: Balance Indicator */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #808080',
        padding: '2px 10px',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>Status Neraca:</span>
        {isBalanced ? (
          <span style={{ color: '#166534', fontWeight: 'bold' }}>🟩 SEIMBANG (Debit = Kredit)</span>
        ) : (
          <span style={{ color: '#991b1b', fontWeight: 'bold' }}>🟥 SELISIH: Rp {difference.toLocaleString('id-ID')}</span>
        )}
      </div>

      {/* Right: Tray (DB Status & Digital Clock) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'var(--color-silver)',
        border: '2px inset #808080',
        borderRightColor: '#ffffff',
        borderBottomColor: '#ffffff',
        padding: '2px 8px',
        height: '24px'
      }}>
        <span style={{ fontSize: '11px', color: '#006600', marginRight: '6px' }}>
          ● SAK ETAP
        </span>
        <span style={{ fontSize: '12px' }}>🕒</span>
        <span style={{ fontFamily: 'Courier New, monospace', fontSize: '12px', fontWeight: 'bold' }}>
          {time}
        </span>
      </div>
    </div>
  );
}

const startItemStyle = {
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: '11.5px',
  color: '#000000',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};
