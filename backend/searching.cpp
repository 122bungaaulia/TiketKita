#include <cctype>
#include "tiket.h"

using namespace std;

// Normalisasi teks supaya perbandingan tidak peduli huruf besar/kecil
// dan tidak terganggu spasi di awal/akhir:
//   "  JAKARTA " -> "jakarta"
string normalisasi(const string& teks) {
    // 1. Buang spasi di awal dan akhir
    size_t awal = teks.find_first_not_of(" \t\r\n");
    if (awal == string::npos) {
        return "";   // isinya kosong atau hanya spasi
    }
    size_t akhir = teks.find_last_not_of(" \t\r\n");
    string hasil = teks.substr(awal, akhir - awal + 1);

    // 2. Ubah semua huruf menjadi huruf kecil
    for (size_t i = 0; i < hasil.size(); i++) {
        hasil[i] = (char)tolower((unsigned char)hasil[i]);
    }
    return hasil;
}

// Linear Search pada array daftarTiket (data yang sedang dipakai website)
HasilSearch linearSearch(const string& kotaTujuan) {
    HasilSearch hs;
    hs.diperiksa = 0;
    hs.ditemukan = 0;

    string kunci = normalisasi(kotaTujuan);

    hs.log.push_back({"info",
        "Memulai Linear Search.\nKriteria tujuan: " + kotaTujuan +
        "\nSetelah normalisasi: \"" + kunci + "\""});

    Tiket* p = daftarTiket;   // pointer mulai dari elemen pertama
    for (int i = 0; i < jumlahTiket; i++) {
        hs.diperiksa++;

        hs.log.push_back({"periksa",
            "Periksa indeks " + to_string(i) + ":\nTujuan = " + p->tujuan});

        // Bandingkan tujuan tiket (setelah dinormalisasi) dengan kata kunci
        if (normalisasi(p->tujuan) == kunci) {
            hs.ditemukan++;
            hs.hasil.push_back(p);   // simpan alamat tiket yang cocok
            hs.log.push_back({"cocok",
                "Cocok. Tiket " + p->kode + " (" + p->asal + " → " + p->tujuan +
                ", " + formatRupiah(p->harga) + ") ditemukan."});
        } else {
            hs.log.push_back({"tidakcocok", "Tidak cocok."});
        }

        p++;   // geser ke elemen berikutnya
    }

    string penutup = "Pencarian selesai.\nJumlah elemen yang diperiksa: " +
                     to_string(hs.diperiksa) +
                     "\nJumlah hasil ditemukan: " + to_string(hs.ditemukan);
    if (hs.ditemukan == 0) {
        penutup += "\nTidak ada tiket dengan tujuan \"" + kotaTujuan + "\".";
    }
    hs.log.push_back({"selesai", penutup});

    return hs;
}