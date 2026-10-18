#include "produk.h"

using namespace std;

// Mengambil nilai atribut yang dicari dari satu produk
static string ambilAtribut(const Produk* p, const string& atribut) {
    if (atribut == "nama") return p->nama;
    if (atribut == "tipe") return p->tipe;
    return p->tujuan;   // default: tujuan / kota lokasi
}

bool atributDikenal(const string& atribut) {
    return atribut == "tujuan" || atribut == "nama" || atribut == "tipe";
}

// Linear Search pada satu kategori produk
HasilSearchProduk linearSearchProduk(const string& kategori,
                                     const string& atribut,
                                     const string& kataKunci) {
    HasilSearchProduk hs;
    hs.diperiksa = 0;
    hs.ditemukan = 0;

    string kunci = normalisasi(kataKunci);
    vector<Produk*> daftar = ambilProdukKategori(kategori);

    hs.log.push_back({"info",
        "Memulai Linear Search pada kategori " + kategori + ".\nKriteria " + atribut + ": " +
        kataKunci + "\nSetelah normalisasi: \"" + kunci + "\""});

    for (int i = 0; i < (int)daftar.size(); i++) {
        Produk* p = daftar[i];
        hs.diperiksa++;

        string nilai = ambilAtribut(p, atribut);
        hs.log.push_back({"periksa",
            "Periksa indeks " + to_string(i) + ":\n" + atribut + " = " + nilai});

        if (normalisasi(nilai) == kunci) {
            hs.ditemukan++;
            hs.hasil.push_back(p);
            hs.log.push_back({"cocok",
                "Cocok. " + p->nama + " (" + p->tujuan + ", " + formatRupiah(p->harga) + ") ditemukan."});
        } else {
            hs.log.push_back({"tidakcocok", "Tidak cocok."});
        }
    }

    string penutup = "Pencarian selesai.\nJumlah elemen yang diperiksa: " + to_string(hs.diperiksa) +
                     "\nJumlah hasil ditemukan: " + to_string(hs.ditemukan);
    if (hs.ditemukan == 0) {
        penutup += "\nTidak ada produk dengan " + atribut + " \"" + kataKunci + "\".";
    }
    hs.log.push_back({"selesai", penutup});

    return hs;
}