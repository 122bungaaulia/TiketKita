#include "produk.h"

using namespace std;

// Menukar ISI dua produk yang ditunjuk pointer a dan b
void tukarProduk(Produk* a, Produk* b) {
    Produk sementara = *a;
    *a = *b;
    *b = sementara;
}

static vector<int> urutanIdProduk(const vector<Produk*>& daftar) {
    vector<int> hasil;
    for (Produk* p : daftar) {
        hasil.push_back(p->id);
    }
    return hasil;
}

static string kondisiProduk(const string& judul, const vector<Produk*>& daftar) {
    string teks = judul;
    for (size_t i = 0; i < daftar.size(); i++) {
        teks += "\n" + to_string(i + 1) + ". " + daftar[i]->nama + " — " + formatRupiah(daftar[i]->harga);
    }
    return teks;
}

// Bubble Sort pada satu kategori produk.
// "daftar" berisi pointer ke elemen array daftarProduk, jadi pertukaran
// benar-benar mengubah isi array asli.
HasilSort bubbleSortProduk(const string& kategori, bool termurahDulu) {
    HasilSort hasil;
    hasil.perbandingan = 0;
    hasil.pertukaran = 0;
    hasil.jumlahPass = 0;

    vector<Produk*> daftar = ambilProdukKategori(kategori);
    int n = (int)daftar.size();
    hasil.urutanAwal = urutanIdProduk(daftar);

    hasil.log.push_back({"info", "Memulai Bubble Sort kategori " + kategori +
                                 " berdasarkan harga " + (termurahDulu ? "termurah." : "termahal.")});
    hasil.log.push_back({"kondisi", kondisiProduk("Data sebelum sorting:", daftar)});

    for (int pass = 1; pass < n; pass++) {
        hasil.jumlahPass++;
        bool adaPertukaran = false;
        hasil.log.push_back({"pass", "Pass " + to_string(pass)});

        for (int j = 0; j < n - pass; j++) {
            Produk* kiri = daftar[j];
            Produk* kanan = daftar[j + 1];

            hasil.perbandingan++;

            hasil.log.push_back({"bandingkan",
                "Bandingkan posisi " + to_string(j + 1) + " dan " + to_string(j + 2) + ":\n" +
                kiri->nama + " (" + formatRupiah(kiri->harga) + ") dengan " +
                kanan->nama + " (" + formatRupiah(kanan->harga) + ")"});

            bool harusTukar = termurahDulu ? (kiri->harga > kanan->harga)
                                           : (kiri->harga < kanan->harga);

            if (harusTukar) {
                tukarProduk(kiri, kanan);
                hasil.pertukaran++;
                adaPertukaran = true;
                hasil.log.push_back({"tukar",
                    "Urutan salah, tukar posisi " + kiri->nama + " dan " + kanan->nama + "."});
            } else {
                hasil.log.push_back({"aman", "Urutan sudah benar, tidak ditukar."});
            }
        }

        hasil.log.push_back({"kondisi",
            kondisiProduk("Kondisi array setelah pass " + to_string(pass) + ":", daftar)});

        if (!adaPertukaran) {
            hasil.log.push_back({"info",
                "Tidak ada pertukaran pada pass ini, data sudah terurut. Sorting berhenti lebih awal."});
            break;
        }
    }

    hasil.log.push_back({"selesai",
        "Sorting selesai.\nTotal perbandingan: " + to_string(hasil.perbandingan) +
        "\nTotal pertukaran: " + to_string(hasil.pertukaran) +
        "\nJumlah pass: " + to_string(hasil.jumlahPass)});

    return hasil;
}