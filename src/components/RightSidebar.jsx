import React, { useState } from 'react';
import { Printer, Scale, FileText, CheckCircle2, AlertTriangle, Lock, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../utils/accountingMath';

export default function RightSidebar({
  paperSettings,
  setPaperSettings,
  onPrintPreview,
  balanceSheetData,
  onLockSystem,
  mobileOpen = false,
  onCloseMobile
}) {
  const [scratchpad, setScratchpad] = useState(() => {
    return localStorage.getItem('erp_scratchpad') || 'Catatan Auditor:\n- Periksa bukti potong PPh 23\n- Rekonsiliasi Bank Mandiri akhir bulan\n- Siapkan invoice kargo kontainer';
  });

  const handleScratchpadChange = (e) => {
    setScratchpad(e.target.value);
    localStorage.setItem('erp_scratchpad', e.target.value);
  };

  const handleQuickPaperSize = (size) => {
    const updated = { ...paperSettings, paperSize: size };
    setPaperSettings(updated);
    localStorage.setItem('erp_paper_settings', JSON.stringify(updated));
  };

  const handleQuickOrientation = (orientation) => {
    const updated = { ...paperSettings, orientation };
    setPaperSettings(updated);
    localStorage.setItem('erp_paper_settings', JSON.stringify(updated));
  };

  return (
    <aside
      className={`win-sidebar-right ${mobileOpen ? 'mobile-open' : ''}`}
      style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: 'var(--color-silver)',
        borderLeft: '2px solid var(--color-platinum)',
        boxShadow: 'inset 1px 0 0 var(--color-gray)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        padding: '6px',
        gap: '6px',
        userSelect: 'none'
      }}
    >
      {/* 1. Header Inspector */}
      <div style={{
        backgroundColor: 'var(--color-navy-blue)',
        color: '#ffffff',
        padding: '3px 6px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>🛠️ Panel Inspeksi & Alat</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <button
            onClick={onLockSystem}
            title="Kunci Akses Sistem ERP"
            style={{ padding: '1px 5px', fontSize: '9.5px', display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            <Lock size={10} />
            <span>Lock</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="win-ctrl-btn mobile-only-btn"
              title="Tutup Panel"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Quick Balance & Audit Card */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--color-navy-blue)',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Scale size={13} />
          <span>INSPEKSI NERACA (AUDIT)</span>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px inset #000',
          padding: '6px',
          fontSize: '11px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555' }}>Total Aktiva:</span>
            <span style={{ fontWeight: '600' }}>{formatRupiah(balanceSheetData?.totalAssets || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555' }}>Total Pasiva:</span>
            <span style={{ fontWeight: '600' }}>{formatRupiah(balanceSheetData?.totalLiabilitiesAndEquity || 0)}</span>
          </div>
          <div style={{
            borderTop: '1px solid #d4d0c8',
            paddingTop: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '10.5px'
          }}>
            <span>Status:</span>
            {balanceSheetData?.isBalanced ? (
              <span style={{ color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={12} /> SEIMBANG (0.00)
              </span>
            ) : (
              <span style={{ color: '#991b1b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <AlertTriangle size={12} /> SELISIH Rp {balanceSheetData?.difference?.toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Quick Paper Settings Switcher */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--color-navy-blue)',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Printer size={13} />
          <span>PRESET KERTAS CETAK</span>
        </div>

        <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
          <button
            onClick={() => handleQuickPaperSize('A4')}
            className={paperSettings.paperSize === 'A4' ? 'active' : ''}
            style={{ flex: 1, fontSize: '10px' }}
          >
            A4
          </button>
          <button
            onClick={() => handleQuickPaperSize('Letter')}
            className={paperSettings.paperSize === 'Letter' ? 'active' : ''}
            style={{ flex: 1, fontSize: '10px' }}
          >
            Letter
          </button>
          <button
            onClick={() => handleQuickPaperSize('Roll80')}
            className={paperSettings.paperSize === 'Roll80' ? 'active' : ''}
            style={{ flex: 1.2, fontSize: '10px' }}
            title="Kertas Kasir Continuous 80mm"
          >
            Kasir 80mm
          </button>
        </div>

        <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
          <button
            onClick={() => handleQuickOrientation('portrait')}
            className={paperSettings.orientation === 'portrait' ? 'active' : ''}
            style={{ flex: 1, fontSize: '10px' }}
          >
            Portrait
          </button>
          <button
            onClick={() => handleQuickOrientation('landscape')}
            className={paperSettings.orientation === 'landscape' ? 'active' : ''}
            style={{ flex: 1, fontSize: '10px' }}
          >
            Landscape
          </button>
        </div>

        <button
          onClick={onPrintPreview}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '4px 8px' }}
        >
          <Printer size={12} />
          <span>Preview & Cetak Dokumen</span>
        </button>
      </div>

      {/* 4. Accountant Scratchpad (Coretan Akuntan) */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '160px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--color-navy-blue)',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <FileText size={12} />
          <span>CORETAN AKUNTAN (AUTO-SAVE)</span>
        </div>
        <textarea
          value={scratchpad}
          onChange={handleScratchpadChange}
          placeholder="Tulis catatan harian, memo audit, atau rekonsiliasi kas di sini..."
          style={{
            flex: 1,
            width: '100%',
            resize: 'none',
            fontSize: '11px',
            fontFamily: 'Courier New, monospace',
            lineHeight: 1.3
          }}
        />
      </div>

      {/* 5. Session Security Status */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px inset #808080',
        padding: '4px 6px',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#555'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={12} color="#166534" />
          <span>Sesi: Terotentikasi</span>
        </span>
        <button
          onClick={onLockSystem}
          style={{ fontSize: '9px', padding: '1px 5px' }}
        >
          Kunci
        </button>
      </div>
    </aside>
  );
}
