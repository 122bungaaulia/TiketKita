#include "tiket.h"

using namespace std;

// Mengubah 850000 menjadi "Rp850.000"
string formatRupiah(int angka) {
    string digit = to_string(angka);
    string hasil = "";
    int hitung = 0;
    for (int i = (int)digit.size() - 1; i >= 0; i--) {
        hasil = digit[i] + hasil;
        hitung++;
        if (hitung % 3 == 0 && i != 0) {
            hasil = "." + hasil;
        }
    }
    return "Rp" + hasil;
}

// Menuliskan isi array saat ini sebagai teks (dibaca lewat pointer)
static string kondisiArray(const string& judul) {
    string teks = judul;
    Tiket* p = daftarTiket;
    for (int i = 0; i < jumlahTiket; i++) {
        teks += "\n" + to_string(i + 1) + ". " + p->kode + " — " + formatRupiah(p->harga);
        p++;
    }
    return teks;
}

// Mengambil urutan id tiket pada array saat ini (dibaca lewat pointer)
static vector<int> urutanId() {
    vector<int> hasil;
    Tiket* p = daftarTiket;
    for (int i = 0; i < jumlahTiket; i++) {
        hasil.push_back(p->id);
        p++;
    }
    return hasil;
}

// Menukar ISI dua tiket yang ditunjuk oleh pointer a dan b
void tukar(Tiket* a, Tiket* b) {
    Tiket sementara = *a;
    *a = *b;
    *b = sementara;
}

// Bubble Sort pada array daftarTiket (data yang benar-benar dipakai website)
HasilSort bubbleSort(bool termurahDulu) {
    HasilSort hasil;
    hasil.perbandingan = 0;
    hasil.pertukaran = 0;
    hasil.jumlahPass = 0;
    hasil.urutanAwal = urutanId();   // rekam kondisi awal untuk visualisasi

    int n = jumlahTiket;

    hasil.log.push_back({"info", string("Memulai Bubble Sort berdasarkan harga ") +
                                 (termurahDulu ? "termurah." : "termahal.")});
    hasil.log.push_back({"kondisi", kondisiArray("Data sebelum sorting:")});

    for (int pass = 1; pass < n; pass++) {
        hasil.jumlahPass++;
        bool adaPertukaran = false;
        hasil.log.push_back({"pass", "Pass " + to_string(pass)});

        Tiket* p = daftarTiket;
        for (int j = 0; j < n - pass; j++) {
            Tiket* kiri = p;
            Tiket* kanan = p + 1;

            hasil.perbandingan++;

            hasil.log.push_back({"bandingkan",
                "Bandingkan posisi " + to_string(j + 1) + " dan " + to_string(j + 2) + ":\n" +
                kiri->kode + " (" + formatRupiah(kiri->harga) + ") dengan " +
                kanan->kode + " (" + formatRupiah(kanan->harga) + ")"});

            bool harusTukar = termurahDulu ? (kiri->harga > kanan->harga)
                                           : (kiri->harga < kanan->harga);

            if (harusTukar) {
                tukar(kiri, kanan);
                hasil.pertukaran++;
                adaPertukaran = true;
                hasil.log.push_back({"tukar",
                    "Urutan salah, tukar posisi " + kiri->kode + " dan " + kanan->kode + "."});
            } else {
                hasil.log.push_back({"aman", "Urutan sudah benar, tidak ditukar."});
            }

            // Rekam langkah ini (urutan SETELAH perbandingan/pertukaran)
            LangkahSort langkah;
            langkah.pass = pass;
            langkah.posisi = j;
            langkah.tukar = harusTukar;
            langkah.jumlahTerurut = pass - 1;
            langkah.urutanId = urutanId();
            hasil.langkah.push_back(langkah);

            p++;
        }

        hasil.log.push_back({"kondisi",
            kondisiArray("Kondisi array setelah pass " + to_string(pass) + ":")});

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