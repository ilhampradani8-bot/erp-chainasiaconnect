import React, { useState } from 'react';
import { Sliders, Printer, Save, RotateCcw, Eye, FileText, Check } from 'lucide-react';
import { DEFAULT_PAPER_SETTINGS } from '../data/accountingStore';

export default function PengaturanKertasView({
  paperSettings,
  setPaperSettings,
  onPrintPreview
}) {
  const [formData, setFormData] = useState({ ...paperSettings });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setPaperSettings(formData);
    localStorage.setItem('erp_paper_settings', JSON.stringify(formData));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Kembalikan pengaturan kertas dan kop surat ke standar default?')) {
      setFormData({ ...DEFAULT_PAPER_SETTINGS });
      setPaperSettings({ ...DEFAULT_PAPER_SETTINGS });
      localStorage.setItem('erp_paper_settings', JSON.stringify(DEFAULT_PAPER_SETTINGS));
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    }
  };

  // Dimensions for simulation
  const getSimDimensions = () => {
    if (formData.paperSize === 'Roll80') {
      return { width: '300px', minHeight: '480px' };
    }
    if (formData.orientation === 'landscape') {
      return { width: '560px', minHeight: '390px' };
    }
    return { width: '420px', minHeight: '560px' };
  };

  const simDim = getSimDimensions();

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', overflowY: 'auto' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={15} color="var(--color-navy-blue)" />
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
            PENGATURAN KERTAS CETAK (PAGE SETUP) & KOP SURAT PERUSAHAAN
          </span>
          {savedNotice && (
            <span style={{ backgroundColor: '#bbf7d0', color: '#166534', padding: '1px 6px', fontSize: '11px', border: '1px solid #166534', fontWeight: 'bold' }}>
              ✓ Pengaturan Berhasil Disimpan!
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={handleReset}>
            <RotateCcw size={12} />
            <span>Reset Standar</span>
          </button>
          <button onClick={onPrintPreview} className="btn-primary">
            <Printer size={12} />
            <span>Uji Cetak Sample</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Setup: Left Form Settings & Right Live Paper Simulation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '10px' }}>
        {/* Form Settings Left */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* A. Paper Format & Margins */}
          <fieldset className="win-fieldset">
            <legend>Format Ukuran Kertas & Margin Cetak</legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Ukuran Kertas (Paper Size):</label>
                <select
                  value={formData.paperSize}
                  onChange={(e) => handleChange('paperSize', e.target.value)}
                  style={{ width: '100%', fontWeight: '500' }}
                >
                  <option value="A4">A4 (210 x 297 mm) - Standar Akuntansi</option>
                  <option value="Letter">Letter (8.5 x 11 inch / 216 x 279 mm)</option>
                  <option value="Folio">Folio / F4 (215 x 330 mm)</option>
                  <option value="A5">A5 (148 x 210 mm) - Nota Ringkas</option>
                  <option value="Roll80">Kertas Kasir Continuous Roll (80mm Struk)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Orientasi Cetak:</label>
                <select
                  value={formData.orientation}
                  onChange={(e) => handleChange('orientation', e.target.value)}
                  style={{ width: '100%', fontWeight: '500' }}
                >
                  <option value="portrait">Tegak (Portrait)</option>
                  <option value="landscape">Melebar (Landscape)</option>
                </select>
              </div>
            </div>

            {/* Margins */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px' }}>Margin Atas (mm):</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.marginTop}
                  onChange={(e) => handleChange('marginTop', Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px' }}>Margin Bawah (mm):</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.marginBottom}
                  onChange={(e) => handleChange('marginBottom', Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px' }}>Margin Kiri (mm):</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.marginLeft}
                  onChange={(e) => handleChange('marginLeft', Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px' }}>Margin Kanan (mm):</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.marginRight}
                  onChange={(e) => handleChange('marginRight', Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </fieldset>

          {/* B. Company Letterhead (Kop Surat) */}
          <fieldset className="win-fieldset">
            <legend>Informasi Kop Surat Resmi (Letterhead)</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>Nama Perusahaan / PT:</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  style={{ width: '100%', fontWeight: 'bold' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>Tagline / Bidang Usaha:</label>
                <input
                  type="text"
                  value={formData.companyTagline}
                  onChange={(e) => handleChange('companyTagline', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>Alamat Kantor Pusat:</label>
                <input
                  type="text"
                  value={formData.companyAddress}
                  onChange={(e) => handleChange('companyAddress', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>Kontak (Telepon & Email):</label>
                  <input
                    type="text"
                    value={formData.companyContact}
                    onChange={(e) => handleChange('companyContact', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>Nomor Pokok Wajib Pajak (NPWP):</label>
                  <input
                    type="text"
                    value={formData.companyNPWP}
                    onChange={(e) => handleChange('companyNPWP', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* C. Signatory & Footer */}
          <fieldset className="win-fieldset">
            <legend>Penandatangan & Catatan Kaki Dokumen</legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>Nama Penandatangan:</label>
                <input
                  type="text"
                  value={formData.signatoryName}
                  onChange={(e) => handleChange('signatoryName', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>Jabatan Resmi:</label>
                <input
                  type="text"
                  value={formData.signatoryTitle}
                  onChange={(e) => handleChange('signatoryTitle', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>Catatan Kaki Dokumen (Footer Legal):</label>
              <textarea
                value={formData.documentFooterNote}
                onChange={(e) => handleChange('documentFooterNote', e.target.value)}
                style={{ width: '100%', height: '40px' }}
              />
            </div>
          </fieldset>

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '6px 20px', fontWeight: 'bold' }}>
              <Save size={13} />
              <span>Simpan Pengaturan Kertas</span>
            </button>
          </div>
        </form>

        {/* Live Simulation Preview Right */}
        <div style={{
          backgroundColor: '#808080',
          border: '2px inset #000',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          maxHeight: '620px'
        }}>
          <div style={{
            color: '#fff',
            fontSize: '11px',
            marginBottom: '8px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            [ SIMULASI TAMPILAN LEMBAR KERTAS: {formData.paperSize} ({formData.orientation.toUpperCase()}) ]
          </div>

          {/* Virtual Paper Sheet */}
          <div style={{
            ...simDim,
            backgroundColor: '#ffffff',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.5)',
            border: '1px solid #333',
            padding: `${formData.marginTop / 1.5}px ${formData.marginRight / 1.5}px ${formData.marginBottom / 1.5}px ${formData.marginLeft / 1.5}px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: formData.paperSize === 'Roll80' ? '9px' : '10px',
            color: '#000',
            fontFamily: formData.fontFamily
          }}>
            {/* Kop Surat Live Preview */}
            <div>
              <div style={{
                textAlign: 'center',
                borderBottom: formData.showHeaderBorder ? '2px double #000' : 'none',
                paddingBottom: '6px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2px' }}>
                  <img src="/logo.png" alt="Logo" style={{ height: '22px', width: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  <div style={{ fontSize: formData.paperSize === 'Roll80' ? '11px' : '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {formData.companyName}
                  </div>
                </div>
                <div style={{ fontSize: formData.paperSize === 'Roll80' ? '9px' : '10px', color: '#333', fontStyle: 'italic' }}>
                  {formData.companyTagline}
                </div>
                <div style={{ fontSize: formData.paperSize === 'Roll80' ? '8px' : '9.5px', color: '#444' }}>
                  {formData.companyAddress}
                </div>
                <div style={{ fontSize: formData.paperSize === 'Roll80' ? '8px' : '9px', color: '#555' }}>
                  {formData.companyContact} | {formData.companyNPWP}
                </div>
              </div>

              {/* Sample Content Table */}
              <div style={{ textAlign: 'center', fontWeight: 'bold', margin: '4px 0', fontSize: '10.5px' }}>
                BUKTI JURNAL & NERACA RINGKAS
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', margin: '6px 0' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', backgroundColor: '#f0f0f0' }}>
                    <th style={{ textAlign: 'left', padding: '2px 4px' }}>Akun</th>
                    <th style={{ textAlign: 'right', padding: '2px 4px' }}>Debit</th>
                    <th style={{ textAlign: 'right', padding: '2px 4px' }}>Kredit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '2px 4px' }}>1-1002 Bank Mandiri Giro</td>
                    <td style={{ textAlign: 'right', padding: '2px 4px' }}>65.000.000</td>
                    <td style={{ textAlign: 'right', padding: '2px 4px' }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 4px', paddingLeft: '12px' }}>1-1004 Piutang Usaha</td>
                    <td style={{ textAlign: 'right', padding: '2px 4px' }}>-</td>
                    <td style={{ textAlign: 'right', padding: '2px 4px' }}>65.000.000</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid #000', fontWeight: 'bold' }}>
                    <td style={{ padding: '2px 4px' }}>TOTAL (SEIMBANG):</td>
                    <td style={{ textAlign: 'right', padding: '2px 4px' }}>65.000.000</td>
                    <td style={{ textAlign: 'right', padding: '2px 4px' }}>65.000.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Signatures & Footer Note */}
            <div>
              {formData.paperSize !== 'Roll80' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '0 10px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div>Disetujui Oleh,</div>
                    <div style={{ height: '35px' }}></div>
                    <div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Direktur Operasional</div>
                    <div style={{ fontSize: '8.5px', color: '#555' }}>Manajemen Pusat</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div>Jakarta, 22 Oktober 2026</div>
                    <div style={{ height: '35px' }}></div>
                    <div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{formData.signatoryName}</div>
                    <div style={{ fontSize: '8.5px', color: '#555' }}>{formData.signatoryTitle}</div>
                  </div>
                </div>
              )}

              <div style={{
                borderTop: '1px dashed #888',
                paddingTop: '4px',
                marginTop: '8px',
                fontSize: '8px',
                color: '#666',
                textAlign: 'center'
              }}>
                {formData.documentFooterNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
