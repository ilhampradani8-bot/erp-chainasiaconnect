// Accounting Mathematics & Financial Calculations Utility (Indonesian Accounting Standards / SAK)

export const formatRupiah = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 'Rp 0';
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(absVal);
  return isNeg ? `(${formatted})` : formatted;
};

export const formatNumber = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('id-ID').format(val);
};

// Calculate Trial Balance (Neraca Saldo)
export const calculateTrialBalance = (accounts, transactions) => {
  // Map account codes to balances
  const balances = {};
  accounts.forEach((acc) => {
    balances[acc.code] = {
      account: acc,
      initialDebit: acc.normalBalance === 'D' ? acc.initialBalance : 0,
      initialCredit: acc.normalBalance === 'K' ? acc.initialBalance : 0,
      mutDebit: 0,
      mutCredit: 0,
      finalDebit: 0,
      finalCredit: 0
    };
  });

  // Accumulate transactions
  transactions.forEach((tx) => {
    tx.lines.forEach((line) => {
      if (balances[line.accountCode]) {
        balances[line.accountCode].mutDebit += Number(line.debit) || 0;
        balances[line.accountCode].mutCredit += Number(line.credit) || 0;
      }
    });
  });

  let totalDebit = 0;
  let totalCredit = 0;

  const rows = Object.values(balances).map((item) => {
    const acc = item.account;
    const totalD = item.initialDebit + item.mutDebit;
    const totalK = item.initialCredit + item.mutCredit;

    if (acc.normalBalance === 'D') {
      const net = totalD - totalK;
      if (net >= 0) {
        item.finalDebit = net;
        item.finalCredit = 0;
      } else {
        item.finalDebit = 0;
        item.finalCredit = Math.abs(net);
      }
    } else {
      const net = totalK - totalD;
      if (net >= 0) {
        item.finalCredit = net;
        item.finalDebit = 0;
      } else {
        item.finalCredit = 0;
        item.finalDebit = Math.abs(net);
      }
    }

    totalDebit += item.finalDebit;
    totalCredit += item.finalCredit;
    return item;
  });

  const isBalanced = Math.abs(totalDebit - totalCredit) < 1;
  const difference = Math.abs(totalDebit - totalCredit);

  return {
    rows,
    totalDebit,
    totalCredit,
    isBalanced,
    difference
  };
};

// Calculate Income Statement (Laporan Laba Rugi)
export const calculateIncomeStatement = (accounts, transactions) => {
  const trial = calculateTrialBalance(accounts, transactions);
  const trialMap = {};
  trial.rows.forEach(r => {
    trialMap[r.account.code] = r;
  });

  // 1. Pendapatan (Category 'PENDAPATAN')
  const revenueAccounts = accounts.filter(a => a.category === 'PENDAPATAN').map(acc => {
    const r = trialMap[acc.code];
    const amount = (r.finalCredit || 0) - (r.finalDebit || 0);
    return { ...acc, amount };
  });
  const totalRevenue = revenueAccounts.reduce((sum, a) => sum + a.amount, 0);

  // 2. HPP (Category 'HPP')
  const cogsAccounts = accounts.filter(a => a.category === 'HPP').map(acc => {
    const r = trialMap[acc.code];
    const amount = (r.finalDebit || 0) - (r.finalCredit || 0);
    return { ...acc, amount };
  });
  const totalCogs = cogsAccounts.reduce((sum, a) => sum + a.amount, 0);

  // Laba Kotor
  const grossProfit = totalRevenue - totalCogs;

  // 3. Beban Operasional (Category 'BEBAN')
  const opExpenseAccounts = accounts.filter(a => a.category === 'BEBAN').map(acc => {
    const r = trialMap[acc.code];
    const amount = (r.finalDebit || 0) - (r.finalCredit || 0);
    return { ...acc, amount };
  });
  const totalOpExpenses = opExpenseAccounts.reduce((sum, a) => sum + a.amount, 0);

  // Laba Operasional
  const operatingProfit = grossProfit - totalOpExpenses;

  // 4. Pendapatan Lain & Beban Lain
  const otherRevenueAccounts = accounts.filter(a => a.category === 'PENDAPATAN_LAIN').map(acc => {
    const r = trialMap[acc.code];
    const amount = (r.finalCredit || 0) - (r.finalDebit || 0);
    return { ...acc, amount };
  });
  const totalOtherRevenue = otherRevenueAccounts.reduce((sum, a) => sum + a.amount, 0);

  const otherExpenseAccounts = accounts.filter(a => a.category === 'BEBAN_LAIN').map(acc => {
    const r = trialMap[acc.code];
    const amount = (r.finalDebit || 0) - (r.finalCredit || 0);
    return { ...acc, amount };
  });
  const totalOtherExpenses = otherExpenseAccounts.reduce((sum, a) => sum + a.amount, 0);

  // Laba Bersih
  const netIncome = operatingProfit + totalOtherRevenue - totalOtherExpenses;

  return {
    revenueAccounts,
    totalRevenue,
    cogsAccounts,
    totalCogs,
    grossProfit,
    opExpenseAccounts,
    totalOpExpenses,
    operatingProfit,
    otherRevenueAccounts,
    totalOtherRevenue,
    otherExpenseAccounts,
    totalOtherExpenses,
    netIncome
  };
};

// Calculate Balance Sheet (Neraca Keuangan / Sheet Balance)
export const calculateBalanceSheet = (accounts, transactions) => {
  const trial = calculateTrialBalance(accounts, transactions);
  const trialMap = {};
  trial.rows.forEach(r => {
    trialMap[r.account.code] = r;
  });

  const income = calculateIncomeStatement(accounts, transactions);

  // Aset Lancar: Accounts in ASET where subCategory is 'Aset Lancar' or code starts with '1-1'
  const currentAssets = accounts
    .filter(a => a.category === 'ASET' && (a.subCategory === 'Aset Lancar' || a.code.startsWith('1-1')))
    .map(acc => {
      const r = trialMap[acc.code] || { finalDebit: 0, finalCredit: 0 };
      const amount = (r.finalDebit || 0) - (r.finalCredit || 0);
      return { ...acc, amount };
    });
  const totalCurrentAssets = currentAssets.reduce((sum, a) => sum + a.amount, 0);

  // Aset Tetap: Accounts in ASET not in currentAssets
  const fixedAssets = accounts
    .filter(a => a.category === 'ASET' && !(a.subCategory === 'Aset Lancar' || a.code.startsWith('1-1')))
    .map(acc => {
      const r = trialMap[acc.code] || { finalDebit: 0, finalCredit: 0 };
      const amount = (r.finalDebit || 0) - (r.finalCredit || 0);
      return { ...acc, amount };
    });
  const totalFixedAssets = fixedAssets.reduce((sum, a) => sum + a.amount, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  // Kewajiban Lancar: Accounts in KEWAJIBAN where subCategory is 'Kewajiban Lancar' or code starts with '2-1'
  const currentLiabilities = accounts
    .filter(a => a.category === 'KEWAJIBAN' && (a.subCategory === 'Kewajiban Lancar' || a.code.startsWith('2-1')))
    .map(acc => {
      const r = trialMap[acc.code] || { finalDebit: 0, finalCredit: 0 };
      const amount = (r.finalCredit || 0) - (r.finalDebit || 0);
      return { ...acc, amount };
    });
  const totalCurrentLiabilities = currentLiabilities.reduce((sum, a) => sum + a.amount, 0);

  // Kewajiban Jangka Panjang: Accounts in KEWAJIBAN not in currentLiabilities
  const longTermLiabilities = accounts
    .filter(a => a.category === 'KEWAJIBAN' && !(a.subCategory === 'Kewajiban Lancar' || a.code.startsWith('2-1')))
    .map(acc => {
      const r = trialMap[acc.code] || { finalDebit: 0, finalCredit: 0 };
      const amount = (r.finalCredit || 0) - (r.finalDebit || 0);
      return { ...acc, amount };
    });
  const totalLongTermLiabilities = longTermLiabilities.reduce((sum, a) => sum + a.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  // Ekuitas: Accounts in EKUITAS
  const equityAccounts = accounts
    .filter(a => a.category === 'EKUITAS')
    .map(acc => {
      const r = trialMap[acc.code] || { finalDebit: 0, finalCredit: 0 };
      const amount = (r.finalCredit || 0) - (r.finalDebit || 0);
      return { ...acc, amount };
    });
  const totalEquityBase = equityAccounts.reduce((sum, a) => sum + a.amount, 0);
  const netIncomeThisYear = income.netIncome; // Laba Tahun Berjalan dari Laba Rugi
  const totalEquity = totalEquityBase + netIncomeThisYear;

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  const difference = Math.abs(totalAssets - totalLiabilitiesAndEquity);
  const isBalanced = difference < 1;

  return {
    currentAssets,
    totalCurrentAssets,
    fixedAssets,
    totalFixedAssets,
    totalAssets,
    currentLiabilities,
    totalCurrentLiabilities,
    longTermLiabilities,
    totalLongTermLiabilities,
    totalLiabilities,
    equityAccounts,
    totalEquityBase,
    netIncomeThisYear,
    totalEquity,
    totalLiabilitiesAndEquity,
    isBalanced,
    difference
  };
};

// General Ledger (Buku Besar) per Account with dynamic date filtering
export const calculateGeneralLedger = (accountCode, accounts, transactions, dateStart = '', dateEnd = '') => {
  const account = accounts.find(a => a.code === accountCode);
  if (!account) return { account: null, rows: [], endingBalance: 0, openingBalance: 0 };

  const initialBal = account.initialBalance || 0;
  let openingBal = initialBal;
  const sortedTx = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  const periodTx = [];

  sortedTx.forEach(tx => {
    const isPrior = dateStart && tx.date < dateStart;
    const isAfter = dateEnd && tx.date > dateEnd;

    tx.lines.forEach(line => {
      if (line.accountCode === accountCode) {
        const d = Number(line.debit) || 0;
        const k = Number(line.credit) || 0;
        const mutation = account.normalBalance === 'D' ? (d - k) : (k - d);

        if (isPrior) {
          openingBal += mutation;
        } else if (!isAfter) {
          periodTx.push({
            date: tx.date,
            voucherNo: tx.voucherNo,
            description: tx.description + (line.memo ? ` (${line.memo})` : ''),
            debit: d,
            credit: k,
            mutation
          });
        }
      }
    });
  });

  let runningBal = openingBal;
  const rows = [
    {
      date: dateStart || '-',
      voucherNo: 'SALDO-AWAL',
      description: dateStart ? `Saldo Awal per ${dateStart}` : 'Saldo Awal Buku Besar',
      debit: account.normalBalance === 'D' && openingBal > 0 ? openingBal : 0,
      credit: account.normalBalance === 'K' && openingBal > 0 ? openingBal : 0,
      balance: runningBal
    }
  ];

  periodTx.forEach(txItem => {
    runningBal += txItem.mutation;
    rows.push({
      date: txItem.date,
      voucherNo: txItem.voucherNo,
      description: txItem.description,
      debit: txItem.debit,
      credit: txItem.credit,
      balance: runningBal
    });
  });

  return {
    account,
    rows,
    openingBalance: openingBal,
    endingBalance: runningBal
  };
};
