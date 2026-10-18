#include "tiket.h"

Tiket daftarTiket[MAKS_TIKET];
Tiket dataAsli[MAKS_TIKET];
int jumlahTiket = 0;

void isiDataAwal() {
    // Data sumber. Sengaja tidak berurutan agar Sorting terlihat jelas.
    Tiket data[] = {
        {1,  "NA-101", "Nusantara Air",   "Surabaya",   "Jakarta",    "06:00", "07:30", "1j 30m",  850000},
        {2,  "LB-212", "Langit Biru",     "Surabaya",   "Denpasar",   "08:15", "10:15", "1j 00m",  620000},
        {3,  "CA-330", "Cakra Airways",   "Jakarta",    "Surabaya",   "09:00", "10:30", "1j 30m",  780000},
        {4,  "SJ-415", "Sinar Jaya Air",  "Bandung",    "Denpasar",   "10:30", "13:30", "2j 00m", 1150000},
        {5,  "NA-122", "Nusantara Air",   "Surabaya",   "Jakarta",    "12:00", "13:30", "1j 30m",  720000},
        {6,  "LB-248", "Langit Biru",     "Yogyakarta", "Jakarta",    "07:45", "08:50", "1j 05m",  540000},
        {7,  "CA-377", "Cakra Airways",   "Jakarta",    "Yogyakarta", "14:20", "15:30", "1j 10m",  610000},
        {8,  "SJ-502", "Sinar Jaya Air",  "Surabaya",   "Bandung",    "16:00", "17:15", "1j 15m",  690000},
        {9,  "NA-640", "Nusantara Air",   "Jakarta",    "Medan",      "05:30", "08:00", "2j 30m", 1320000},
        {10, "LB-715", "Langit Biru",     "Jakarta",    "Surabaya",   "19:10", "20:40", "1j 30m",  560000},
        {11, "CA-808", "Cakra Airways",   "Yogyakarta", "Denpasar",   "11:05", "13:45", "1j 40m",  980000},
        {12, "SJ-921", "Sinar Jaya Air",  "Medan",      "Jakarta",    "13:00", "15:20", "2j 20m", 1090000}
    };

    jumlahTiket = sizeof(data) / sizeof(data[0]);

    // POINTER: salin data ke dua array dengan menggeser pointer
    Tiket* sumber = data;          // nama array = alamat elemen pertama
    Tiket* tujuanAsli = dataAsli;
    Tiket* tujuanAktif = daftarTiket;

    for (int i = 0; i < jumlahTiket; i++) {
        *tujuanAsli = *sumber;     // * = ambil isi yang ditunjuk pointer
        *tujuanAktif = *sumber;
        sumber++;                  // geser ke elemen berikutnya
        tujuanAsli++;
        tujuanAktif++;
    }
}

void resetData() {
    Tiket* asli = dataAsli;
    Tiket* aktif = daftarTiket;
    for (int i = 0; i < jumlahTiket; i++) {
        *aktif = *asli;
        asli++;
        aktif++;
    }
}

// Mengembalikan alamat tiket yang id-nya cocok (pointer sebagai nilai balik)
Tiket* cariTiketById(int id) {
    Tiket* p = daftarTiket;
    for (int i = 0; i < jumlahTiket; i++) {
        if (p->id == id) {         // -> = akses anggota struct lewat pointer
            return p;              // alamat elemen array
        }
        p++;
    }
    return nullptr;                // tidak ketemu
}