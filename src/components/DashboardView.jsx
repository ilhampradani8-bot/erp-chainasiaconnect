import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Scale,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { formatRupiah, formatNumber } from '../utils/accountingMath';

export default function DashboardView({
  incomeData,
  balanceSheetData,
  trialBalanceData,
  transactions,
  accounts,
  onNavigate,
  paperSettings
}) {
  const { totalRevenue, totalCogs, totalOpExpenses, netIncome } = incomeData;
  const { totalAssets, totalLiabilities, totalEquity, isBalanced } = balanceSheetData;

  const company = paperSettings?.companyName || 'PT. CHAIN ASIA CONNECT';
  const currentPeriodStr = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());

  // 1. Dynamic Bar Categories: Calculate real revenue and expense distribution
  const allRevAccounts = [...(incomeData.revenueAccounts || []), ...(incomeData.otherRevenueAccounts || [])].filter(a => a.amount > 0);
  const allExpAccounts = [...(incomeData.cogsAccounts || []), ...(incomeData.opExpenseAccounts || []), ...(incomeData.otherExpenseAccounts || [])].filter(a => a.amount > 0);

  let barCategories = [];
  if (allRevAccounts.length > 0 || allExpAccounts.length > 0) {
    const topRev = allRevAccounts.sort((a, b) => b.amount - a.amount).slice(0, 4).map(a => ({
      label: a.name.split('(')[0].trim(),
      value: a.amount,
      color: '#00007c'
    }));
    const topExp = allExpAccounts.sort((a, b) => b.amount - a.amount).slice(0, 4).map(a => ({
      label: a.name.split('(')[0].trim(),
      value: a.amount,
      color: '#800000'
    }));
    barCategories = [...topRev, ...topExp];
  } else if (totalRevenue > 0 || totalCogs > 0 || totalOpExpenses > 0) {
    barCategories = [
      { label: 'Pendapatan Usaha', value: totalRevenue, color: '#00007c' },
      { label: 'Beban Pokok Pendapatan (HPP)', value: totalCogs, color: '#800000' },
      { label: 'Beban Operasional Usaha', value: totalOpExpenses, color: '#a0522d' },
      { label: 'Laba Bersih Berjalan', value: Math.max(0, netIncome), color: '#006600' }
    ].filter(b => b.value > 0);
  }

  const maxBarValue = Math.max(1, ...barCategories.map(b => b.value));

  // 2. Dynamic Monthly Trend Data:
  // Build rolling 6 months based on current real date and actual journal transactions
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthlyData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${yr}-${mo}`;
    const label = monthNames[d.getMonth()];

    // Sum transactions in this specific month
    const monthTx = transactions.filter(t => t.date && t.date.startsWith(monthKey));
    let rev = 0;
    let exp = 0;

    monthTx.forEach(t => {
      t.lines.forEach(l => {
        const acc = accounts.find(a => a.code === l.accountCode);
        if (!acc) return;
        const dNom = Number(l.debit) || 0;
        const kNom = Number(l.credit) || 0;
        if (acc.category === 'PENDAPATAN' || acc.category === 'PENDAPATAN_LAIN') {
          rev += (kNom - dNom);
        } else if (acc.category === 'HPP' || acc.category === 'BEBAN' || acc.category === 'BEBAN_LAIN') {
          exp += (dNom - kNom);
        }
      });
    });

    monthlyData.push({
      month: label,
      rev: Math.round(rev / 1000000), // in millions
      exp: Math.round(exp / 1000000),
      profit: Math.round((rev - exp) / 1000000),
      rawRev: rev,
      rawExp: exp,
      rawProfit: rev - exp
    });
  }

  const maxMonthlyVal = Math.max(1, ...monthlyData.map(d => Math.max(d.rev, d.exp, Math.abs(d.profit))));

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* 1. Header Banner & Status Bar */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-navy-blue)' }}>
            DASHBOARD KINERJA KEUANGAN & GRAFIK EKSEKUTIF
          </div>
          <div style={{ fontSize: '11px', color: '#555' }}>
            {company} - Laporan Akuntansi Periode {currentPeriodStr} (SAK ETAP)
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => onNavigate('jurnal')} className="btn-primary">
            + Entri Jurnal
          </button>
          <button onClick={() => onNavigate('labarugi')}>
            Lihat Laba Rugi
          </button>
          <button onClick={() => onNavigate('neraca')}>
            Lihat Neraca
          </button>
        </div>
      </div>

      {/* 2. Key Financial Metric Cards (Windows 90s Inset Boxes) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        {/* Card 1: Total Pendapatan */}
        <div style={metricBoxStyle}>
          <div style={metricHeaderStyle}>
            <TrendingUp size={13} color="#00007c" />
            <span>PENDAPATAN USAHA</span>
          </div>
          <div style={metricValueStyle}>
            {formatRupiah(totalRevenue)}
          </div>
          <div style={metricSubStyle}>
            {allRevAccounts.length > 0 ? `${allRevAccounts.length} Akun Pendapatan Aktif` : '0 Transaksi'}
          </div>
        </div>

        {/* Card 2: Total Beban Pokok & Operasional */}
        <div style={metricBoxStyle}>
          <div style={metricHeaderStyle}>
            <TrendingDown size={13} color="#800000" />
            <span>HPP & BEBAN OPERASIONAL</span>
          </div>
          <div style={{ ...metricValueStyle, color: '#800000' }}>
            {formatRupiah(totalCogs + totalOpExpenses)}
          </div>
          <div style={metricSubStyle}>
            {allExpAccounts.length > 0 ? `${allExpAccounts.length} Akun Beban Aktif` : '0 Transaksi'}
          </div>
        </div>

        {/* Card 3: Laba Bersih */}
        <div style={metricBoxStyle}>
          <div style={metricHeaderStyle}>
            <Activity size={13} color="#006600" />
            <span>LABA BERSIH PERIODE INI</span>
          </div>
          <div style={{ ...metricValueStyle, color: netIncome >= 0 ? '#006600' : '#b00' }}>
            {formatRupiah(netIncome)}
          </div>
          <div style={metricSubStyle}>
            {totalRevenue > 0 ? `Margin Bersih: ${((netIncome / totalRevenue) * 100).toFixed(1)}%` : 'Margin Bersih: 0%'}
          </div>
        </div>

        {/* Card 4: Total Aset */}
        <div style={metricBoxStyle}>
          <div style={metricHeaderStyle}>
            <Scale size={13} color="#00007c" />
            <span>TOTAL AKTIVA / ASET</span>
          </div>
          <div style={metricValueStyle}>
            {formatRupiah(totalAssets)}
          </div>
          <div style={{ ...metricSubStyle, color: isBalanced ? '#006600' : '#b00', fontWeight: 'bold' }}>
            {transactions.length === 0 ? 'Neraca Awal Bersih (Rp 0)' : (isBalanced ? '✓ Neraca Seimbang 100%' : '⚠ Selisih Pembukuan!')}
          </div>
        </div>
      </div>

      {/* 3. Financial Charts (Pure SVG Retro Windows 90s Presentation) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px' }}>
        {/* Chart 1: Bar Chart Perbandingan Akun Pendapatan & Beban */}
        <div style={{
          backgroundColor: 'var(--color-silver)',
          border: '2px solid',
          borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
          padding: '6px'
        }}>
          <div style={{
            backgroundColor: 'var(--color-navy-blue)',
            color: '#ffffff',
            padding: '3px 6px',
            fontSize: '11px',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px'
          }}>
            <span>📊 Grafik Distribusi Pos Pendapatan & Beban</span>
            <span style={{ fontSize: '10px' }}>Nominal (IDR)</span>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '2px inset #000',
            padding: '8px',
            height: '220px',
            overflowY: 'auto'
          }}>
            {transactions.length === 0 || barCategories.length === 0 ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontStyle: 'italic',
                fontSize: '11px',
                textAlign: 'center',
                padding: '16px',
                gap: '4px'
              }}>
                <span>📊 Belum ada data transaksi pendapatan & beban tercatat.</span>
                <span style={{ fontSize: '10px', color: '#888' }}>Grafik akan otomatis terisi saat entri jurnal dicatat.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {barCategories.map((item, idx) => {
                  const pct = Math.round((item.value / maxBarValue) * 100);
                  return (
                    <div key={idx} style={{ fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontWeight: '500' }}>{item.label}</span>
                        <span style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}>{formatRupiah(item.value)}</span>
                      </div>
                      {/* Retro Windows 3D Bar */}
                      <div style={{
                        height: '14px',
                        backgroundColor: '#e0e0e0',
                        border: '1px solid #808080',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: item.color,
                          borderRight: '1px solid #000',
                          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.1) 100%)'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Tren Bulanan Pendapatan vs Beban (Line Area Chart) */}
        <div style={{
          backgroundColor: 'var(--color-silver)',
          border: '2px solid',
          borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
          padding: '6px'
        }}>
          <div style={{
            backgroundColor: 'var(--color-navy-blue)',
            color: '#ffffff',
            padding: '3px 6px',
            fontSize: '11px',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px'
          }}>
            <span>📈 Tren Arus Finansial 6 Bulan Terakhir (Juta Rp)</span>
            <span style={{ fontSize: '10px' }}>Tren Laba</span>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '2px inset #000',
            padding: '8px',
            height: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '12px', fontSize: '10.5px', borderBottom: '1px solid #e0e0e0', paddingBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#00007c' }} />
                <span>Pendapatan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#800000' }} />
                <span>Beban</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#006600' }} />
                <span>Laba Bersih</span>
              </div>
            </div>

            {/* SVG Visual Graphic */}
            <div style={{ flex: 1, position: 'relative', marginTop: '6px' }}>
              {transactions.length === 0 ? (
                <div style={{
                  height: '100%',
                  minHeight: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontStyle: 'italic',
                  fontSize: '11px',
                  textAlign: 'center',
                  padding: '16px',
                  gap: '4px'
                }}>
                  <span>📈 Belum ada riwayat transaksi bulanan.</span>
                  <span style={{ fontSize: '10px', color: '#888' }}>Kurva tren finansial akan terbentuk otomatis saat transaksi dicatat.</span>
                </div>
              ) : (
                <svg viewBox="0 0 300 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="25" y1="20" x2="290" y2="20" stroke="#f0f0f0" strokeDasharray="2,2" />
                  <line x1="25" y1="55" x2="290" y2="55" stroke="#f0f0f0" strokeDasharray="2,2" />
                  <line x1="25" y1="90" x2="290" y2="90" stroke="#f0f0f0" strokeDasharray="2,2" />
                  <line x1="25" y1="120" x2="290" y2="120" stroke="#808080" />
                  <line x1="25" y1="10" x2="25" y2="120" stroke="#808080" />

                  {/* Y-axis labels dynamically calculated */}
                  <text x="3" y="24" fontSize="8" fill="#666">{maxMonthlyVal}</text>
                  <text x="3" y="59" fontSize="8" fill="#666">{Math.round((maxMonthlyVal * 2) / 3)}</text>
                  <text x="3" y="94" fontSize="8" fill="#666">{Math.round(maxMonthlyVal / 3)}</text>
                  <text x="12" y="123" fontSize="8" fill="#666">0</text>

                  {/* Points: Rev */}
                  <polyline
                    fill="none"
                    stroke="#00007c"
                    strokeWidth="2"
                    points={monthlyData.map((d, i) => `${45 + i * 44},${120 - Math.min(100, Math.max(0, (d.rev / maxMonthlyVal) * 100))}`).join(' ')}
                  />
                  {monthlyData.map((d, i) => (
                    <circle key={`r-${i}`} cx={45 + i * 44} cy={120 - Math.min(100, Math.max(0, (d.rev / maxMonthlyVal) * 100))} r="3" fill="#00007c">
                      <title>{`${d.month}: Pendapatan ${formatRupiah(d.rawRev)}`}</title>
                    </circle>
                  ))}

                  {/* Points: Exp */}
                  <polyline
                    fill="none"
                    stroke="#800000"
                    strokeWidth="2"
                    points={monthlyData.map((d, i) => `${45 + i * 44},${120 - Math.min(100, Math.max(0, (d.exp / maxMonthlyVal) * 100))}`).join(' ')}
                  />
                  {monthlyData.map((d, i) => (
                    <circle key={`e-${i}`} cx={45 + i * 44} cy={120 - Math.min(100, Math.max(0, (d.exp / maxMonthlyVal) * 100))} r="3" fill="#800000">
                      <title>{`${d.month}: Beban ${formatRupiah(d.rawExp)}`}</title>
                    </circle>
                  ))}

                  {/* Points: Profit */}
                  <polyline
                    fill="none"
                    stroke="#006600"
                    strokeWidth="2"
                    strokeDasharray="3,2"
                    points={monthlyData.map((d, i) => `${45 + i * 44},${120 - Math.min(100, Math.max(0, (d.profit / maxMonthlyVal) * 100))}`).join(' ')}
                  />
                  {monthlyData.map((d, i) => (
                    <rect key={`p-${i}`} x={43 + i * 44} y={118 - Math.min(100, Math.max(0, (d.profit / maxMonthlyVal) * 100))} width="4" height="4" fill="#006600">
                      <title>{`${d.month}: Laba ${formatRupiah(d.rawProfit)}`}</title>
                    </rect>
                  ))}

                  {/* X labels */}
                  {monthlyData.map((d, i) => (
                    <text key={`l-${i}`} x={38 + i * 44} y="130" fontSize="9" fill="#333">{d.month}</text>
                  ))}
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Accounting Journal Activity Summary */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px'
      }}>
        <div style={{
          backgroundColor: 'var(--color-navy-blue)',
          color: '#ffffff',
          padding: '3px 6px',
          fontSize: '11px',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px'
        }}>
          <span>📑 Transaksi Jurnal Umum Terakhir</span>
          <button onClick={() => onNavigate('jurnal')} style={{ fontSize: '10px', padding: '1px 6px' }}>
            Lihat Semua Jurnal »
          </button>
        </div>

        <div className="excel-table-container" style={{ maxHeight: '140px' }}>
          <table className="excel-table">
            <thead>
              <tr>
                <th style={{ width: '85px' }}>Tanggal</th>
                <th style={{ width: '110px' }}>No. Voucher</th>
                <th>Keterangan Transaksi</th>
                <th style={{ width: '100px' }}>Referensi</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Total Debit (Rp)</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Total Kredit (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '16px', color: '#666', fontStyle: 'italic' }}>
                    Belum ada transaksi jurnal pembukuan. Klik tombol "+ Entri Jurnal" di atas untuk menambah transaksi baru.
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((tx) => {
                  const totalD = tx.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
                  const totalK = tx.lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
                  return (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}>{tx.voucherNo}</td>
                      <td>{tx.description}</td>
                      <td style={{ color: '#555' }}>{tx.reference || '-'}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(totalD)}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(totalK)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const metricBoxStyle = {
  backgroundColor: 'var(--color-silver)',
  border: '2px solid',
  borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
  padding: '6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '3px'
};

const metricHeaderStyle = {
  fontSize: '10.5px',
  fontWeight: '600',
  color: 'var(--color-navy-blue)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

const metricValueStyle = {
  backgroundColor: '#ffffff',
  border: '2px inset #000',
  padding: '4px 6px',
  fontSize: '14px',
  fontWeight: 'bold',
  fontFamily: 'Courier New, monospace',
  color: '#00007c',
  textAlign: 'right'
};

const metricSubStyle = {
  fontSize: '10px',
  color: '#555',
  textAlign: 'right',
  marginTop: '1px'
};
