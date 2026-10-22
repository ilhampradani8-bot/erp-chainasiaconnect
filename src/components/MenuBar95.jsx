import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Printer,
  RefreshCw,
  PlusCircle,
  Lock,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';

export default function MenuBar95({
  activeView,
  setActiveView,
  onOpenNewJournalModal,
  onPrint,
  onExportJson,
  onImportJson,
  onResetData,
  onLockSystem,
  onRefresh,
  onToggleMobileLeft,
  onToggleMobileRight
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleAction = (cb) => {
    setOpenMenu(null);
    if (cb) cb();
  };

  return (
    <div style={{ backgroundColor: 'var(--color-silver)', borderBottom: '2px solid var(--color-gray)' }} ref={menuRef}>
      {/* 1. Software Main Title Bar (Windows 95/98 Blue Bar) */}
      <div style={{
        backgroundColor: 'var(--color-navy-blue)',
        color: '#ffffff',
        height: '24px',
        padding: '0 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '11.5px' }}>
          <img src="/logo.png" alt="CAC" style={{ height: '16px', width: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />
          <span>ERP-CHAINASIACONNECT v2.4 (Enterprise Accounting Edition) - [PT. CHAIN ASIA CONNECT]</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button className="win-ctrl-btn" title="Kunci Sistem" onClick={onLockSystem} style={{ color: '#000' }}>🔒</button>
          <button className="win-ctrl-btn" title="Minimize" onClick={() => alert('Jendela diminimalkan ke Taskbar')}>_</button>
          <button className="win-ctrl-btn" title="Maximize" onClick={() => alert('Mode Layar Penuh Maksimal Aktif')}>□</button>
          <button className="win-ctrl-btn" title="Tutup / Refresh" onClick={onRefresh} style={{ fontWeight: 'bold', color: '#800000' }}>✕</button>
        </div>
      </div>

      {/* 2. Classic Dropdown Menus */}
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--color-silver)',
        borderBottom: '1px solid var(--color-gray)',
        padding: '1px 4px',
        fontSize: '11px',
        position: 'relative',
        zIndex: 50
      }}>
        {/* Menu File */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => handleMenuClick('file')}
            style={{
              padding: '2px 8px',
              border: openMenu === 'file' ? '1px solid var(--color-black)' : '1px solid transparent',
              background: openMenu === 'file' ? '#e0e0e0' : 'transparent',
              boxShadow: 'none'
            }}
          >
            <u>F</u>ile
          </button>
          {openMenu === 'file' && (
            <div style={dropdownCardStyle}>
              <div onClick={() => handleAction(onOpenNewJournalModal)} style={menuItemStyle}>
                <span>Entri Transaksi Baru...</span> <span style={shortcutStyle}>Ctrl+N</span>
              </div>
              <div onClick={() => handleAction(onPrint)} style={menuItemStyle}>
                <span>Cetak Dokumen / Laporan...</span> <span style={shortcutStyle}>Ctrl+P</span>
              </div>
              <div style={menuDividerStyle}></div>
              <div onClick={() => handleAction(onExportJson)} style={menuItemStyle}>
                <span>Ekspor Cadangan Database JSON...</span>
              </div>
              <div onClick={() => handleAction(onImportJson)} style={menuItemStyle}>
                <span>Pulihkan Database dari JSON...</span>
              </div>
              <div style={menuDividerStyle}></div>
              <div onClick={() => handleAction(onLockSystem)} style={menuItemStyle}>
                <span>Kunci Layar (Lock Session)...</span>
              </div>
              <div onClick={() => handleAction(onResetData)} style={{ ...menuItemStyle, color: '#990000' }}>
                <span>Reset Database ke Default SAK...</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Pengaturan */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => handleMenuClick('pengaturan')}
            style={{
              padding: '2px 8px',
              border: openMenu === 'pengaturan' ? '1px solid var(--color-black)' : '1px solid transparent',
              background: openMenu === 'pengaturan' ? '#e0e0e0' : 'transparent',
              boxShadow: 'none'
            }}
          >
            <u>P</u>engaturan
          </button>
          {openMenu === 'pengaturan' && (
            <div style={dropdownCardStyle}>
              <div onClick={() => handleAction(() => setActiveView('baganakun'))} style={menuItemStyle}>
                <span>Pengaturan Bagan Akun (COA)...</span>
              </div>
              <div onClick={() => handleAction(() => setActiveView('pengaturankertas'))} style={menuItemStyle}>
                <span>Pengaturan Kertas & Kop Surat...</span>
              </div>
              <div onClick={() => handleAction(() => setActiveView('pengaturankode'))} style={menuItemStyle}>
                <span>Pengaturan Kode Akses (PIN)...</span>
              </div>
              <div style={menuDividerStyle}></div>
              <div onClick={() => handleAction(() => setActiveView('cadangan'))} style={menuItemStyle}>
                <span>Manajemen Database & Backup...</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Bantuan */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => handleMenuClick('bantuan')}
            style={{
              padding: '2px 8px',
              border: openMenu === 'bantuan' ? '1px solid var(--color-black)' : '1px solid transparent',
              background: openMenu === 'bantuan' ? '#e0e0e0' : 'transparent',
              boxShadow: 'none'
            }}
          >
            <u>B</u>antuan
          </button>
          {openMenu === 'bantuan' && (
            <div style={dropdownCardStyle}>
              <div onClick={() => handleAction(() => alert('ERP-CHAINASIACONNECT v2.4 (SAK ETAP Compliance)\nDesain Retro Windows 90s sesuai spesifikasi ui.md.\nDirancang khusus untuk pembukuan akuntansi, neraca saldo, laba rugi, dan cetak laporan.'))} style={menuItemStyle}>
                <span>Tentang ERP-ChainAsiaConnect...</span>
              </div>
              <div onClick={() => handleAction(() => alert('Navigasi modul akuntansi dipusatkan di Sidebar Kiri agar rapi dan mudah diakses.'))} style={menuItemStyle}>
                <span>Petunjuk Penggunaan Sistem</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Toolbar - Cleaned (No redundant navigation, centralized to sidebar) */}
      <div className="win-toolbar" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 8px',
        backgroundColor: 'var(--color-silver)',
        borderBottom: '1px solid var(--color-platinum)',
        boxShadow: 'inset 0 1px 0 #fff, 0 1px 0 #808080'
      }}>
        {/* Mobile Sidebar Toggle Button */}
        <button onClick={onToggleMobileLeft} className="mobile-only-btn" title="Buka Navigasi Modul (Mobile)">
          <span>☰ Menu</span>
        </button>

        <button onClick={onOpenNewJournalModal} className="btn-primary" title="Tambah Entri Jurnal Baru">
          <PlusCircle size={13} color="#00007c" />
          <span>+ Jurnal Baru</span>
        </button>

        <button onClick={onPrint} title="Cetak Dokumen Sesuai Format Kertas">
          <Printer size={13} />
          <span>Cetak</span>
        </button>

        <button onClick={onRefresh} title="Segarkan Data Halaman">
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>

        <div style={{ flex: 1 }}></div>

        {/* Mobile Right Tools Toggle Button */}
        <button onClick={onToggleMobileRight} className="mobile-only-btn" title="Buka Panel Inspeksi & Alat (Mobile)">
          <span>🛠️ Alat</span>
        </button>

        <button onClick={onLockSystem} title="Kunci Sesi Akses Sekarang" style={{ color: '#00007c' }}>
          <Lock size={12} />
          <span>Lock</span>
        </button>
      </div>
    </div>
  );
}

const dropdownCardStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  backgroundColor: 'var(--color-silver)',
  border: '2px solid',
  borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
  boxShadow: '2px 2px 0px #000',
  minWidth: '230px',
  padding: '2px',
  zIndex: 100
};

const menuItemStyle = {
  padding: '4px 10px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '11px',
  color: '#000000'
};

const shortcutStyle = {
  fontSize: '10px',
  color: '#666',
  marginLeft: '14px'
};

const menuDividerStyle = {
  height: '1px',
  backgroundColor: '#808080',
  borderBottom: '1px solid #ffffff',
  margin: '2px 1px'
};
