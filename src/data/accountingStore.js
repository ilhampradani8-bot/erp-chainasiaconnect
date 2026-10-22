// Standard Indonesian Chart of Accounts (COA) SAK ETAP Template (Clean Slate)
export const INITIAL_ACCOUNTS = [
  // 1. ASET (AKTIVA)
  { code: '1-1001', name: 'Kas Kecil (Petty Cash)', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 0, description: 'Kas operasional harian kantor' },
  { code: '1-1002', name: 'Bank Mandiri Giro', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 0, description: 'Rekening operasional utama' },
  { code: '1-1003', name: 'Bank BCA Operasional', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 0, description: 'Rekening penerimaan pelanggan' },
  { code: '1-1004', name: 'Piutang Usaha (Trade Receivables)', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 0, description: 'Tagihan invoice ke klien' },
  { code: '1-1005', name: 'Perlengkapan Kantor (Supplies)', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 0, description: 'Alat tulis, kertas continuous, packaging' },
  { code: '1-1006', name: 'Uang Muka Sewa & Asuransi', category: 'ASET', subCategory: 'Aset Lancar', normalBalance: 'D', initialBalance: 0, description: 'Sewa dibayar di muka gedung kantor' },
  { code: '1-2001', name: 'Peralatan Komputer & Server', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'D', initialBalance: 0, description: 'Hardware IT dan jaringan' },
  { code: '1-2002', name: 'Akumulasi Penyusutan Peralatan', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'K', initialBalance: 0, description: 'Kontra akun penyusutan IT' },
  { code: '1-2003', name: 'Armada Truk & Kendaraan Box', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'D', initialBalance: 0, description: 'Armada distribusi dan logistik' },
  { code: '1-2004', name: 'Akumulasi Penyusutan Kendaraan', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'K', initialBalance: 0, description: 'Kontra akun penyusutan armada' },
  { code: '1-2005', name: 'Bangunan Fasilitas Pergudangan', category: 'ASET', subCategory: 'Aset Tetap', normalBalance: 'D', initialBalance: 0, description: 'Fasilitas hub transit logistik' },

  // 2. KEWAJIBAN (HUTANG)
  { code: '2-1001', name: 'Hutang Usaha (Trade Payables)', category: 'KEWAJIBAN', subCategory: 'Kewajiban Lancar', normalBalance: 'K', initialBalance: 0, description: 'Hutang vendor bahan bakar & operasional' },
  { code: '2-1002', name: 'Hutang Gaji & Upah Karyawan', category: 'KEWAJIBAN', subCategory: 'Kewajiban Lancar', normalBalance: 'K', initialBalance: 0, description: 'Gaji terutang periode berjalan' },
  { code: '2-1003', name: 'Hutang Pajak PPh 21 / 23 / PPN', category: 'KEWAJIBAN', subCategory: 'Kewajiban Lancar', normalBalance: 'K', initialBalance: 0, description: 'Pajak terutang ke kas negara' },
  { code: '2-1004', name: 'Pendapatan Diterima di Muka', category: 'KEWAJIBAN', subCategory: 'Kewajiban Lancar', normalBalance: 'K', initialBalance: 0, description: 'Deposit sewa/jasa dari klien' },
  { code: '2-2001', name: 'Hutang Bank Jangka Panjang', category: 'KEWAJIBAN', subCategory: 'Kewajiban Jangka Panjang', normalBalance: 'K', initialBalance: 0, description: 'Fasilitas kredit investasi perbankan' },

  // 3. EKUITAS (MODAL)
  { code: '3-1001', name: 'Modal Disetor Saham', category: 'EKUITAS', subCategory: 'Modal Saham', normalBalance: 'K', initialBalance: 0, description: 'Modal awal pendiri PT Chain Asia Connect' },
  { code: '3-1002', name: 'Laba Ditahan (Retained Earnings)', category: 'EKUITAS', subCategory: 'Laba Ditahan', normalBalance: 'K', initialBalance: 0, description: 'Akumulasi laba tahun-tahun sebelumnya' },

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

// Clean Slate: 0 initial journal transactions, ready for real business entries!
export const INITIAL_TRANSACTIONS = [];

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
  // Logo Settings
  showLogo: true,
  logoUrl: '',
  logoWidth: 70,
  // Signatory & TTD Settings
  showSignature: true,
  signatoryCity: 'Jakarta',
  signatoryDateMode: 'auto', // 'auto' (tanggal hari ini) or 'manual'
  signatoryCustomDate: '',
  signatoryName: 'Drs. H. Bambang Prakoso, Ak., M.M.',
  signatoryTitle: 'Financial Controller & Kepala Akuntansi',
  signatureImageUrl: '', // Optional scan ttd
  // Stamp / Cap Perusahaan Settings
  showStamp: true,
  stampText: 'PT. CHAIN ASIA CONNECT\nFINANCE VERIFIED',
  stampImageUrl: '', // Optional scan stempel
  stampColor: '#991b1b', // Red retro corporate seal
  // Footer
  documentFooterNote: 'Dokumen dicetak secara terkomputerisasi oleh ERP-ChainAsiaConnect v2.4 (Windows 90s Edition). Sah tanpa tanda tangan fisik bila divalidasi kode sistem.',
  showGridLines: true,
  showHeaderBorder: true
};
