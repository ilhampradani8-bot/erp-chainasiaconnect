import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Printer,
  Save,
  FolderOpen,
  RefreshCw,
  LayoutDashboard,
  Scale,
  TrendingUp,
  Landmark,
  Settings,
  Sliders,
  HelpCircle,
  PlusCircle,
  Database,
  Calculator as CalcIcon
} from 'lucide-react';

export default function MenuBar95({
  activeView,
  setActiveView,
  onOpenNewJournalModal,
  onPrint,
  onExportJson,
  onImportJson,
  onResetData,
  onToggleCalculator,
  onRefresh
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
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'var(--color-silver)',
              border: '2px solid',
              borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
              boxShadow: '2px 2px 0px #000',
              minWidth: '220px',
              padding: '2px',
              zIndex: 100
            }}>
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
              <div onClick={() => handleAction(onResetData)} style={{ ...menuItemStyle, color: '#990000' }}>
                <span>Reset Database ke Default SAK...</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Transaksi */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => handleMenuClick('transaksi')}
            style={{
              padding: '2px 8px',
              border: openMenu === 'transaksi' ? '1px solid var(--color-black)' : '1px solid transparent',
              background: openMenu === 'transaksi' ? '#e0e0e0' : 'transparent',
              boxShadow: 'none'
            }}
          >
            <u>T</u>ransaksi
          </button>
          {openMenu === 'transaksi' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'var(--color-silver)',
              border: '2px solid',
              borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
              boxShadow: '2px 2px 0px #000',
              minWidth: '220px',
              padding: '2px',
              zIndex: 100
            }}>
              <div onClick={() => handleAction(() => setActiveView('jurnal'))} style={menuItemStyle}>
                <span>Jurnal Umum (General Journal)</span>
              </div>
              <div onClick={() => handleAction(() => setActiveView('bukubesar'))} style={menuItemStyle}>
                <span>Buku Besar (General Ledger)</span>
              </div>
              <div style={menuDividerStyle}></div>
              <div onClick={() => handleAction(onOpenNewJournalModal)} style={menuItemStyle}>
                <span>+ Entri Jurnal Transaksi Baru</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Laporan */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => handleMenuClick('laporan')}
            style={{
              padding: '2px 8px',
              border: openMenu === 'laporan' ? '1px solid var(--color-black)' : '1px solid transparent',
              background: openMenu === 'laporan' ? '#e0e0e0' : 'transparent',
              boxShadow: 'none'
            }}
          >
            <u>L</u>aporan
          </button>
          {openMenu === 'laporan' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'var(--color-silver)',
              border: '2px solid',
              borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
              boxShadow: '2px 2px 0px #000',
              minWidth: '240px',
              padding: '2px',
              zIndex: 100
            }}>
              <div onClick={() => handleAction(() => setActiveView('dashboard'))} style={menuItemStyle}>
                <span>Dashboard Grafik Finansial</span>
              </div>
              <div onClick={() => handleAction(() => setActiveView('neracasaldo'))} style={menuItemStyle}>
                <span>Neraca Saldo (Trial Balance)</span>
              </div>
              <div onClick={() => handleAction(() => setActiveView('labarugi'))} style={menuItemStyle}>
                <span>Laporan Laba Rugi (P&L)</span>
              </div>
              <div onClick={() => handleAction(() => setActiveView('neraca'))} style={menuItemStyle}>
                <span>Neraca Keuangan (Balance Sheet)</span>
              </div>
              <div onClick={() => handleAction(() => setActiveView('bukubesar'))} style={menuItemStyle}>
                <span>Buku Besar Per Akun</span>
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
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'var(--color-silver)',
              border: '2px solid',
              borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
              boxShadow: '2px 2px 0px #000',
              minWidth: '240px',
              padding: '2px',
              zIndex: 100
            }}>
              <div onClick={() => handleAction(() => setActiveView('baganakun'))} style={menuItemStyle}>
                <span>Pengaturan Bagan Akun (COA)...</span>
              </div>
              <div onClick={() => handleAction(() => setActiveView('pengaturankertas'))} style={menuItemStyle}>
                <span>Pengaturan Kertas & Kop Surat...</span>
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
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'var(--color-silver)',
              border: '2px solid',
              borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
              boxShadow: '2px 2px 0px #000',
              minWidth: '260px',
              padding: '2px',
              zIndex: 100
            }}>
              <div onClick={() => handleAction(() => alert('ERP-CHAINASIACONNECT v2.4 (SAK ETAP Compliance)\nDesain Retro Windows 90s sesuai spesifikasi ui.md.\nDirancang khusus untuk pembukuan akuntansi, neraca saldo, laba rugi, buku besar, dan cetak faktur/laporan.'))} style={menuItemStyle}>
                <span>Tentang ERP-ChainAsiaConnect...</span>
              </div>
              <div onClick={() => handleAction(() => alert('Panduan Pintas:\n- Gunakan sidebar kiri untuk navigasi modul.\n- Gunakan kalkulator di sidebar kanan untuk hitungan cepat.\n- Pengaturan kertas mendukung A4, Letter, hingga Kertas Kasir Struk 80mm.'))} style={menuItemStyle}>
                <span>Petunjuk Operasional Akuntansi</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Toolbar with 90s Bevel Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 6px',
        backgroundColor: 'var(--color-silver)',
        borderBottom: '1px solid var(--color-platinum)',
        boxShadow: 'inset 0 1px 0 #fff, 0 1px 0 #808080',
        overflowX: 'auto'
      }}>
        <button onClick={onOpenNewJournalModal} className="btn-primary" title="Tambah Entri Jurnal Baru">
          <PlusCircle size={13} color="#00007c" />
          <span>Jurnal Baru</span>
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--color-gray)', margin: '0 2px' }} />

        <button onClick={() => setActiveView('dashboard')} className={activeView === 'dashboard' ? 'active' : ''}>
          <LayoutDashboard size={13} />
          <span>Dashboard</span>
        </button>

        <button onClick={() => setActiveView('jurnal')} className={activeView === 'jurnal' ? 'active' : ''}>
          <FileText size={13} />
          <span>Jurnal Umum</span>
        </button>

        <button onClick={() => setActiveView('bukubesar')} className={activeView === 'bukubesar' ? 'active' : ''}>
          <FolderOpen size={13} />
          <span>Buku Besar</span>
        </button>

        <button onClick={() => setActiveView('neracasaldo')} className={activeView === 'neracasaldo' ? 'active' : ''}>
          <Scale size={13} />
          <span>Neraca Saldo</span>
        </button>

        <button onClick={() => setActiveView('labarugi')} className={activeView === 'labarugi' ? 'active' : ''}>
          <TrendingUp size={13} />
          <span>Laba Rugi</span>
        </button>

        <button onClick={() => setActiveView('neraca')} className={activeView === 'neraca' ? 'active' : ''}>
          <Landmark size={13} />
          <span>Neraca (Balance)</span>
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--color-gray)', margin: '0 2px' }} />

        <button onClick={() => setActiveView('baganakun')} className={activeView === 'baganakun' ? 'active' : ''}>
          <Settings size={13} />
          <span>Bagan Akun (COA)</span>
        </button>

        <button onClick={() => setActiveView('pengaturankertas')} className={activeView === 'pengaturankertas' ? 'active' : ''}>
          <Sliders size={13} />
          <span>Kertas & Kop</span>
        </button>

        <button onClick={onPrint} title="Cetak Laporan / Faktur Sesuai Setting Kertas">
          <Printer size={13} />
          <span>Cetak</span>
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--color-gray)', margin: '0 2px' }} />

        <button onClick={onRefresh} title="Segarkan Data">
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>

        <button onClick={onToggleCalculator} title="Buka / Tutup Kalkulator">
          <CalcIcon size={13} />
          <span>Kalkulator</span>
        </button>
      </div>
    </div>
  );
}

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
