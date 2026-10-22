import React from 'react';
import { formatRupiah, formatNumber } from '../utils/accountingMath';
import { Landmark, Printer, CheckCircle, AlertTriangle } from 'lucide-react';

export default function NeracaView({
  balanceSheetData,
  onPrint
}) {
  const {
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
  } = balanceSheetData;

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
            NERACA KEUANGAN (BALANCE SHEET / SHEET BALANCE)
          </div>
          <div style={{ fontSize: '11px', color: '#555' }}>
            PT. CHAIN ASIA CONNECT - Posisi Keuangan per 31 Oktober 2026 (Standar SAK ETAP)
          </div>
        </div>

        <button onClick={onPrint} className="btn-primary">
          <Printer size={12} />
          <span>Cetak Lembar Neraca</span>
        </button>
      </div>

      {/* 2. Balance Verification Banner */}
      <div style={{
        backgroundColor: isBalanced ? '#f0fdf4' : '#fef2f2',
        border: `2px inset ${isBalanced ? '#166534' : '#991b1b'}`,
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Landmark size={16} color={isBalanced ? '#166534' : '#991b1b'} />
          <span>
            <strong>PERSAMAAN DASAR AKUNTANSI:</strong> AKTIVA (Aset) = KEWAJIBAN (Hutang) + EKUITAS (Modal)
          </span>
        </div>

        <div>
          {isBalanced ? (
            <span style={{ color: '#166534', fontWeight: 'bold' }}>
              ✓ STATUS SEIMBANG: {formatRupiah(totalAssets)} = {formatRupiah(totalLiabilitiesAndEquity)}
            </span>
          ) : (
            <span style={{ color: '#991b1b', fontWeight: 'bold' }}>
              ⚠ SELISIH NERACA: Rp {difference.toLocaleString('id-ID')}
            </span>
          )}
        </div>
      </div>

      {/* 3. T-Account Dual Column Balance Sheet (Aktiva vs Pasiva) */}
      <div className="excel-table-container" style={{ flex: 1, padding: '12px', backgroundColor: '#ffffff', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* SISI KIRI: AKTIVA (ASET) */}
          <div style={{ border: '1px solid #000', padding: '8px' }}>
            <div style={{
              backgroundColor: 'var(--color-navy-blue)',
              color: '#fff',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '8px'
            }}>
              AKTIVA (ASSETS)
            </div>

            {/* Aset Lancar */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5px', borderBottom: '1px solid #808080', padding: '2px 0', marginBottom: '4px' }}>
              A. ASET LANCAR
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '8px' }}>
              <tbody>
                {currentAssets.map(acc => (
                  <tr key={acc.code}>
                    <td style={{ color: '#666', width: '65px', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                    <td>{acc.name}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(acc.amount)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: '600', borderTop: '1px solid #ccc' }}>
                  <td colSpan={2} style={{ padding: '3px 0' }}>Total Aset Lancar:</td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(totalCurrentAssets)}</td>
                </tr>
              </tbody>
            </table>

            {/* Aset Tetap */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5px', borderBottom: '1px solid #808080', padding: '2px 0', marginBottom: '4px' }}>
              B. ASET TETAP & INFRASTRUKTUR
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '12px' }}>
              <tbody>
                {fixedAssets.map(acc => (
                  <tr key={acc.code}>
                    <td style={{ color: '#666', width: '65px', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                    <td>{acc.name}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(acc.amount)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: '600', borderTop: '1px solid #ccc' }}>
                  <td colSpan={2} style={{ padding: '3px 0' }}>Total Nilai Buku Aset Tetap:</td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(totalFixedAssets)}</td>
                </tr>
              </tbody>
            </table>

            {/* TOTAL AKTIVA */}
            <div style={{
              backgroundColor: '#e6f0fa',
              borderTop: '2px solid #000',
              borderBottom: '3px double #000',
              padding: '6px 8px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '12.5px'
            }}>
              <span>JUMLAH TOTAL AKTIVA:</span>
              <span style={{ fontFamily: 'Courier New, monospace', color: 'var(--color-navy-blue)' }}>
                {formatRupiah(totalAssets)}
              </span>
            </div>
          </div>

          {/* SISI KANAN: PASIVA (KEWAJIBAN & EKUITAS) */}
          <div style={{ border: '1px solid #000', padding: '8px' }}>
            <div style={{
              backgroundColor: 'var(--color-navy-blue)',
              color: '#fff',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '8px'
            }}>
              PASIVA (LIABILITIES & EQUITY)
            </div>

            {/* Kewajiban Lancar */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5px', borderBottom: '1px solid #808080', padding: '2px 0', marginBottom: '4px' }}>
              A. KEWAJIBAN LANCAR (JANGKA PENDEK)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '6px' }}>
              <tbody>
                {currentLiabilities.map(acc => (
                  <tr key={acc.code}>
                    <td style={{ color: '#666', width: '65px', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                    <td>{acc.name}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(acc.amount)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: '600', borderTop: '1px solid #ccc' }}>
                  <td colSpan={2} style={{ padding: '3px 0' }}>Total Kewajiban Lancar:</td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(totalCurrentLiabilities)}</td>
                </tr>
              </tbody>
            </table>

            {/* Kewajiban Jangka Panjang */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5px', borderBottom: '1px solid #808080', padding: '2px 0', marginBottom: '4px' }}>
              B. KEWAJIBAN JANGKA PANJANG
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '6px' }}>
              <tbody>
                {longTermLiabilities.map(acc => (
                  <tr key={acc.code}>
                    <td style={{ color: '#666', width: '65px', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                    <td>{acc.name}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(acc.amount)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: '600', borderTop: '1px solid #ccc' }}>
                  <td colSpan={2} style={{ padding: '3px 0' }}>Total Kewajiban Jangka Panjang:</td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(totalLongTermLiabilities)}</td>
                </tr>
              </tbody>
            </table>

            {/* Subtotal Kewajiban */}
            <div style={{ backgroundColor: '#f5f5f5', padding: '3px 6px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px', marginBottom: '8px' }}>
              <span>Total Seluruh Kewajiban:</span>
              <span style={{ fontFamily: 'Courier New, monospace' }}>{formatNumber(totalLiabilities)}</span>
            </div>

            {/* Ekuitas / Modal */}
            <div style={{ fontWeight: 'bold', fontSize: '11.5px', borderBottom: '1px solid #808080', padding: '2px 0', marginBottom: '4px' }}>
              C. EKUITAS & MODAL
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '12px' }}>
              <tbody>
                {equityAccounts.map(acc => (
                  <tr key={acc.code}>
                    <td style={{ color: '#666', width: '65px', fontFamily: 'Courier New, monospace' }}>{acc.code}</td>
                    <td>{acc.name}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(acc.amount)}</td>
                  </tr>
                ))}
                {/* Laba Tahun Berjalan */}
                <tr style={{ backgroundColor: '#f0fdf4' }}>
                  <td style={{ color: '#166534', fontFamily: 'Courier New, monospace' }}>3-1099</td>
                  <td style={{ fontWeight: '600', color: '#166534' }}>Laba Bersih Tahun Berjalan (Net Income)</td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: 'bold', color: '#166534' }}>
                    {formatNumber(netIncomeThisYear)}
                  </td>
                </tr>
                <tr style={{ fontWeight: '600', borderTop: '1px solid #ccc' }}>
                  <td colSpan={2} style={{ padding: '3px 0' }}>Total Ekuitas & Laba:</td>
                  <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{formatNumber(totalEquity)}</td>
                </tr>
              </tbody>
            </table>

            {/* TOTAL PASIVA */}
            <div style={{
              backgroundColor: '#e6f0fa',
              borderTop: '2px solid #000',
              borderBottom: '3px double #000',
              padding: '6px 8px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '12.5px'
            }}>
              <span>JUMLAH TOTAL PASIVA:</span>
              <span style={{ fontFamily: 'Courier New, monospace', color: 'var(--color-navy-blue)' }}>
                {formatRupiah(totalLiabilitiesAndEquity)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
