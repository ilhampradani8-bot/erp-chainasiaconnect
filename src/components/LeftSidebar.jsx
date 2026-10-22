import React from 'react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Scale,
  TrendingUp,
  Landmark,
  Settings,
  Sliders,
  Database,
  PlusCircle,
  Wallet,
  Building,
  CreditCard,
  KeyRound
} from 'lucide-react';
import { formatRupiah } from '../utils/accountingMath';

export default function LeftSidebar({
  activeView,
  setActiveView,
  accounts,
  transactions,
  onOpenNewJournalModal
}) {
  // Calculate quick balances for Cash and Bank
  const getAccountBalance = (code) => {
    const acc = accounts.find(a => a.code === code);
    if (!acc) return 0;
    let bal = acc.initialBalance || 0;
    transactions.forEach(tx => {
      tx.lines.forEach(l => {
        if (l.accountCode === code) {
          if (acc.normalBalance === 'D') {
            bal += (Number(l.debit) || 0) - (Number(l.credit) || 0);
          } else {
            bal += (Number(l.credit) || 0) - (Number(l.debit) || 0);
          }
        }
      });
    });
    return bal;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard & Grafik', icon: LayoutDashboard },
    { id: 'jurnal', label: 'Jurnal Umum', icon: FileText },
    { id: 'bukubesar', label: 'Buku Besar Akun', icon: BookOpen },
    { id: 'neracasaldo', label: 'Neraca Saldo', icon: Scale },
    { id: 'labarugi', label: 'Laporan Laba Rugi', icon: TrendingUp },
    { id: 'neraca', label: 'Neraca (Sheet Balance)', icon: Landmark },
    { id: 'baganakun', label: 'Pengaturan Bagan Akun', icon: Settings },
    { id: 'pengaturankertas', label: 'Pengaturan Kertas & Kop', icon: Sliders },
    { id: 'pengaturankode', label: 'Pengaturan Kode Akses', icon: KeyRound },
    { id: 'cadangan', label: 'Database & Cadangan', icon: Database }
  ];

  return (
    <aside style={{
      width: '230px',
      minWidth: '230px',
      backgroundColor: 'var(--color-silver)',
      borderRight: '2px solid var(--color-black)',
      boxShadow: 'inset 1px 0 0 #fff',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      userSelect: 'none'
    }}>
      {/* Sidebar Header */}
      <div style={{
        backgroundColor: 'var(--color-navy-blue)',
        color: '#ffffff',
        padding: '4px 6px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>📁 Modul Akuntansi ERP</span>
        <span style={{ fontSize: '10px' }}>v2.4</span>
      </div>

      {/* Action Button: Quick Add Journal */}
      <div style={{ padding: '6px' }}>
        <button
          onClick={onOpenNewJournalModal}
          className="btn-primary"
          style={{ width: '100%', padding: '5px 8px', justifyContent: 'center' }}
        >
          <PlusCircle size={14} color="#00007c" />
          <span>+ Entri Jurnal Baru</span>
        </button>
      </div>

      {/* Main Module List (Windows Explorer Tree Style) */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px',
        margin: '0 6px 6px 6px',
        backgroundColor: '#ffffff',
        border: '2px inset #000'
      }}>
        <div style={{ fontSize: '10.5px', color: '#666', padding: '2px 4px', fontWeight: 'bold' }}>
          NAVIGASI UTAMA
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--color-navy-blue)' : 'transparent',
                  color: isActive ? '#ffffff' : '#000000',
                  fontSize: '11.5px',
                  border: isActive ? '1px dotted #ffffff' : '1px solid transparent'
                }}
              >
                <Icon size={13} color={isActive ? '#ffffff' : '#00007c'} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Panel: Live Cash & Bank Position */}
      <div style={{
        margin: '0 6px 6px 6px',
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px'
      }}>
        <div style={{
          fontSize: '10.5px',
          fontWeight: '600',
          color: 'var(--color-navy-blue)',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Wallet size={12} />
          <span>LIKUIDITAS KAS & BANK</span>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px inset #808080',
          padding: '4px',
          fontSize: '11px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555' }}>Kas Kecil:</span>
            <span style={{ fontWeight: '500' }}>{formatRupiah(getAccountBalance('1-1001'))}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555' }}>Bank Mandiri:</span>
            <span style={{ fontWeight: '500' }}>{formatRupiah(getAccountBalance('1-1002'))}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555' }}>Bank BCA:</span>
            <span style={{ fontWeight: '500' }}>{formatRupiah(getAccountBalance('1-1003'))}</span>
          </div>
          <div style={{ borderTop: '1px dashed #ccc', paddingTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#555' }}>Piutang Usaha:</span>
            <span style={{ fontWeight: '500', color: '#0369a1' }}>{formatRupiah(getAccountBalance('1-1004'))}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
