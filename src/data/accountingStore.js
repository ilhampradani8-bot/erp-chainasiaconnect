// Initial Chart of Accounts (COA) SAK ETAP
export const INITIAL_ACCOUNTS = [
  // 1. ASET (AKTIVA)
  { code: '1-1001', name: 'Kas Kecil (Petty Cash)', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 15000000, description: 'Kas operasional harian kantor' },
  { code: '1-1002', name: 'Bank Mandiri Giro', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 245000000, description: 'Rekening operasional utama' },
  { code: '1-1003', name: 'Bank BCA Operasional', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 180000000, description: 'Rekening penerimaan pelanggan' },
  { code: '1-1004', name: 'Piutang Usaha (Trade Receivables)', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 85000000, description: 'Tagihan invoice ke klien ekspedisi' },
  { code: '1-1005', name: 'Perlengkapan Kantor (Supplies)', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 12500000, description: 'Alat tulis, kertas continuous, packaging' },
  { code: '1-1006', name: 'Uang Muka Sewa & Asuransi', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 36000000, description: 'Sewa dibayar di muka gedung kantor' },
  { code: '1-2001', name: 'Peralatan Komputer & Server', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'D', initialBalance: 75000000, description: 'Hardware IT dan jaringan logistik' },
  { code: '1-2002', name: 'Akumulasi Penyusutan Peralatan', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'K', initialBalance: 15000000, description: 'Kontra akun penyusutan IT' },
  { code: '1-2003', name: 'Armada Truk & Kendaraan Box', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'D', initialBalance: 420000000, description: 'Armada distribusi dan logistik' },
  { code: '1-2004', name: 'Akumulasi Penyusutan Kendaraan', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'K', initialBalance: 60000000, description: 'Kontra akun penyusutan armada' },
  { code: '1-2005', name: 'Bangunan Fasilitas Pergudangan', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'D', initialBalance: 650000000, description: 'Fasilitas hub transit logistik' },

  // 2. KEWAJIBAN (HUTANG)
  { code: '2-1001', name: 'Hutang Usaha (Trade Payables)', category: 'KEWAJIBAN', subCategory: 'Kewajiban Lancar', normalBalance: 'K', initialBalance: 78000000, description: 'Hutang vendor bahan bakar & freight' },
  { code: '2-1002', name: 'Hutang Gaji & Upah Driver', category: 'KEWAJIBAN', subCategory: 'Kewajiban Lancar', normalBalance: 'K', initialBalance: 24000000, description: 'Gaji terutang periode berjalan' },
  { code: '2-1003', name: 'Hutang Pajak PPh 21 / 23 / PPN', category: 'KEWAJIBAN', subCategory: 'Kewajiban Lancar', normalBalance: 'K', initialBalance: 18500000, description: 'Pajak terutang ke kas negara' },
  { code: '2-1004', name: 'Pendapatan Diterima di Muka', category: 'KEWAJIBAN', subCategory: 'Kewajiban Lancar', normalBalance: 'K', initialBalance: 45000000, description: 'Deposit sewa gudang dari klien' },
  { code: '2-2001', name: 'Hutang Bank Jangka Panjang (Mandiri)', category: 'KEWAJIBAN', subCategory: 'Kewajiban Jangka Panjang', normalBalance: 'K', initialBalance: 280000000, description: 'Fasilitas kredit investasi armada' },

  // 3. EKUITAS (MODAL)
  { code: '3-1001', name: 'Modal Disetor Saham', category: 'EKUITAS', subCategory: 'Modal Saham', normalBalance: 'K', initialBalance: 1000000000, description: 'Modal awal pendiri PT Chain Asia Connect' },
  { code: '3-1002', name: 'Laba Ditahan (Retained Earnings)', category: 'EKUITAS', subCategory: 'Laba Ditahan', normalBalance: 'K', initialBalance: 192000000, description: 'Akumulasi laba tahun-tahun sebelumnya' },

  // 4. PENDAPATAN
  { code: '4-1001', name: 'Pendapatan Freight & Logistik Antarpulau', category: 'PENDAPATAN', subCategory: 'Pendapatan Operasional', normalBalance: 'K', initialBalance: 0, description: 'Jasa angkut barang cargo' },
  { code: '4-1002', name: 'Pendapatan Sewa Gudang & Fulfilment', category: 'PENDAPATAN', subCategory: 'Pendapatan Operasional', normalBalance: 'K', initialBalance: 0, description: 'Layanan gudang cross-docking' },
  { code: '4-1003', name: 'Pendapatan Ekspedisi Port-to-Port', category: 'PENDAPATAN', subCategory: 'Pendapatan Operasional', normalBalance: 'K', initialBalance: 0, description: 'Jasa kepabeanan dan handling' },

  // 5. HPP / BEBAN POKOK
  { code: '5-1001', name: 'Beban BBM Armada & Tol Trans Jawa', category: 'HPP', subCategory: 'Beban Pokok Pendapatan', normalBalance: 'D', initialBalance: 0, description: 'Solar industri, e-toll distribusi' },
  { code: '5-1002', name: 'Beban Freight Kapal & Kontainer', category: 'HPP', subCategory: 'Beban Pokok Pendapatan', normalBalance: 'D', initialBalance: 0, description: 'Biaya pelayaran kargo laut' },
  { code: '5-1003', name: 'Beban Buruh Bongkar Muat & Port Fee', category: 'HPP', subCategory: 'Beban Pokok Pendapatan', normalBalance: 'D', initialBalance: 0, description: 'Tenaga kerja lapangan harian' },

  // 6. BEBAN OPERASIONAL
  { code: '6-1001', name: 'Beban Gaji Staf Kantor & Manajemen', category: 'BEBAN', subCategory: 'Beban Operasional', normalBalance: 'D', initialBalance: 0, description: 'Gaji tetap bulanan manajemen' },
  { code: '6-1002', name: 'Beban Listrik, Internet & Telepon', category: 'BEBAN', subCategory: 'Beban Operasional', normalBalance: 'D', initialBalance: 0, description: 'PLN kantor pusat & server hosting' },
  { code: '6-1003', name: 'Beban Pemeliharaan Armada & Servis', category: 'BEBAN', subCategory: 'Beban Operasional', normalBalance: 'D', initialBalance: 0, description: 'Oli, ban, perawatan rutin truk' },
  { code: '6-1004', name: 'Beban Pemasaran & Representasi Klien', category: 'BEBAN', subCategory: 'Beban Operasional', normalBalance: 'D', initialBalance: 0, description: 'Tender logistik dan promosi' },
  { code: '6-1005', name: 'Beban Penyusutan Kendaraan & Aset', category: 'BEBAN', subCategory: 'Beban Operasional', normalBalance: 'D', initialBalance: 0, description: 'Amortisasi dan depresiasi bulanan' },

  // 8 & 9. PENDAPATAN & BEBAN LAIN-LAIN
  { code: '8-1001', name: 'Pendapatan Bunga Jasa Giro', category: 'PENDAPATAN_LAIN', subCategory: 'Lain-lain', normalBalance: 'K', initialBalance: 0, description: 'Bunga bank tabungan/giro' },
  { code: '9-1001', name: 'Beban Administrasi Bank & Pajak Bunga', category: 'BEBAN_LAIN', subCategory: 'Lain-lain', normalBalance: 'D', initialBalance: 0, description: 'Biaya transfer RTGS/SKN bank' },
];

// Sample Initial Journal Entries (Double-Entry Bookkeeping)
export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-001',
    voucherNo: 'BKM-2610-001',
    date: '2026-10-02',
    description: 'Penerimaan pelunasan tagihan jasa kargo dari PT Samudera Perkasa',
    reference: 'INV-2026-089',
    lines: [
      { accountCode: '1-1002', debit: 65000000, credit: 0, memo: 'Masuk Bank Mandiri Giro' },
      { accountCode: '1-1004', debit: 0, credit: 65000000, memo: 'Pelunasan piutang usaha' }
    ]
  },
  {
    id: 'tx-002',
    voucherNo: 'BKK-2610-002',
    date: '2026-10-04',
    description: 'Pembayaran tagihan solar industri dan e-toll armada batch 1 Oktober',
    reference: 'PO-SOLAR-091',
    lines: [
      { accountCode: '5-1001', debit: 18500000, credit: 0, memo: 'Beban BBM & Tol armada ekspedisi' },
      { accountCode: '1-1003', debit: 0, credit: 18500000, memo: 'Transfer via Bank BCA Operasional' }
    ]
  },
  {
    id: 'tx-003',
    voucherNo: 'JV-2610-003',
    date: '2026-10-07',
    description: 'Pendapatan invoice jasa ekspedisi rute Jakarta - Surabaya 12 Kontainer',
    reference: 'INV-2026-090',
    lines: [
      { accountCode: '1-1004', debit: 110000000, credit: 0, memo: 'Piutang PT Global Logistics Nusantara' },
      { accountCode: '4-1001', debit: 0, credit: 110000000, memo: 'Pendapatan logistik antarpulau' }
    ]
  },
  {
    id: 'tx-004',
    voucherNo: 'BKK-2610-004',
    date: '2026-10-10',
    description: 'Pembayaran freight kapal pelayaran kontainer Meratus Lines',
    reference: 'BL-MRT-772',
    lines: [
      { accountCode: '5-1002', debit: 42000000, credit: 0, memo: 'Biaya kargo pelayaran laut' },
      { accountCode: '1-1002', debit: 0, credit: 42000000, memo: 'Debit Bank Mandiri' }
    ]
  },
  {
    id: 'tx-005',
    voucherNo: 'BKM-2610-005',
    date: '2026-10-14',
    description: 'Penerimaan sewa gudang transit dan fulfilment kuartal IV dari CV Berkah Pangan',
    reference: 'KTR-GUD-441',
    lines: [
      { accountCode: '1-1003', debit: 38000000, credit: 0, memo: 'Penerimaan transfer Bank BCA' },
      { accountCode: '4-1002', debit: 0, credit: 38000000, memo: 'Pendapatan sewa gudang & fulfilment' }
    ]
  },
  {
    id: 'tx-006',
    voucherNo: 'BKK-2610-006',
    date: '2026-10-18',
    description: 'Biaya servis berkala armada truk fuso & pergantian oli mesin di bengkel resmi',
    reference: 'SPK-SRV-019',
    lines: [
      { accountCode: '6-1003', debit: 7800000, credit: 0, memo: 'Beban pemeliharaan & servis armada' },
      { accountCode: '1-1001', debit: 0, credit: 7800000, memo: 'Kas kecil kasir kantor' }
    ]
  },
  {
    id: 'tx-007',
    voucherNo: 'BKK-2610-007',
    date: '2026-10-20',
    description: 'Pembayaran tagihan listrik PLN gardu gudang dan koneksi internet dedicated',
    reference: 'PLN-TEL-1026',
    lines: [
      { accountCode: '6-1002', debit: 6400000, credit: 0, memo: 'Beban utilitas listrik & internet' },
      { accountCode: '1-1003', debit: 0, credit: 6400000, memo: 'Pembayaran auto-debit Bank BCA' }
    ]
  },
  {
    id: 'tx-008',
    voucherNo: 'JV-2610-008',
    date: '2026-10-22',
    description: 'Penerimaan pendapatan ekspedisi port-to-port dan bea handling impor',
    reference: 'INV-2026-095',
    lines: [
      { accountCode: '1-1002', debit: 54000000, credit: 0, memo: 'Transfer Bank Mandiri Giro' },
      { accountCode: '4-1003', debit: 0, credit: 54000000, memo: 'Pendapatan handling & port-to-port' }
    ]
  }
];

// Default Paper Settings for Printing Reports
export const DEFAULT_PAPER_SETTINGS = {
  paperSize: 'A4', // A4, Letter, Folio, Roll80
  orientation: 'portrait', // portrait, landscape
  marginTop: 15, // mm
  marginBottom: 15,
  marginLeft: 15,
  marginRight: 15,
  fontSize: '11px',
  fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
  // Letterhead / Kop Surat
  companyName: 'PT. CHAIN ASIA CONNECT',
  companyTagline: 'Integrated Logistics, Supply Chain & Freight Forwarding ERP Solution',
  companyAddress: 'Gedung Menara Asia Pasifik Lt. 12, Jl. Jend. Sudirman Kav. 45, Jakarta Pusat 10210',
  companyContact: 'Telp: (021) 5890-2345 | Fax: (021) 5890-2346 | Email: finance@chainasiaconnect.com',
  companyNPWP: 'NPWP: 01.345.678.9-021.000',
  signatoryName: 'Drs. H. Bambang Prakoso, Ak., M.M.',
  signatoryTitle: 'Financial Controller & Kepala Akuntansi',
  documentFooterNote: 'Dokumen dicetak secara terkomputerisasi oleh ERP-ChainAsiaConnect v2.4 (Windows 90s Edition). Sah tanpa tanda tangan fisik bila divalidasi kode sistem.',
  showGridLines: true,
  showHeaderBorder: true
};
