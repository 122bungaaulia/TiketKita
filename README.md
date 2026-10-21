# TiketKita

Website pemesanan tiket dan akomodasi bertema Tiketing (terinspirasi Traveloka), dibuat untuk tugas mata kuliah Struktur Data. Logika program berjalan di backend C++, sedangkan tampilan dibuat dengan HTML, CSS, dan JavaScript.

- Nama: Bunga Aulia Putri Maharani
- NIM: 25050974122
- Prodi: Pendidikan Teknologi Informasi, Universitas Negeri Surabaya
- Mata kuliah: Struktur Data
- Video demo: [https://youtu.be/9GBEKouPKys]

## Layanan

| Layanan | Isi |
|---|---|
| Pesawat | 12 tiket contoh, pencarian, pengurutan harga, animasi Bubble Sort |
| Kereta Api | 8 tiket contoh |
| Sewa Mobil | 8 mobil, validasi waktu, biaya sewa per hari |
| Hotel, Vila, Apartemen | 16 akomodasi, validasi tanggal dan kapasitas |
| Aktivitas dan Hiburan | 10 aktivitas, filter kuota |
| Paket Wisata | 6 paket, batas jumlah peserta |
| Discovery | Menjelajah aktivitas dan paket berdasarkan 5 tema |
| Pesanan Saya | Simulasi pemesanan dan status pesanan |
| Poin dan Reward | Poin dari pesanan berstatus Berhasil, penukaran kupon contoh |

## Pemetaan Struktur Data

| Konsep | Penerapan | File |
|---|---|---|
| Struct | `Tiket` untuk pesawat dan `Produk` untuk layanan lain | `backend/tiket.h`, `backend/produk.h` |
| Array | `daftarTiket[20]` dan `daftarProduk[100]`, masing-masing dengan salinan data asli untuk reset | `backend/data.cpp`, `backend/produk_data.cpp` |
| Pointer | Pertukaran data saat sorting, penelusuran array, pencarian berdasarkan id, dan `vector<Produk*>` per kategori | `backend/sorting.cpp`, `backend/produk_sorting.cpp`, `backend/data.cpp`, `backend/produk_data.cpp` |
| Sorting | Bubble Sort berdasarkan harga (termurah atau termahal), dengan log setiap perbandingan, pertukaran, dan putaran | `backend/sorting.cpp`, `backend/produk_sorting.cpp` |
| Searching | Linear Search tidak peka huruf besar/kecil, mengembalikan semua hasil dan jumlah elemen yang diperiksa | `backend/searching.cpp`, `backend/produk_searching.cpp` |

Log sorting dan searching dihasilkan dari proses yang benar-benar dijalankan di backend, bukan teks statis. Detail tiket menampilkan alamat memori elemen array yang ditunjuk pointer.

## Struktur Folder

```text
TiketKita/
├── README.md
├── backend/      kode C++ (struct, array, pointer, sorting, searching, API)
└── frontend/     index.html, CSS, JavaScript, dan folder gambar
```

## Cara Menjalankan

Dibutuhkan compiler C++17. Contoh berikut memakai Developer Command Prompt for Visual Studio (MSVC). Library `httplib.h` dan `json.hpp` sudah ada di folder `backend`.

1. Buka Developer Command Prompt dan masuk ke folder proyek:
   `cd /d "D:\path\ke\TiketKita"`
2. Kompilasi:
   `cl /std:c++17 /EHsc /utf-8 backend\*.cpp /Fe:tiketkita.exe`
3. Jalankan `tiketkita.exe`, lalu biarkan jendelanya terbuka.
4. Buka `http://localhost:8080` di browser.

## Status Pengujian

Seluruh halaman diuji manual pada 17/10/2026: tampilan data, pencarian, pengurutan, reset, validasi form, pembuatan dan konfirmasi pesanan, perhitungan poin, serta pesan saat backend tidak berjalan.

## Batasan

- Semua data (harga, jadwal, ketersediaan) adalah contoh, bukan data layanan sungguhan.
- Pemesanan hanya simulasi. Pesanan disimpan di localStorage browser dan tidak ada pembayaran.
- Pada Pesawat, tanggal berangkat belum memengaruhi hasil karena data contoh tidak memiliki tanggal. Kota asal hanya menyaring tampilan hasil.
- Poin dan kupon adalah simulasi. Kupon hasil penukaran belum dapat dipakai pada pesanan.
- Foto bersifat ilustrasi dan tidak selalu menggambarkan produk atau lokasi pada data contoh.
- Website membutuhkan backend C++ yang berjalan lokal, sehingga membuka `index.html` langsung tanpa server tidak menampilkan data.

## Kredit Foto

Foto bersumber dari situs foto bebas pakai.

| File | Fotografer | Sumber |
|---|---|---|
| `pesawat.jpg` | Jeffry Surianto | [Unsplash/Pexels] |
| `mobil.jpg` | txcoms | [Unsplash/Pexels] |
| `kereta.jpg` | Quy Nguyen | [Unsplash/Pexels] |
| `hotel.jpg` | Mlsbb Eri | [Unsplash/Pexels] |
| `vila.jpg` | Domenico Adornato | [Unsplash/Pexels] |
| `apartemen.jpg` | Hakim Santoso | [Unsplash/Pexels] |
| `aktivitas.jpg` | thekarimunjawa | [Unsplash/Pexels] |
| `paket.jpg` | Mikhail Nilov | [Unsplash/Pexels] |
| `discovery.jpg` | Makslms Mordanovs | [Unsplash/Pexels] |
