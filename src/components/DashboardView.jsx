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
  onNavigate
}) {
  const { totalRevenue, totalCogs, totalOpExpenses, netIncome } = incomeData;
  const { totalAssets, totalLiabilities, totalEquity, isBalanced } = balanceSheetData;

  // Chart calculation: Revenue vs Cost breakdown
  const barCategories = [
    { label: 'Pendapatan Kargo', value: 110000000, color: '#00007c' },
    { label: 'Pendapatan Gudang', value: 38000000, color: '#1084d0' },
    { label: 'Handling Impor', value: 54000000, color: '#008080' },
    { label: 'HPP Freight Kapal', value: 42000000, color: '#800000' },
    { label: 'HPP BBM & Tol', value: 18500000, color: '#a0522d' },
    { label: 'Beban Gaji Staf', value: 14000000, color: '#4b0082' },
    { label: 'Beban Servis Armada', value: 7800000, color: '#4682b4' }
  ];

  const maxBarValue = Math.max(...barCategories.map(b => b.value));

  // Monthly trend mock data for cashflow curve
  const monthlyData = [
    { month: 'Mei', rev: 140, exp: 95, profit: 45 },
    { month: 'Jun', rev: 165, exp: 110, profit: 55 },
    { month: 'Jul', rev: 180, exp: 125, profit: 55 },
    { month: 'Ags', rev: 175, exp: 118, profit: 57 },
    { month: 'Sep', rev: 195, exp: 130, profit: 65 },
    { month: 'Okt', rev: Math.round(totalRevenue / 1000000), exp: Math.round((totalCogs + totalOpExpenses) / 1000000), profit: Math.round(netIncome / 1000000) }
  ];

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
            PT. CHAIN ASIA CONNECT - Laporan Akuntansi Periode Berjalan (SAK ETAP Indonesia)
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
            Freight, Port handling & Gudang
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
            Freight kapal, BBM tol, utilitas
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
            Margin Bersih: {totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : 0}%
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
            {isBalanced ? '✓ Neraca Seimbang 100%' : '⚠ Selisih Pembukuan!'}
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
            <span>📊 Grafik Distribusi Pos Pendapatan & Beban Utama</span>
            <span style={{ fontSize: '10px' }}>Nominal (IDR)</span>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '2px inset #000',
            padding: '8px',
            height: '220px',
            overflowY: 'auto'
          }}>
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
              <svg viewBox="0 0 300 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Grid Lines */}
                <line x1="20" y1="20" x2="290" y2="20" stroke="#f0f0f0" strokeDasharray="2,2" />
                <line x1="20" y1="55" x2="290" y2="55" stroke="#f0f0f0" strokeDasharray="2,2" />
                <line x1="20" y1="90" x2="290" y2="90" stroke="#f0f0f0" strokeDasharray="2,2" />
                <line x1="20" y1="120" x2="290" y2="120" stroke="#808080" />
                <line x1="20" y1="10" x2="20" y2="120" stroke="#808080" />

                {/* Y-axis labels */}
                <text x="5" y="24" fontSize="8" fill="#666">200</text>
                <text x="5" y="59" fontSize="8" fill="#666">100</text>
                <text x="5" y="94" fontSize="8" fill="#666">50</text>
                <text x="10" y="123" fontSize="8" fill="#666">0</text>

                {/* Points: Rev */}
                <polyline
                  fill="none"
                  stroke="#00007c"
                  strokeWidth="2"
                  points={monthlyData.map((d, i) => `${40 + i * 46},${120 - (d.rev / 200) * 100}`).join(' ')}
                />
                {monthlyData.map((d, i) => (
                  <circle key={`r-${i}`} cx={40 + i * 46} cy={120 - (d.rev / 200) * 100} r="3" fill="#00007c" />
                ))}

                {/* Points: Exp */}
                <polyline
                  fill="none"
                  stroke="#800000"
                  strokeWidth="2"
                  points={monthlyData.map((d, i) => `${40 + i * 46},${120 - (d.exp / 200) * 100}`).join(' ')}
                />
                {monthlyData.map((d, i) => (
                  <circle key={`e-${i}`} cx={40 + i * 46} cy={120 - (d.exp / 200) * 100} r="3" fill="#800000" />
                ))}

                {/* Points: Profit */}
                <polyline
                  fill="none"
                  stroke="#006600"
                  strokeWidth="2"
                  strokeDasharray="3,2"
                  points={monthlyData.map((d, i) => `${40 + i * 46},${120 - (d.profit / 200) * 100}`).join(' ')}
                />
                {monthlyData.map((d, i) => (
                  <rect key={`p-${i}`} x={38 + i * 46} y={118 - (d.profit / 200) * 100} width="4" height="4" fill="#006600" />
                ))}

                {/* X labels */}
                {monthlyData.map((d, i) => (
                  <text key={`l-${i}`} x={35 + i * 46} y="130" fontSize="9" fill="#333">{d.month}</text>
                ))}
              </svg>
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
              {transactions.slice(0, 5).map((tx) => {
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
              })}
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
