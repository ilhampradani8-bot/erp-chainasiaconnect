import React, { useState, useEffect } from 'react';
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
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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
  };

  // Financial Calculations
  const trialBalanceData = calculateTrialBalance(accounts, transactions);
  const incomeData = calculateIncomeStatement(accounts, transactions);
  const balanceSheetData = calculateBalanceSheet(accounts, transactions);

  // Handle new transaction saved
  const handleSaveJournal = async (newTx) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await saveTransactionToDb(newTx);
  };

  // Handle transaction deleted
  const handleDeleteJournal = async (id, voucherNo) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await deleteTransactionFromDb(voucherNo);
  };

  // Handle account added or edited
  const handleSaveAccount = async (acc) => {
    await saveAccountToDb(acc);
  };

  // Handle account deleted
  const handleDeleteAccount = async (code) => {
    await deleteAccountFromDb(code);
  };

  // Reset Data to standard initial
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang semua data pembukuan ke default awal PT Chain Asia Connect?')) {
      setAccounts(INITIAL_ACCOUNTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setPaperSettings(DEFAULT_PAPER_SETTINGS);
      localStorage.removeItem('erp_scratchpad');
      alert('Data sistem berhasil direset ke standar!');
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
          setActiveView={setActiveView}
          onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
          onPrint={() => setIsPrintModalOpen(true)}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onResetData={handleResetData}
          onLockSystem={handleLockSystem}
          onRefresh={() => window.location.reload()}
        />

        {/* Workspace Body: Left Sidebar + Center Content Page + Right Sidebar */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: '#c0c0c0'
        }}>
          {/* Left Sidebar: Accounting Module Tree & Live Liquidity (Central Navigation) */}
          <LeftSidebar
            activeView={activeView}
            setActiveView={setActiveView}
            accounts={accounts}
            transactions={transactions}
            onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
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
              />
            )}

            {activeView === 'jurnal' && (
              <JurnalUmumView
                transactions={transactions}
                setTransactions={setTransactions}
                accounts={accounts}
                onOpenNewModal={() => setIsNewJournalOpen(true)}
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
              />
            )}

            {activeView === 'neraca' && (
              <NeracaView
                balanceSheetData={balanceSheetData}
                onPrint={() => setIsPrintModalOpen(true)}
              />
            )}

            {activeView === 'baganakun' && (
              <BaganAkunView
                accounts={accounts}
                setAccounts={setAccounts}
                transactions={transactions}
              />
            )}

            {activeView === 'pengaturankertas' && (
              <PengaturanKertasView
                paperSettings={paperSettings}
                setPaperSettings={setPaperSettings}
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
        onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
      />

      {/* 3. Modal Dialogs */}
      <NewJournalModal
        isOpen={isNewJournalOpen}
        onClose={() => setIsNewJournalOpen(false)}
        accounts={accounts}
        onSave={handleSaveJournal}
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
    </div>
  );
}
