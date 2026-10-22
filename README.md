# ERP-ChainAsiaConnect (Windows 90s Accounting ERP Edition)

Sistem ERP Akuntansi Komprehensif dengan tema **Retro Windows 90s Abu (Classic OS Style)** dibangun menggunakan **Astro** yang ultra-cepat dan dirancang siap untuk di-hosting langsung di **Vercel**.

Repository: `https://github.com/ilhampradani8-bot/erp-chainasiaconnect.git`

---

## 🖥️ Karakteristik Desain (Mengacu pada `ui.md`)
- **Gaya Utama:** Classic Windows 95/98 Grey (`#cccccc`) dengan panel bevel 3D timbul (outset) dan cekung (inset).
- **Desktop Background:** Teal Klasik (`#008080`).
- **Title Bar Jendela:** Navy Blue (`#00007c`) dengan tombol minimize (`_`), maximize (`□`), dan close (`✕`).
- **Border Radius:** `0px` (Strictly Rectangular, tanpa sudut melengkung modern).
- **Typography:** `MS Sans Serif`, `Tahoma`, `Segoe UI`, tanpa tulisan bold tebal berlebihan.
- **Layout Desktop Software:** Tampilan *fullwidth* dan *full-viewport height* (100vw, 100vh) seperti software desktop akuntansi native (MYOB / Accurate v1 / DacEasy).
- **Sidebar Kiri & Kanan:**
  - **Sidebar Kiri:** Modul navigasi akuntansi (Dashboard, Jurnal Umum, Buku Besar, Neraca Saldo, Laba Rugi, Neraca, Pengaturan Bagan Akun, Pengaturan Kertas, Database) serta panel pemantau likuiditas Kas & Bank secara real-time.
  - **Sidebar Kanan:** Kalkulator interaktif Windows 95, panel audit status keseimbangan neraca (Debit vs Kredit), preset cepat ukuran kertas (A4, Letter, Kasir 80mm), dan papan coretan akuntan (*scratchpad*) otomatis tersimpan.
  - **Taskbar Bawah:** Tombol `[ ⊞ Start ]` dengan pop-up menu, jendela aktif, status database SAK ETAP, indikator balance neraca, dan jam digital real-time.

---

## 💼 Fitur Modul Akuntansi (SAK ETAP Indonesia)
1. **📊 Dashboard Grafik Finansial:**
   - Kartu metrik KPI: Pendapatan Usaha, Beban & HPP, Laba Bersih Periode Berjalan, Total Aktiva.
   - Grafik SVG retro: Distribusi pos beban & pendapatan, serta tren laba rugi bulanan.
   - Ringkasan voucher transaksi jurnal terkini.
2. **📑 Jurnal Umum (General Journal):**
   - Pembukuan berpasangan (*Double-Entry Bookkeeping*).
   - Filter rentang tanggal dan pencarian nomor voucher / referensi invoice.
   - Modal entri transaksi baru dengan validasi otomatis Debit = Kredit.
3. **📖 Buku Besar (General Ledger):**
   - Pemilihan akun perkiraan buku besar.
   - Perhitungan saldo awal, mutasi debit/kredit, dan *running balance* (saldo berjalan).
4. **⚖️ Neraca Saldo (Trial Balance):**
   - Rekapitulasi seluruh akun perkiraan dengan verifikasi keseimbangan total debit dan total kredit.
5. **📈 Laporan Laba Rugi (Income Statement):**
   - Format multi-step standar: Pendapatan Usaha, HPP, Laba Kotor, Beban Operasional, Laba Operasional, Pendapatan/Beban Lain, dan Laba Bersih Tahun Berjalan.
6. **🏛️ Neraca Keuangan (Balance Sheet / Sheet Balance):**
   - Format T-Account dua kolom: AKTIVA (Aset Lancar & Aset Tetap) vs PASIVA (Kewajiban Lancar, Kewajiban Jangka Panjang, dan Ekuitas Modal + Laba Tahun Berjalan).
   - Verifikasi matematis Aktiva = Pasiva.
7. **🗂️ Pengaturan Bagan Akun (Chart of Accounts - COA):**
   - Tambah akun baru, ubah nama/saldo, dan hapus akun.
   - Pengelompokan kategori 1 s/d 9 (Aset, Kewajiban, Ekuitas, Pendapatan, HPP, Beban).
   - Ekspor bagan akun ke format CSV.
8. **🖨️ Pengaturan Kertas & Kop Surat (Page & Letterhead Setup):**
   - Pilihan ukuran kertas: **A4**, **Letter**, **Folio / F4**, **A5**, hingga **Kertas Kasir Continuous Roll 80mm**.
   - Orientasi Portrait & Landscape.
   - Margin atas, bawah, kiri, kanan (mm).
   - Pengaturan Kop Surat Resmi (Nama PT, Tagline, Alamat, Kontak, NPWP, Logo, dan Pejabat Penandatangan).
   - Pratinjau simulasi lembar kertas interaktif di layar (*Live Paper Simulation*).
   - Tombol Print Preview resmi yang siap dicetak ke printer fisik atau simpan PDF (`Ctrl+P` / `window.print()`).
9. **💾 Cadangan Database & Pemulihan:**
   - Ekspor database ke file `.json`.
   - Impor & restore database dari file `.json`.
   - Reset ke data awal standar.

---

## 🚀 Menjalankan Secara Lokal & Hosting di Vercel

### 1. Jalankan di Lingkungan Lokal
```bash
# Instal dependensi
npm install

# Jalankan server pengembangan lokal (Astro)
npm run dev

# Kompilasi build produksi
npm run build
```

### 2. Deployment ke Vercel
Proyek telah dilengkapi dengan berkas `vercel.json`:
- **Framework Preset:** Astro
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Tinggal import repository GitHub `https://github.com/ilhampradani8-bot/erp-chainasiaconnect.git` di dashboard Vercel, lalu klik **Deploy**!
