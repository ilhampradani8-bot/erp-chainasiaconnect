import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, Search, Check, X, Download } from 'lucide-react';
import { formatRupiah, formatNumber } from '../utils/accountingMath';

export default function BaganAkunView({
  accounts,
  setAccounts,
  transactions,
  onSaveAccount,
  onDeleteAccount
}) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('ASET');
  const [subCategory, setSubCategory] = useState('Aset Lancar');
  const [normalBalance, setNormalBalance] = useState('D');
  const [initialBalance, setInitialBalance] = useState('0');
  const [description, setDescription] = useState('');

  const filtered = accounts.filter(acc => {
    const matchCat = filterCat === 'ALL' || acc.category === filterCat;
    const matchSearch =
      acc.code.toLowerCase().includes(search.toLowerCase()) ||
      acc.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setCode('');
    setName('');
    setCategory('ASET');
    setSubCategory('Aset Lancar');
    setNormalBalance('D');
    setInitialBalance('0');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setCode(acc.code);
    setName(acc.name);
    setCategory(acc.category);
    setSubCategory(acc.subCategory || '');
    setNormalBalance(acc.normalBalance);
    setInitialBalance(String(acc.initialBalance || 0));
    setDescription(acc.description || '');
    setIsModalOpen(true);
  };

  const handleDelete = (acc) => {
    // Check if account has transactions
    const hasTx = transactions.some(tx => tx.lines.some(l => l.accountCode === acc.code));
    if (hasTx) {
      alert(`Akun "${acc.code} - ${acc.name}" tidak dapat dihapus karena telah memiliki mutasi transaksi jurnal! Silakan hapus jurnal terkait terlebih dahulu.`);
      return;
    }

    if (confirm(`Hapus akun perkiraan "${acc.code} - ${acc.name}" dari Bagan Akun?`)) {
      const updated = accounts.filter(a => a.code !== acc.code);
      setAccounts(updated);
      localStorage.setItem('erp_accounts', JSON.stringify(updated));
      if (onDeleteAccount) onDeleteAccount(acc.code);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      alert('Kode Akun dan Nama Akun wajib diisi!');
      return;
    }

    if (!editingAccount) {
      // Check duplicate code
      if (accounts.some(a => a.code.toLowerCase() === code.trim().toLowerCase())) {
        alert(`Kode Akun "${code}" sudah terdaftar! Gunakan kode akun lain.`);
        return;
      }

      const newAcc = {
        code: code.trim(),
        name: name.trim(),
        category,
        subCategory,
        normalBalance,
        initialBalance: parseFloat(initialBalance) || 0,
        description: description.trim()
      };
      const updated = [...accounts, newAcc].sort((a, b) => a.code.localeCompare(b.code));
      setAccounts(updated);
      localStorage.setItem('erp_accounts', JSON.stringify(updated));
      if (onSaveAccount) onSaveAccount(newAcc);
    } else {
      // Update existing
      const editedAcc = {
        code: editingAccount.code,
        name: name.trim(),
        category,
        subCategory,
        normalBalance,
        initialBalance: parseFloat(initialBalance) || 0,
        description: description.trim()
      };
      const updated = accounts.map(a => a.code === editingAccount.code ? editedAcc : a);
      setAccounts(updated);
      localStorage.setItem('erp_accounts', JSON.stringify(updated));
      if (onSaveAccount) onSaveAccount(editedAcc);
    }

    setIsModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['Kode Akun', 'Nama Akun', 'Kategori', 'Sub Kategori', 'Saldo Normal', 'Saldo Awal (Rp)', 'Keterangan'];
    const rows = accounts.map(a => [
      `"${a.code}"`,
      `"${a.name}"`,
      `"${a.category}"`,
      `"${a.subCategory || ''}"`,
      `"${a.normalBalance}"`,
      a.initialBalance || 0,
      `"${a.description || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bagan_Akun_COA_ChainAsia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      {/* 1. Header Toolbar */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '2px solid',
        borderColor: 'var(--color-platinum) var(--color-black) var(--color-black) var(--color-platinum)',
        padding: '6px 10px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleOpenAdd} className="btn-primary" style={{ padding: '4px 12px' }}>
            <Plus size={13} color="#00007c" />
            <span>+ Tambah Akun Baru (COA)</span>
          </button>

          <button onClick={handleExportCsv} title="Ekspor daftar akun ke spreadsheet CSV">
            <Download size={12} />
            <span>Ekspor CSV</span>
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-gray)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
            <span>Filter Kategori:</span>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              style={{ padding: '2px 6px' }}
            >
              <option value="ALL">Semua Kategori</option>
              <option value="ASET">1 - Aset</option>
              <option value="KEWAJIBAN">2 - Kewajiban</option>
              <option value="EKUITAS">3 - Ekuitas</option>
              <option value="PENDAPATAN">4 - Pendapatan</option>
              <option value="HPP">5 - HPP</option>
              <option value="BEBAN">6 - Beban Operasional</option>
              <option value="PENDAPATAN_LAIN">8 - Pendapatan Lain</option>
              <option value="BEBAN_LAIN">9 - Beban Lain</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={13} color="#555" />
          <input
            type="search"
            placeholder="Cari kode atau nama akun..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '220px', padding: '3px 6px' }}
          />
        </div>
      </div>

      {/* 2. Spreadsheet Table */}
      <div className="excel-table-container" style={{ flex: 1, minHeight: '300px' }}>
        <table className="excel-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Kode Akun</th>
              <th>Nama Akun Perkiraan</th>
              <th style={{ width: '110px' }}>Kategori</th>
              <th style={{ width: '130px' }}>Sub Kategori</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Saldo Normal</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Saldo Awal (Rp)</th>
              <th>Deskripsi / Catatan</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((acc) => (
              <tr key={acc.code}>
                <td style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold', color: 'var(--color-navy-blue)' }}>
                  {acc.code}
                </td>
                <td style={{ fontWeight: '500' }}>{acc.name}</td>
                <td>
                  <span className="badge badge-review" style={{ fontSize: '9.5px' }}>
                    {acc.category}
                  </span>
                </td>
                <td style={{ color: '#555', fontSize: '11px' }}>{acc.subCategory || '-'}</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold', color: acc.normalBalance === 'D' ? '#00007c' : '#800000' }}>
                  {acc.normalBalance === 'D' ? 'DEBIT' : 'KREDIT'}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
                  {formatNumber(acc.initialBalance || 0)}
                </td>
                <td style={{ color: '#666', fontSize: '11px' }}>{acc.description || '-'}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '3px' }}>
                    <button
                      onClick={() => handleOpenEdit(acc)}
                      title="Ubah Akun"
                      style={{ padding: '1px 5px', fontSize: '10px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(acc)}
                      title="Hapus Akun"
                      style={{ padding: '1px 5px', fontSize: '10px', color: '#b00' }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Status Bar */}
      <div style={{
        backgroundColor: 'var(--color-silver)',
        border: '1px inset #808080',
        padding: '3px 8px',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Total Akun Terdaftar: {accounts.length} Akun Perkiraan (SAK ETAP)</span>
        <span>Menampilkan: {filtered.length} Akun</span>
      </div>

      {/* Modal Add / Edit Account */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ width: '500px' }}>
            <div className="modal-header">
              <div className="modal-title">
                <span>{editingAccount ? '✏️ Ubah Akun Perkiraan' : '➕ Tambah Akun Perkiraan Baru'}</span>
              </div>
              <button className="win-ctrl-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <fieldset className="win-fieldset">
                  <legend>Identitas Akun</legend>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Kode Akun:</label>
                      <input
                        type="text"
                        placeholder="Contoh: 1-1008"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={!!editingAccount}
                        style={{ width: '100%', fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Nama Akun:</label>
                      <input
                        type="text"
                        placeholder="Nama perkiraan akun..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Kategori Utama:</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="ASET">1 - ASET (Aktiva)</option>
                        <option value="KEWAJIBAN">2 - KEWAJIBAN (Hutang)</option>
                        <option value="EKUITAS">3 - EKUITAS (Modal)</option>
                        <option value="PENDAPATAN">4 - PENDAPATAN</option>
                        <option value="HPP">5 - HPP (Beban Pokok)</option>
                        <option value="BEBAN">6 - BEBAN OPERASIONAL</option>
                        <option value="PENDAPATAN_LAIN">8 - PENDAPATAN LAIN</option>
                        <option value="BEBAN_LAIN">9 - BEBAN LAIN</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Sub Kategori:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Aset Lancar / Beban Kantor"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Saldo Normal:</label>
                      <select
                        value={normalBalance}
                        onChange={(e) => setNormalBalance(e.target.value)}
                        style={{ width: '100%', fontWeight: 'bold' }}
                      >
                        <option value="D">DEBIT (D)</option>
                        <option value="K">KREDIT (K)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Saldo Awal (Rp):</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        style={{ width: '100%', textAlign: 'right', fontFamily: 'Courier New, monospace' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Deskripsi / Catatan Tambahan:</label>
                    <textarea
                      placeholder="Fungsi dan kegunaan akun perkiraan ini..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ width: '100%', height: '50px' }}
                    />
                  </div>
                </fieldset>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary" style={{ fontWeight: 'bold' }}>
                  {editingAccount ? 'Simpan Perubahan' : 'Tambahkan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
