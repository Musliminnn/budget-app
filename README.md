# 💰 Budget App

<div align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/Electron-38.2-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</div>

<br>

<p align="center">
  <strong>Aplikasi Desktop Pengelola Keuangan Pribadi yang Modern dan Interaktif</strong>
</p>

<p align="center">
  Kelola pemasukan dan pengeluaran Anda dengan mudah, dilengkapi visualisasi data yang menarik dan database lokal untuk privasi maksimal.
</p>

---

## ✨ Fitur Utama

### 📊 **Dashboard Interaktif**
- **Summary Cards** - Lihat total pemasukan, pengeluaran, dan saldo dengan tampilan yang jelas
- **Visualisasi Per Kategori** - Progress bar interaktif untuk setiap kategori pengeluaran dan pemasukan
- **Quick Stats** - Statistik cepat: total transaksi, rata-rata pengeluaran, saving rate, dll
- **Animasi Smooth** - Transisi dan animasi yang membuat pengalaman lebih menyenangkan

### 💸 **Manajemen Transaksi**
- **Input Cerdas** - Form input yang intuitif dengan validasi real-time
- **Auto-Format Rupiah** - Input angka otomatis terformat dengan pemisah ribuan (Rp 1.000.000)
- **Kategori Preset** - Kategori siap pakai untuk pengeluaran dan pemasukan
  - **Pengeluaran**: Makan, Transportasi, Kebutuhan, Jajan/Kopi, Lainnya
  - **Pemasukan**: Gaji, Lainnya
- **Deskripsi Opsional** - Tambahkan catatan untuk setiap transaksi

### 📅 **Custom Date Picker**
- **Kalender Interaktif** - Pilih tanggal dengan tampilan kalender yang cantik
- **Quick Actions** - Tombol cepat untuk "Hari Ini" dan "Kemarin"
- **Navigasi Mudah** - Navigasi bulan dengan tombol prev/next
- **Visual Indicator** - Highlight untuk tanggal hari ini dan tanggal terpilih

### 🔍 **Pencarian & Filter**
- **Search Bar** - Cari transaksi berdasarkan deskripsi, kategori, atau jumlah
- **Filter By Type** - Filter transaksi: Semua, Pemasukan, atau Pengeluaran
- **Real-time Update** - Hasil filter langsung ditampilkan

### 📆 **Filter Per Bulan**
- **Navigasi Bulanan** - Lihat transaksi per bulan dengan navigasi yang mudah
- **Otomatis Update** - Data dashboard otomatis berubah sesuai bulan yang dipilih
- **Tombol "Bulan Ini"** - Kembali ke bulan sekarang dengan satu klik

### 🗑️ **Custom Delete Dialog**
- **Konfirmasi Elegan** - Dialog konfirmasi yang modern dengan animasi smooth
- **Preview Transaksi** - Lihat detail transaksi sebelum menghapus
- **Aman** - Mencegah penghapusan tidak sengaja

### 💾 **Database Lokal (SQLite)**
- **Privacy First** - Semua data tersimpan lokal di komputer Anda
- **Cepat & Ringan** - Database SQLite yang efisien
- **Persistent Storage** - Data tetap tersimpan meskipun aplikasi ditutup

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **Vue 3**
- **Vite**

### **Desktop Framework**
- **Electron** - Membuat aplikasi desktop cross-platform (Windows, macOS, Linux)

### **State Management**
- **Pinia**

### **Styling**
- **Tailwind CSS 3**

### **Database**
- **SQLite**

---

## 🚀 Instalasi & Menjalankan

### **Prerequisites**
Pastikan Anda sudah menginstall:
- Node.js (v16 atau lebih tinggi)
- npm atau yarn

### **Install Dependencies**
```bash
npm install
```

### **Development Mode**
#### Web Mode
```bash
npm run dev
```
Akses aplikasi di browser: `http://localhost:5173`

#### Electron Mode
```bash
npm run electron-dev
```

### **Build Production**
```bash
# Build web assets
npm run build

# Build Electron app untuk distribusi
npm run build-electron
```

---

## 📁 Struktur Folder

```
budget-app/
├── src/
│   ├── components/          # Komponen Vue
│   │   ├── CustomDatePicker.vue    # Custom date picker
│   │   ├── DashboardSummary.vue    # Dashboard & visualisasi
│   │   ├── DeleteDialog.vue        # Dialog konfirmasi hapus
│   │   ├── MonthSelector.vue       # Selector bulan
│   │   ├── TransactionForm.vue     # Form input transaksi
│   │   └── TransactionList.vue     # List transaksi
│   ├── stores/              # Pinia stores
│   │   └── budgetStore.js          # Store untuk budget management
│   ├── db/                  # Database utilities
│   │   └── database.cjs            # SQLite class (CommonJS for Electron)
│   ├── App.vue              # Main app component
│   ├── main.js              # Entry point
│   └── style.css            # Global styles
├── electron.cjs             # Electron main process
├── preload.cjs              # Electron preload script (IPC bridge)
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔐 Privacy & Security

✅ **100% Offline** - Aplikasi bekerja sepenuhnya offline, tidak ada koneksi ke server
✅ **Local Storage** - Data tersimpan di komputer Anda sendiri
✅ **No Tracking** - Tidak ada analytics atau tracking

---