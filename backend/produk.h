#ifndef PRODUK_H
#define PRODUK_H

#include <string>
#include <vector>
#include "tiket.h"   // memakai BarisLog dan HasilSort yang sudah ada

const int MAKS_PRODUK = 100;

// STRUCT: satu model data untuk semua layanan selain pesawat.
// Field yang tidak relevan untuk suatu kategori dikosongkan.
struct Produk {
    int id;
    std::string kategori;   // kereta, mobil, hotel, vila, apartemen
    std::string nama;
    std::string asal;       // kota asal (khusus kereta)
    std::string tujuan;     // kota tujuan / kota lokasi (kunci Linear Search)
    std::string lokasi;     // detail lokasi: stasiun, titik pengambilan, area
    std::string berangkat;  // jam berangkat (kereta)
    std::string tiba;       // jam tiba (kereta)
    std::string durasi;     // lama perjalanan (kereta)
    std::string tipe;       // kelas kereta / transmisi mobil / jenis kamar
    int kapasitas;          // kursi tersedia, penumpang, atau tamu
    int harga;              // harga per satuan (kunci Bubble Sort)
    std::string satuan;     // per penumpang / per hari / per malam
    std::string fasilitas;  // dipisahkan koma
    std::string deskripsi;
};

// Hasil Linear Search pada Produk
struct HasilSearchProduk {
    std::vector<BarisLog> log;
    std::vector<Produk*> hasil;   // POINTER ke elemen array yang cocok
    int diperiksa;
    int ditemukan;
};

extern Produk daftarProduk[MAKS_PRODUK];
extern Produk dataAsliProduk[MAKS_PRODUK];
extern int jumlahProduk;

// produk_data.cpp
void isiDataProduk();
bool kategoriDikenal(const std::string& kategori);
std::vector<Produk*> ambilProdukKategori(const std::string& kategori);
void resetProduk(const std::string& kategori);
Produk* cariProdukById(int id);

// produk_sorting.cpp
void tukarProduk(Produk* a, Produk* b);
HasilSort bubbleSortProduk(const std::string& kategori, bool termurahDulu);

// produk_searching.cpp
bool atributDikenal(const std::string& atribut);
HasilSearchProduk linearSearchProduk(const std::string& kategori,
                                     const std::string& atribut,
                                     const std::string& kataKunci);

#endif