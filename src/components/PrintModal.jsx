import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { formatRupiah, formatNumber } from '../utils/accountingMath';

export default function PrintModal({
  isOpen,
  onClose,
  paperSettings,
  activeView,
  incomeData,
  balanceSheetData,
  trialBalanceData,
  transactions,
  accounts
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ width: '850px', maxHeight: '95vh' }}>
        {/* Modal Title */}
        <div className="modal-header">
          <div className="modal-title">
            <span>🖨️ Pratinjau Dokumen Cetak (Print Preview) - {paperSettings.paperSize} ({paperSettings.orientation.toUpperCase()})</span>
          </div>
          <button className="win-ctrl-btn" onClick={onClose}>✕</button>
        </div>

        {/* Modal Toolbar */}
        <div style={{
          backgroundColor: 'var(--color-silver)',
          borderBottom: '1px solid var(--color-gray)',
          padding: '4px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '11px', display: 'flex', gap: '10px' }}>
            <span>Kertas: <strong>{paperSettings.paperSize}</strong></span>
            <span>Orientasi: <strong>{paperSettings.orientation}</strong></span>
            <span>Margin: <strong>{paperSettings.marginTop}mm / {paperSettings.marginLeft}mm</strong></span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handlePrint} className="btn-primary" style={{ padding: '3px 12px' }}>
              <Printer size={13} />
              <span>Cetak Sekarang (Print)</span>
            </button>
            <button onClick={onClose}>Tutup</button>
          </div>
        </div>

        {/* Printable Paper Canvas Area */}
        <div className="modal-body" style={{ backgroundColor: '#777777', padding: '16px', display: 'flex', justifyContent: 'center' }}>
          <div
            id="printable-area"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              width: paperSettings.paperSize === 'Roll80' ? '320px' : (paperSettings.orientation === 'landscape' ? '780px' : '620px'),
              minHeight: '600px',
              padding: `${paperSettings.marginTop}mm ${paperSettings.marginRight}mm ${paperSettings.marginBottom}mm ${paperSettings.marginLeft}mm`,
              boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
              fontFamily: paperSettings.fontFamily,
              fontSize: paperSettings.paperSize === 'Roll80' ? '9px' : '10.5px'
            }}
          >
            {/* Kop Surat Header */}
            <div style={{
              textAlign: 'center',
              borderBottom: paperSettings.showHeaderBorder ? '2px double #000000' : 'none',
              paddingBottom: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2px' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '24px', width: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />
                <div style={{ fontSize: paperSettings.paperSize === 'Roll80' ? '12px' : '16px', fontWeight: 'bold' }}>
                  {paperSettings.companyName}
                </div>
              </div>
              <div style={{ fontSize: '10px', color: '#444', fontStyle: 'italic' }}>
                {paperSettings.companyTagline}
              </div>
              <div style={{ fontSize: '9.5px', color: '#333' }}>
                {paperSettings.companyAddress}
              </div>
              <div style={{ fontSize: '9px', color: '#555' }}>
                {paperSettings.companyContact} | {paperSettings.companyNPWP}
              </div>
            </div>

            {/* Document Specific Body */}
            {activeView === 'labarugi' ? (
              <div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  LAPORAN LABA RUGI KOMPREHENSIF
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px', marginBottom: '12px', color: '#555' }}>
                  Periode Berakhir 31 Oktober 2026
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <tbody>
                    <tr style={{ fontWeight: 'bold', borderBottom: '1px solid #000' }}>
                      <td colSpan={2}>PENDAPATAN USAHA</td>
                      <td style={{ textAlign: 'right' }}>{formatRupiah(incomeData.totalRevenue)}</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', borderBottom: '1px solid #000' }}>
                      <td colSpan={2}>BEBAN POKOK PENDAPATAN (HPP)</td>
                      <td style={{ textAlign: 'right' }}>({formatRupiah(incomeData.totalCogs)})</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                      <td colSpan={2}>LABA KOTOR (GROSS PROFIT)</td>
                      <td style={{ textAlign: 'right' }}>{formatRupiah(incomeData.grossProfit)}</td>
                    </tr>
                    <tr><td colSpan={3} style={{ height: '6px' }}></td></tr>
                    <tr style={{ fontWeight: 'bold', borderBottom: '1px solid #000' }}>
                      <td colSpan={2}>BEBAN OPERASIONAL USAHA</td>
                      <td style={{ textAlign: 'right' }}>({formatRupiah(incomeData.totalOpExpenses)})</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                      <td colSpan={2}>LABA OPERASIONAL</td>
                      <td style={{ textAlign: 'right' }}>{formatRupiah(incomeData.operatingProfit)}</td>
                    </tr>
                    <tr><td colSpan={3} style={{ height: '6px' }}></td></tr>
                    <tr style={{ fontWeight: 'bold', borderTop: '2px solid #000', borderBottom: '3px double #000', fontSize: '11.5px' }}>
                      <td colSpan={2}>LABA BERSIH TAHUN BERJALAN</td>
                      <td style={{ textAlign: 'right', color: '#166534' }}>{formatRupiah(incomeData.netIncome)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : activeView === 'neraca' ? (
              <div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  NERACA KEUANGAN (BALANCE SHEET)
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px', marginBottom: '12px', color: '#555' }}>
                  Per Tanggal 31 Oktober 2026
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', borderBottom: '1px solid #000' }}>AKTIVA (ASET)</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                      <span>Aset Lancar:</span>
                      <span>{formatRupiah(balanceSheetData.totalCurrentAssets)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                      <span>Aset Tetap:</span>
                      <span>{formatRupiah(balanceSheetData.totalFixedAssets)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #000', borderBottom: '2px solid #000', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                      <span>TOTAL AKTIVA:</span>
                      <span>{formatRupiah(balanceSheetData.totalAssets)}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 'bold', borderBottom: '1px solid #000' }}>PASIVA (KEWAJIBAN & EKUITAS)</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                      <span>Kewajiban Lancar:</span>
                      <span>{formatRupiah(balanceSheetData.totalCurrentLiabilities)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                      <span>Kewajiban Jk Panjang:</span>
                      <span>{formatRupiah(balanceSheetData.totalLongTermLiabilities)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                      <span>Ekuitas & Laba:</span>
                      <span>{formatRupiah(balanceSheetData.totalEquity)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #000', borderBottom: '2px solid #000', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                      <span>TOTAL PASIVA:</span>
                      <span>{formatRupiah(balanceSheetData.totalLiabilitiesAndEquity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  NERACA SALDO & BUKTI AKUNTANSI
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px', marginBottom: '12px', color: '#555' }}>
                  Per Tanggal {todayStr}
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', backgroundColor: '#f0f0f0' }}>
                      <th style={{ textAlign: 'left', padding: '3px' }}>Kode</th>
                      <th style={{ textAlign: 'left', padding: '3px' }}>Nama Akun</th>
                      <th style={{ textAlign: 'right', padding: '3px' }}>Debit (Rp)</th>
                      <th style={{ textAlign: 'right', padding: '3px' }}>Kredit (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialBalanceData.rows.slice(0, 15).map(r => (
                      <tr key={r.account.code}>
                        <td style={{ padding: '2px 3px' }}>{r.account.code}</td>
                        <td style={{ padding: '2px 3px' }}>{r.account.name}</td>
                        <td style={{ textAlign: 'right', padding: '2px 3px' }}>{r.finalDebit > 0 ? formatNumber(r.finalDebit) : '-'}</td>
                        <td style={{ textAlign: 'right', padding: '2px 3px' }}>{r.finalCredit > 0 ? formatNumber(r.finalCredit) : '-'}</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '2px solid #000', borderBottom: '3px double #000', fontWeight: 'bold' }}>
                      <td colSpan={2} style={{ padding: '4px 3px' }}>TOTAL:</td>
                      <td style={{ textAlign: 'right', padding: '4px 3px' }}>{formatNumber(trialBalanceData.totalDebit)}</td>
                      <td style={{ textAlign: 'right', padding: '4px 3px' }}>{formatNumber(trialBalanceData.totalCredit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Signature Box */}
            {paperSettings.paperSize !== 'Roll80' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', padding: '0 10px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div>Disetujui Oleh,</div>
                  <div style={{ height: '40px' }}></div>
                  <div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Direktur Keuangan</div>
                  <div style={{ fontSize: '9px', color: '#555' }}>Manajemen PT Chain Asia Connect</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div>Jakarta, {todayStr}</div>
                  <div style={{ height: '40px' }}></div>
                  <div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{paperSettings.signatoryName}</div>
                  <div style={{ fontSize: '9px', color: '#555' }}>{paperSettings.signatoryTitle}</div>
                </div>
              </div>
            )}

            {/* Footer Legal Note */}
            <div style={{
              borderTop: '1px dashed #666',
              paddingTop: '6px',
              marginTop: '16px',
              fontSize: '8.5px',
              color: '#555',
              textAlign: 'center'
            }}>
              {paperSettings.documentFooterNote}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose}>Tutup Pratinjau</button>
          <button onClick={handlePrint} className="btn-primary" style={{ fontWeight: 'bold' }}>
            <Printer size={13} />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
