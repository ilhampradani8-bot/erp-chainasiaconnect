import React from 'react';
import { formatRupiah, formatNumber } from '../utils/accountingMath';
import { TrendingUp, Printer, FileText } from 'lucide-react';

export default function LabaRugiView({
  incomeData,
  onPrint,
  paperSettings
}) {
  const {
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
  } = incomeData;

  const company = paperSettings?.companyName || 'PT. CHAIN ASIA CONNECT';
  const periodStr = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      {/* 1. Header Toolbar */}
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
            LAPORAN LABA RUGI KOMPREHENSIF (INCOME STATEMENT)
          </div>
          <div style={{ fontSize: '11px', color: '#555' }}>
            {company} - Periode Berjalan per {periodStr}
          </div>
        </div>

        <button onClick={onPrint} className="btn-primary">
          <Printer size={12} />
          <span>Cetak Laporan Laba Rugi</span>
        </button>
      </div>

      {/* 2. Structured Financial Statement Sheet (Paper Style) */}
      <div className="excel-table-container" style={{ flex: 1, padding: '16px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          {/* Header Title inside document */}
          <div style={{ textAlign: 'center', marginBottom: '16px', borderBottom: '2px solid #000', paddingBottom: '8px' }}>
            <h2 style={{ fontSize: '14px', margin: 0, textTransform: 'uppercase' }}>{company}</h2>
            <h3 style={{ fontSize: '13px', margin: '2px 0', color: 'var(--color-navy-blue)' }}>LAPORAN LABA RUGI (INCOME STATEMENT)</h3>
            <p style={{ fontSize: '11px', margin: 0, color: '#555' }}>Untuk Periode yang Berakhir pada {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())} (Dinyatakan dalam Rupiah)</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
            <tbody>
              {/* SECTION 1: PENDAPATAN OPERASIONAL */}
              <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                <td colSpan={2} style={{ padding: '6px 8px', borderBottom: '1px solid #000' }}>
                  I. PENDAPATAN OPERASIONAL
                </td>
                <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #000' }}></td>
              </tr>
              {revenueAccounts.map(acc => (
                <tr key={acc.code}>
                  <td style={{ width: '90px', padding: '3px 8px', color: '#666', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                  <td style={{ padding: '3px 8px' }}>{acc.name}</td>
                  <td style={{ width: '150px', textAlign: 'right', padding: '3px 8px', fontFamily: 'Courier New, monospace' }}>
                    {formatNumber(acc.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', borderTop: '1px solid #ccc' }}>
                <td colSpan={2} style={{ padding: '4px 8px', textIndent: '10px' }}>TOTAL PENDAPATAN USAHA</td>
                <td style={{ textAlign: 'right', padding: '4px 8px', fontFamily: 'Courier New, monospace', borderBottom: '1px solid #000' }}>
                  {formatNumber(totalRevenue)}
                </td>
              </tr>

              {/* Space */}
              <tr><td colSpan={3} style={{ height: '10px' }}></td></tr>

              {/* SECTION 2: HPP (BEBAN POKOK PENDAPATAN) */}
              <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                <td colSpan={2} style={{ padding: '6px 8px', borderBottom: '1px solid #000' }}>
                  II. BEBAN POKOK PENDAPATAN (HPP)
                </td>
                <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #000' }}></td>
              </tr>
              {cogsAccounts.map(acc => (
                <tr key={acc.code}>
                  <td style={{ padding: '3px 8px', color: '#666', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                  <td style={{ padding: '3px 8px' }}>{acc.name}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px', fontFamily: 'Courier New, monospace' }}>
                    {formatNumber(acc.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', borderTop: '1px solid #ccc' }}>
                <td colSpan={2} style={{ padding: '4px 8px', textIndent: '10px' }}>TOTAL BEBAN POKOK PENDAPATAN (HPP)</td>
                <td style={{ textAlign: 'right', padding: '4px 8px', fontFamily: 'Courier New, monospace', borderBottom: '1px solid #000', color: '#800000' }}>
                  ({formatNumber(totalCogs)})
                </td>
              </tr>

              {/* SECTION 3: LABA KOTOR */}
              <tr style={{ backgroundColor: '#e6f0fa', fontWeight: 'bold', fontSize: '12px' }}>
                <td colSpan={2} style={{ padding: '6px 8px' }}>LABA KOTOR USAHA (GROSS PROFIT)</td>
                <td style={{ textAlign: 'right', padding: '6px 8px', fontFamily: 'Courier New, monospace', borderBottom: '2px solid #000', color: 'var(--color-navy-blue)' }}>
                  {formatRupiah(grossProfit)}
                </td>
              </tr>

              {/* Space */}
              <tr><td colSpan={3} style={{ height: '10px' }}></td></tr>

              {/* SECTION 4: BEBAN OPERASIONAL */}
              <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                <td colSpan={2} style={{ padding: '6px 8px', borderBottom: '1px solid #000' }}>
                  III. BEBAN OPERASIONAL & UMUM
                </td>
                <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #000' }}></td>
              </tr>
              {opExpenseAccounts.map(acc => (
                <tr key={acc.code}>
                  <td style={{ padding: '3px 8px', color: '#666', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                  <td style={{ padding: '3px 8px' }}>{acc.name}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px', fontFamily: 'Courier New, monospace' }}>
                    {formatNumber(acc.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', borderTop: '1px solid #ccc' }}>
                <td colSpan={2} style={{ padding: '4px 8px', textIndent: '10px' }}>TOTAL BEBAN OPERASIONAL</td>
                <td style={{ textAlign: 'right', padding: '4px 8px', fontFamily: 'Courier New, monospace', borderBottom: '1px solid #000', color: '#800000' }}>
                  ({formatNumber(totalOpExpenses)})
                </td>
              </tr>

              {/* SECTION 5: LABA OPERASIONAL */}
              <tr style={{ backgroundColor: '#fdf8e2', fontWeight: 'bold' }}>
                <td colSpan={2} style={{ padding: '6px 8px' }}>LABA OPERASIONAL SEBELUM LAIN-LAIN</td>
                <td style={{ textAlign: 'right', padding: '6px 8px', fontFamily: 'Courier New, monospace', borderBottom: '1px solid #000' }}>
                  {formatRupiah(operatingProfit)}
                </td>
              </tr>

              {/* Space */}
              <tr><td colSpan={3} style={{ height: '10px' }}></td></tr>

              {/* SECTION 6: PENDAPATAN & BEBAN LAIN-LAIN */}
              <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                <td colSpan={2} style={{ padding: '6px 8px', borderBottom: '1px solid #000' }}>
                  IV. PENDAPATAN / (BEBAN) LAIN-LAIN
                </td>
                <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #000' }}></td>
              </tr>
              {otherRevenueAccounts.map(acc => (
                <tr key={acc.code}>
                  <td style={{ padding: '3px 8px', color: '#666', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                  <td style={{ padding: '3px 8px' }}>{acc.name}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px', fontFamily: 'Courier New, monospace' }}>
                    {formatNumber(acc.amount)}
                  </td>
                </tr>
              ))}
              {otherExpenseAccounts.map(acc => (
                <tr key={acc.code}>
                  <td style={{ padding: '3px 8px', color: '#666', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                  <td style={{ padding: '3px 8px' }}>{acc.name}</td>
                  <td style={{ textAlign: 'right', padding: '3px 8px', fontFamily: 'Courier New, monospace' }}>
                    ({formatNumber(acc.amount)})
                  </td>
                </tr>
              ))}

              {/* GRAND TOTAL: LABA BERSIH PERIODE BERJALAN */}
              <tr style={{ backgroundColor: '#dcfce7', fontWeight: 'bold', fontSize: '13px' }}>
                <td colSpan={2} style={{ padding: '8px', borderTop: '2px solid #000', borderBottom: '3px double #000' }}>
                  LABA BERSIH TAHUN BERJALAN (NET INCOME)
                </td>
                <td style={{ textAlign: 'right', padding: '8px', fontFamily: 'Courier New, monospace', borderTop: '2px solid #000', borderBottom: '3px double #000', color: '#166534', fontSize: '14px' }}>
                  {formatRupiah(netIncome)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
