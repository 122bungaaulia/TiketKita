#ifndef TIKET_H
#define TIKET_H

#include <string>
#include <vector>

const int MAKS_TIKET = 20;

// STRUCT: satu paket data untuk satu tiket
struct Tiket {
    int id;
    std::string kode;
    std::string maskapai;
    std::string asal;
    std::string tujuan;
    std::string berangkat;
    std::string tiba;
    std::string durasi;
    int harga;
};

// Satu baris log. "tipe" dipakai frontend untuk memberi warna.
struct BarisLog {
    std::string tipe;
    std::string teks;
};

// Rekaman satu langkah perbandingan pada Bubble Sort (untuk visualisasi)
struct LangkahSort {
    int pass;                   // nomor pass, mulai dari 1
    int posisi;                 // indeks elemen kiri yang dibandingkan, mulai dari 0
    bool tukar;                 // true jika kedua elemen ditukar
    int jumlahTerurut;          // jumlah elemen di ujung kanan yang sudah final
    std::vector<int> urutanId;  // urutan id tiket SETELAH langkah ini
};

// Hasil lengkap satu kali Bubble Sort
struct HasilSort {
    std::vector<BarisLog> log;
    std::vector<int> urutanAwal;        // urutan id sebelum sorting
    std::vector<LangkahSort> langkah;   // rekaman semua langkah
    int perbandingan;
    int pertukaran;
    int jumlahPass;
};

// Hasil lengkap satu kali Linear Search
struct HasilSearch {
    std::vector<BarisLog> log;
    std::vector<Tiket*> hasil;   // POINTER ke tiket-tiket yang cocok
    int diperiksa;
    int ditemukan;
};

extern Tiket daftarTiket[MAKS_TIKET];
extern Tiket dataAsli[MAKS_TIKET];
extern int jumlahTiket;

// data.cpp
void isiDataAwal();
void resetData();
Tiket* cariTiketById(int id);

// sorting.cpp
void tukar(Tiket* a, Tiket* b);
HasilSort bubbleSort(bool termurahDulu);
std::string formatRupiah(int angka);

// searching.cpp
std::string normalisasi(const std::string& teks);
HasilSearch linearSearch(const std::string& kotaTujuan);

#endif