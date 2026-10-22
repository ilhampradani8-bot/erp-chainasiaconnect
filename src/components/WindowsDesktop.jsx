import React, { useState, useEffect, useRef } from 'react';
import MenuBar95 from './MenuBar95';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Taskbar95 from './Taskbar95';
import DashboardView from './DashboardView';
import JurnalUmumView from './JurnalUmumView';
import BukuBesarView from './BukuBesarView';
import NeracaSaldoView from './NeracaSaldoView';
import LabaRugiView from './LabaRugiView';
import NeracaView from './NeracaView';
import BaganAkunView from './BaganAkunView';
import PengaturanKertasView from './PengaturanKertasView';
import PengaturanKodeAksesView from './PengaturanKodeAksesView';
import CadanganView from './CadanganView';
import NewJournalModal from './NewJournalModal';
import PrintModal from './PrintModal';
import AccessCodeModal from './AccessCodeModal';

import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, DEFAULT_PAPER_SETTINGS } from '../data/accountingStore';
import {
  calculateTrialBalance,
  calculateIncomeStatement,
  calculateBalanceSheet
} from '../utils/accountingMath';
import {
  fetchAccountsFromDb,
  fetchTransactionsFromDb,
  fetchPaperSettingsFromDb,
  fetchAccessCodeFromDb,
  saveTransactionToDb,
  deleteTransactionFromDb,
  saveAccountToDb,
  deleteAccountFromDb,
  savePaperSettingsToDb,
  saveAccessCodeToDb
} from '../utils/supabaseClient';

export default function WindowsDesktop() {
  const [cloudStatus, setCloudStatus] = useState('Connecting...');
  // Access Code & Session Authentication state
  const [storedAccessCode, setStoredAccessCode] = useState(() => {
    try {
      return localStorage.getItem('erp_access_code') || '123456';
    } catch {
      return '123456';
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('erp_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Accounts state with LocalStorage persistence
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_accounts');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  // Transactions state with LocalStorage persistence
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Paper Settings state with LocalStorage persistence
  const [paperSettings, setPaperSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_paper_settings');
      return saved ? JSON.parse(saved) : DEFAULT_PAPER_SETTINGS;
    } catch {
      return DEFAULT_PAPER_SETTINGS;
    }
  });

  // Active view: 'dashboard' | 'jurnal' | 'bukubesar' | 'neracasaldo' | 'labarugi' | 'neraca' | 'baganakun' | 'pengaturankertas' | 'pengaturankode' | 'cadangan'
  const [activeView, setActiveView] = useState('dashboard');

  // Modals state
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Mobile drawer states
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);

  // CRUD Save Indicator Toast State
  const [saveToast, setSaveToast] = useState(null);
  const saveToastTimeoutRef = useRef(null);

  const triggerSaveIndicator = (msg = 'Perubahan data berhasil disimpan ke Cloud Database!') => {
    if (saveToastTimeoutRef.current) clearTimeout(saveToastTimeoutRef.current);
    setSaveToast(msg);
    saveToastTimeoutRef.current = setTimeout(() => {
      setSaveToast(null);
    }, 3200);
  };

  const handleOpenNewJournal = () => {
    setEditingTransaction(null);
    setIsNewJournalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsNewJournalOpen(true);
  };

  // Sync to localStorage and Supabase
  useEffect(() => {
    localStorage.setItem('erp_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('erp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('erp_paper_settings', JSON.stringify(paperSettings));
    savePaperSettingsToDb(paperSettings);
  }, [paperSettings]);

  // Load from Supabase Cloud Database on Mount
  useEffect(() => {
    async function loadCloudData() {
      try {
        const dbAccounts = await fetchAccountsFromDb();
        if (dbAccounts && dbAccounts.length > 0) {
          setAccounts(dbAccounts);
        }

        const dbTx = await fetchTransactionsFromDb();
        if (dbTx !== null) {
          setTransactions(dbTx);
        }

        const dbPaper = await fetchPaperSettingsFromDb();
        if (dbPaper) {
          setPaperSettings(dbPaper);
        }

        const dbCode = await fetchAccessCodeFromDb();
        if (dbCode) {
          setStoredAccessCode(dbCode);
        }

        setCloudStatus('Supabase Postgres (Connected)');
      } catch (err) {
        setCloudStatus('LocalStorage (Offline)');
      }
    }
    loadCloudData();
  }, []);

  // Authentication handlers
  const handleAuthenticateSuccess = () => {
    try {
      sessionStorage.setItem('erp_authenticated', 'true');
    } catch {}
    setIsAuthenticated(true);
  };

  const handleLockSystem = () => {
    try {
      sessionStorage.removeItem('erp_authenticated');
    } catch {}
    setIsAuthenticated(false);
  };

  // Update Access Code
  const handleUpdateAccessCode = (newCode) => {
    setStoredAccessCode(newCode);
    localStorage.setItem('erp_access_code', newCode);
    saveAccessCodeToDb(newCode);
    triggerSaveIndicator('Kode Akses Keamanan berhasil diperbarui!');
  };

  // Financial Calculations
  const trialBalanceData = calculateTrialBalance(accounts, transactions);
  const incomeData = calculateIncomeStatement(accounts, transactions);
  const balanceSheetData = calculateBalanceSheet(accounts, transactions);

  // Handle transaction saved (New or Edit)
  const handleSaveJournal = async (txPayload, isEdit = false) => {
    let updated;
    if (isEdit) {
      updated = transactions.map(t => (t.id === txPayload.id || t.voucherNo === txPayload.voucherNo) ? txPayload : t);
    } else {
      updated = [txPayload, ...transactions];
    }
    setTransactions(updated);
    await saveTransactionToDb(txPayload);
    triggerSaveIndicator(isEdit ? `Jurnal ${txPayload.voucherNo} berhasil diperbarui!` : `Jurnal baru ${txPayload.voucherNo} berhasil disimpan!`);
  };

  // Handle transaction deleted
  const handleDeleteJournal = async (id, voucherNo) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await deleteTransactionFromDb(voucherNo);
    triggerSaveIndicator(`Jurnal ${voucherNo || ''} berhasil dihapus!`);
  };

  // Handle account added or edited
  const handleSaveAccount = async (acc) => {
    await saveAccountToDb(acc);
    triggerSaveIndicator(`Akun ${acc.code} (${acc.name}) berhasil disimpan!`);
  };

  // Handle account deleted
  const handleDeleteAccount = async (code) => {
    await deleteAccountFromDb(code);
    triggerSaveIndicator(`Akun ${code} berhasil dihapus dari Bagan Akun!`);
  };

  // Handle Paper Settings Saved
  const handleSavePaperSettings = (newSettings) => {
    setPaperSettings(newSettings);
    triggerSaveIndicator('Pengaturan Kertas, Kop, Logo, TTD & Cap berhasil disimpan!');
  };

  // Reset Data to standard initial
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang semua data pembukuan ke default awal?')) {
      setAccounts(INITIAL_ACCOUNTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setPaperSettings(DEFAULT_PAPER_SETTINGS);
      localStorage.removeItem('erp_scratchpad');
      triggerSaveIndicator('Database berhasil diatur ulang ke kondisi awal!');
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const data = { accounts, transactions, paperSettings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ERP_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON trigger
  const handleImportJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.accounts && parsed.transactions) {
            setAccounts(parsed.accounts);
            setTransactions(parsed.transactions);
            if (parsed.paperSettings) setPaperSettings(parsed.paperSettings);
            alert('Database berhasil diimpor!');
          }
        } catch (err) {
          alert('Gagal membaca JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: 'var(--color-desktop-teal)'
    }}>
      {/* 1. Main Windows 90s Application Window Frame */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        margin: '2px 2px 0 2px',
        backgroundColor: 'var(--color-silver)',
        borderTop: '2px solid var(--color-platinum)',
        borderLeft: '2px solid var(--color-platinum)',
        borderRight: '2px solid var(--color-black)',
        borderBottom: '2px solid var(--color-black)',
        boxShadow: '1px 1px 0px #000, inset 1px 1px 0px #fff',
        overflow: 'hidden'
      }}>
        {/* Top Titlebar, Menus & Action Toolbar */}
        <MenuBar95
          activeView={activeView}
          setActiveView={(v) => {
            setActiveView(v);
            setMobileLeftOpen(false);
            setMobileRightOpen(false);
          }}
          onOpenNewJournalModal={handleOpenNewJournal}
          onPrint={() => setIsPrintModalOpen(true)}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onResetData={handleResetData}
          onLockSystem={handleLockSystem}
          onRefresh={() => window.location.reload()}
          onToggleMobileLeft={() => setMobileLeftOpen(prev => !prev)}
          onToggleMobileRight={() => setMobileRightOpen(prev => !prev)}
        />

        {/* Workspace Body: Left Sidebar + Center Content Page + Right Sidebar */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: '#c0c0c0',
          position: 'relative'
        }}>
          {/* Mobile Overlay Backdrop */}
          {(mobileLeftOpen || mobileRightOpen) && (
            <div
              className="mobile-drawer-backdrop"
              onClick={() => {
                setMobileLeftOpen(false);
                setMobileRightOpen(false);
              }}
            />
          )}

          {/* Left Sidebar: Accounting Module Tree & Live Liquidity (Central Navigation) */}
          <LeftSidebar
            activeView={activeView}
            setActiveView={(v) => {
              setActiveView(v);
              setMobileLeftOpen(false);
            }}
            accounts={accounts}
            transactions={transactions}
            onOpenNewJournalModal={handleOpenNewJournal}
            mobileOpen={mobileLeftOpen}
            onCloseMobile={() => setMobileLeftOpen(false)}
          />

          {/* Center Main Workspace */}
          <main style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#d4d0c8',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {activeView === 'dashboard' && (
              <DashboardView
                incomeData={incomeData}
                balanceSheetData={balanceSheetData}
                trialBalanceData={trialBalanceData}
                transactions={transactions}
                accounts={accounts}
                onNavigate={setActiveView}
                paperSettings={paperSettings}
              />
            )}

            {activeView === 'jurnal' && (
              <JurnalUmumView
                transactions={transactions}
                setTransactions={setTransactions}
                accounts={accounts}
                onOpenNewModal={handleOpenNewJournal}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteJournal}
              />
            )}

            {activeView === 'bukubesar' && (
              <BukuBesarView
                accounts={accounts}
                transactions={transactions}
                onPrint={() => setIsPrintModalOpen(true)}
              />
            )}

            {activeView === 'neracasaldo' && (
              <NeracaSaldoView
                trialBalanceData={trialBalanceData}
                onPrint={() => setIsPrintModalOpen(true)}
              />
            )}

            {activeView === 'labarugi' && (
              <LabaRugiView
                incomeData={incomeData}
                onPrint={() => setIsPrintModalOpen(true)}
                paperSettings={paperSettings}
              />
            )}

            {activeView === 'neraca' && (
              <NeracaView
                balanceSheetData={balanceSheetData}
                onPrint={() => setIsPrintModalOpen(true)}
                paperSettings={paperSettings}
              />
            )}

            {activeView === 'baganakun' && (
              <BaganAkunView
                accounts={accounts}
                setAccounts={setAccounts}
                transactions={transactions}
                onSaveAccount={handleSaveAccount}
                onDeleteAccount={handleDeleteAccount}
              />
            )}

            {activeView === 'pengaturankertas' && (
              <PengaturanKertasView
                paperSettings={paperSettings}
                setPaperSettings={handleSavePaperSettings}
                onPrintPreview={() => setIsPrintModalOpen(true)}
              />
            )}

            {activeView === 'pengaturankode' && (
              <PengaturanKodeAksesView
                storedAccessCode={storedAccessCode}
                setStoredAccessCode={handleUpdateAccessCode}
                onLockSystem={handleLockSystem}
              />
            )}

            {activeView === 'cadangan' && (
              <CadanganView
                accounts={accounts}
                setAccounts={setAccounts}
                transactions={transactions}
                setTransactions={setTransactions}
                paperSettings={paperSettings}
                setPaperSettings={setPaperSettings}
                onResetDefault={handleResetData}
              />
            )}
          </main>

          {/* Right Sidebar: Cleaned Inspector, Quick Paper Switcher & Scratchpad */}
          <RightSidebar
            paperSettings={paperSettings}
            setPaperSettings={setPaperSettings}
            onPrintPreview={() => setIsPrintModalOpen(true)}
            balanceSheetData={balanceSheetData}
            onLockSystem={handleLockSystem}
            mobileOpen={mobileRightOpen}
            onCloseMobile={() => setMobileRightOpen(false)}
          />
        </div>
      </div>

      {/* 2. Bottom Windows 95 Taskbar */}
      <Taskbar95
        activeView={activeView}
        setActiveView={setActiveView}
        isBalanced={balanceSheetData.isBalanced}
        difference={balanceSheetData.difference}
        cloudStatus={cloudStatus}
        onOpenNewJournalModal={handleOpenNewJournal}
      />

      {/* 3. Modal Dialogs */}
      <NewJournalModal
        isOpen={isNewJournalOpen}
        onClose={() => {
          setIsNewJournalOpen(false);
          setEditingTransaction(null);
        }}
        accounts={accounts}
        onSave={handleSaveJournal}
        editingTransaction={editingTransaction}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        paperSettings={paperSettings}
        activeView={activeView}
        incomeData={incomeData}
        balanceSheetData={balanceSheetData}
        trialBalanceData={trialBalanceData}
        transactions={transactions}
        accounts={accounts}
      />

      {/* 4. Access Code Gate (Closes popup on valid PIN) */}
      <AccessCodeModal
        isOpen={!isAuthenticated}
        onAuthenticate={handleAuthenticateSuccess}
        storedAccessCode={storedAccessCode}
      />

      {/* 5. Retro Floating Save Indicator Toast */}
      {saveToast && (
        <div style={{
          position: 'fixed',
          bottom: '36px',
          right: '12px',
          zIndex: 99999,
          backgroundColor: '#c0c0c0',
          borderTop: '2px solid #ffffff',
          borderLeft: '2px solid #ffffff',
          borderRight: '2px solid #000000',
          borderBottom: '2px solid #000000',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'ms_sans_serif, Tahoma, sans-serif',
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#000080'
        }}>
          <span style={{ fontSize: '15px' }}>💾</span>
          <div>
            <div style={{ fontSize: '9px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Cloud Database Sync
            </div>
            <div>{saveToast}</div>
          </div>
        </div>
      )}
    </div>
  );
}
