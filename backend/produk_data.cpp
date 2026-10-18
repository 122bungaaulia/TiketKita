#include "produk.h"

using namespace std;

Produk daftarProduk[MAKS_PRODUK];
Produk dataAsliProduk[MAKS_PRODUK];
int jumlahProduk = 0;

void isiDataProduk() {
    // Urutan field: id, kategori, nama, asal, tujuan, lokasi, berangkat, tiba,
    //               durasi, tipe, kapasitas, harga, satuan, fasilitas, deskripsi
    // Semua data adalah contoh (dummy), bukan data layanan sungguhan.
    // Untuk aktivitas dan paket: "tipe" berisi tema (Alam, Pantai, Keluarga, Kuliner,
    // Budaya, Hiburan, Spa), "kapasitas" berisi kuota, "lokasi" berisi venue atau area.
    Produk data[] = {
        // ----- KERETA API -----
        {101, "kereta", "Nusa Express", "Surabaya", "Jakarta", "Pasar Turi → Gambir", "07:00", "16:00", "9j 00m", "Eksekutif", 40, 620000, "per penumpang", "AC, Colokan listrik, Makanan ringan", "Perjalanan siang kelas eksekutif."},
        {102, "kereta", "Laju Timur", "Surabaya", "Jakarta", "Pasar Turi → Pasar Senen", "19:30", "04:30", "9j 00m", "Bisnis", 60, 410000, "per penumpang", "AC, Selimut", "Perjalanan malam, tiba keesokan harinya."},
        {103, "kereta", "Rajawali Ekonomi", "Surabaya", "Jakarta", "Gubeng → Pasar Senen", "21:00", "07:30", "10j 30m", "Ekonomi", 80, 275000, "per penumpang", "AC", "Pilihan hemat, tiba keesokan harinya."},
        {104, "kereta", "Bintang Barat", "Jakarta", "Surabaya", "Gambir → Pasar Turi", "08:00", "17:00", "9j 00m", "Eksekutif", 40, 640000, "per penumpang", "AC, Colokan listrik, Makanan ringan", "Perjalanan siang kelas eksekutif."},
        {105, "kereta", "Laju Selatan", "Jakarta", "Yogyakarta", "Gambir → Tugu", "06:30", "14:00", "7j 30m", "Eksekutif", 36, 560000, "per penumpang", "AC, Colokan listrik", "Berangkat pagi, tiba siang."},
        {106, "kereta", "Cakra Priangan", "Bandung", "Yogyakarta", "Bandung → Tugu", "09:00", "15:30", "6j 30m", "Bisnis", 50, 330000, "per penumpang", "AC", "Rute antarprovinsi kelas bisnis."},
        {107, "kereta", "Pesisir Express", "Surabaya", "Yogyakarta", "Gubeng → Tugu", "10:00", "15:00", "5j 00m", "Eksekutif", 40, 380000, "per penumpang", "AC, Colokan listrik", "Perjalanan singkat kelas eksekutif."},
        {108, "kereta", "Kota Lama", "Yogyakarta", "Surabaya", "Tugu → Gubeng", "14:00", "19:30", "5j 30m", "Ekonomi", 70, 185000, "per penumpang", "AC", "Pilihan paling hemat."},

        // ----- SEWA MOBIL -----
        {201, "mobil", "City Car Hatchback", "", "Surabaya", "Bandara Juanda", "", "", "", "Otomatis", 4, 280000, "per hari", "AC, Bluetooth", "Lepas kunci, bahan bakar tidak termasuk."},
        {202, "mobil", "MPV Keluarga", "", "Surabaya", "Stasiun Gubeng", "", "", "", "Manual", 7, 380000, "per hari", "AC, Bagasi luas, Audio", "Termasuk pengemudi."},
        {203, "mobil", "SUV Kompak", "", "Jakarta", "Bandara Soekarno-Hatta", "", "", "", "Otomatis", 5, 520000, "per hari", "AC, Kamera mundur, Bluetooth", "Lepas kunci."},
        {204, "mobil", "MPV Premium", "", "Jakarta", "Stasiun Gambir", "", "", "", "Otomatis", 7, 750000, "per hari", "AC, Kursi kulit, Bagasi luas", "Termasuk pengemudi."},
        {205, "mobil", "Mini Bus 15 Kursi", "", "Yogyakarta", "Bandara YIA", "", "", "", "Manual", 15, 950000, "per hari", "AC, Audio, Bagasi luas", "Termasuk pengemudi, cocok untuk rombongan."},
        {206, "mobil", "City Car Hatchback", "", "Yogyakarta", "Stasiun Tugu", "", "", "", "Manual", 4, 250000, "per hari", "AC", "Lepas kunci."},
        {207, "mobil", "SUV Kompak", "", "Denpasar", "Bandara Ngurah Rai", "", "", "", "Otomatis", 5, 600000, "per hari", "AC, Kamera mundur", "Lepas kunci."},
        {208, "mobil", "MPV Keluarga", "", "Bandung", "Stasiun Bandung", "", "", "", "Otomatis", 7, 450000, "per hari", "AC, Bluetooth, Bagasi luas", "Lepas kunci."},

        // ----- HOTEL -----
        {301, "hotel", "Hotel Surya Kencana", "", "Surabaya", "Tunjungan", "", "", "", "Deluxe Room", 2, 540000, "per malam", "WiFi, Sarapan, Kolam renang", "Hotel bisnis di pusat kota."},
        {302, "hotel", "Taman Sari Inn", "", "Yogyakarta", "Malioboro", "", "", "", "Standard Room", 2, 310000, "per malam", "WiFi, AC, Sarapan", "Dekat pusat belanja dan kuliner."},
        {303, "hotel", "Hotel Pantai Indah", "", "Denpasar", "Kuta", "", "", "", "Superior Room", 3, 780000, "per malam", "WiFi, Kolam renang, Sarapan, Dekat pantai", "Hotel dekat pantai."},
        {304, "hotel", "Hotel Kota Raya", "", "Jakarta", "Sudirman", "", "", "", "Executive Room", 2, 890000, "per malam", "WiFi, Gym, Sarapan, Lounge", "Hotel di kawasan bisnis."},
        {305, "hotel", "Hotel Pasundan", "", "Bandung", "Dago", "", "", "", "Deluxe Room", 3, 470000, "per malam", "WiFi, Sarapan, Taman", "Suasana sejuk di kawasan Dago."},
        {306, "hotel", "Hotel Medan Jaya", "", "Medan", "Kesawan", "", "", "", "Standard Room", 2, 360000, "per malam", "WiFi, AC, Sarapan", "Dekat kawasan kota tua."},

        // ----- VILA -----
        {401, "vila", "Vila Bukit Senja", "", "Denpasar", "Ubud", "", "", "", "Vila 2 Kamar", 4, 1250000, "per malam", "Kolam renang pribadi, Dapur, WiFi, Sarapan", "Vila di perbukitan dengan kolam pribadi."},
        {402, "vila", "Vila Lembah Hijau", "", "Bandung", "Lembang", "", "", "", "Vila 3 Kamar", 6, 1100000, "per malam", "Taman, Dapur, BBQ, WiFi", "Vila keluarga dengan area BBQ."},
        {403, "vila", "Vila Pantai Sunyi", "", "Denpasar", "Canggu", "", "", "", "Vila 1 Kamar", 2, 980000, "per malam", "Kolam renang, WiFi, Sarapan", "Vila privat untuk pasangan."},
        {404, "vila", "Vila Gunung Asri", "", "Yogyakarta", "Kaliurang", "", "", "", "Vila 2 Kamar", 5, 720000, "per malam", "Taman, Dapur, WiFi", "Udara sejuk di lereng gunung."},
        {405, "vila", "Vila Embun Pagi", "", "Bandung", "Ciwidey", "", "", "", "Vila 4 Kamar", 8, 1450000, "per malam", "Taman, Dapur, WiFi, Perapian", "Vila besar untuk rombongan."},

        // ----- APARTEMEN -----
        {501, "apartemen", "Apartemen Metro Tower", "", "Jakarta", "Kuningan", "", "", "", "Studio", 2, 650000, "per malam", "WiFi, Dapur kecil, Gym, Kolam renang", "Apartemen di pusat kota."},
        {502, "apartemen", "Apartemen Graha Kota", "", "Surabaya", "Gubeng", "", "", "", "1 Kamar Tidur", 3, 520000, "per malam", "WiFi, Dapur, AC, Parkir", "Dekat stasiun dan pusat kuliner."},
        {503, "apartemen", "Apartemen Pusat Bandung", "", "Bandung", "Dago", "", "", "", "Studio", 2, 430000, "per malam", "WiFi, AC, Dapur kecil", "Unit studio nyaman."},
        {504, "apartemen", "Apartemen Seaside", "", "Denpasar", "Sanur", "", "", "", "2 Kamar Tidur", 4, 1050000, "per malam", "WiFi, Dapur, Kolam renang, Parkir", "Unit keluarga dekat pantai."},
        {505, "apartemen", "Apartemen Kampus Asri", "", "Yogyakarta", "Condongcatur", "", "", "", "Studio", 2, 340000, "per malam", "WiFi, AC, Dapur kecil", "Unit hemat untuk menginap beberapa hari."},

        // ----- AKTIVITAS & HIBURAN (tipe = tema, kapasitas = kuota per hari) -----
        {601, "aktivitas", "Taman Satwa Nusantara", "", "Surabaya", "Wonokromo", "", "", "5 jam", "Keluarga", 500, 85000, "per tiket", "Parkir, Area bermain, Mushola", "Taman satwa dengan wahana ramah anak."},
        {602, "aktivitas", "Snorkeling Pantai Biru", "", "Denpasar", "Nusa Dua", "", "", "3 jam", "Pantai", 20, 350000, "per tiket", "Alat snorkeling, Pemandu, Foto bawah air", "Snorkeling di perairan jernih dengan pemandu."},
        {603, "aktivitas", "Pertunjukan Tari Kecak", "", "Denpasar", "Uluwatu", "", "", "2 jam", "Budaya", 150, 150000, "per tiket", "Tempat duduk, Pemandu", "Pertunjukan tari di tepi tebing saat senja."},
        {604, "aktivitas", "Tur Kuliner Malioboro", "", "Yogyakarta", "Malioboro", "", "", "3 jam", "Kuliner", 15, 175000, "per tiket", "Pemandu, Cicip 5 makanan", "Berkeliling mencicipi kuliner khas."},
        {605, "aktivitas", "Jelajah Candi Sore Hari", "", "Yogyakarta", "Kompleks Candi", "", "", "4 jam", "Budaya", 40, 120000, "per tiket", "Pemandu, Air minum", "Mengunjungi candi bersama pemandu sejarah."},
        {606, "aktivitas", "Trekking Kawah Hijau", "", "Bandung", "Ciwidey", "", "", "5 jam", "Alam", 25, 210000, "per tiket", "Pemandu, Makan siang, Asuransi", "Jalur trekking menuju kawah dengan pemandangan hijau."},
        {607, "aktivitas", "Spa Relaksasi Tradisional", "", "Jakarta", "Kemang", "", "", "2 jam", "Spa", 10, 320000, "per tiket", "Pijat, Aromaterapi, Teh herbal", "Perawatan relaksasi dengan ramuan tradisional."},
        {608, "aktivitas", "Konser Musik Akustik Malam", "", "Jakarta", "Senayan", "", "", "3 jam", "Hiburan", 300, 250000, "per tiket", "Tempat duduk, Area makan", "Pertunjukan musik akustik di ruang terbuka."},
        {609, "aktivitas", "Wahana Air Keluarga", "", "Surabaya", "Kenjeran", "", "", "6 jam", "Keluarga", 200, 95000, "per tiket", "Loker, Kolam anak, Penjaga pantai", "Wahana air untuk seluruh keluarga."},
        {610, "aktivitas", "Wisata Kuliner Kota Tua", "", "Medan", "Kesawan", "", "", "3 jam", "Kuliner", 20, 140000, "per tiket", "Pemandu, Cicip 4 makanan", "Menyusuri kuliner di kawasan kota tua."},

        // ----- PAKET WISATA (tipe = tema, kapasitas = maksimum peserta, harga per orang) -----
        {701, "paket", "Paket Bali Pantai 3D2N", "", "Denpasar", "Kuta, Nusa Dua, Uluwatu", "", "", "3 hari 2 malam", "Pantai", 12, 2450000, "per orang", "Hotel, Transportasi, Sarapan, Pemandu", "Menjelajahi pantai-pantai populer dengan jadwal santai."},
        {702, "paket", "Paket Jogja Budaya 3D2N", "", "Yogyakarta", "Candi, Keraton, Malioboro", "", "", "3 hari 2 malam", "Budaya", 15, 1850000, "per orang", "Hotel, Transportasi, Sarapan, Tiket masuk", "Mengenal sejarah dan budaya Yogyakarta."},
        {703, "paket", "Paket Bandung Alam 2D1N", "", "Bandung", "Lembang, Ciwidey", "", "", "2 hari 1 malam", "Alam", 10, 1250000, "per orang", "Vila, Transportasi, Makan, Pemandu", "Udara sejuk, kebun teh, dan kawah."},
        {704, "paket", "Paket Keluarga Surabaya 2D1N", "", "Surabaya", "Kenjeran, Taman Satwa", "", "", "2 hari 1 malam", "Keluarga", 20, 1100000, "per orang", "Hotel, Transportasi, Sarapan, Tiket wahana", "Paket santai untuk keluarga dengan anak."},
        {705, "paket", "Paket Kuliner Medan 2D1N", "", "Medan", "Kesawan, Sentra Kuliner", "", "", "2 hari 1 malam", "Kuliner", 12, 1350000, "per orang", "Hotel, Transportasi, Cicip kuliner, Pemandu", "Mencicipi masakan khas Medan."},
        {706, "paket", "Paket Jakarta Kota 1 Hari", "", "Jakarta", "Kota Tua, Monumen", "", "", "1 hari", "Keluarga", 25, 650000, "per orang", "Transportasi, Makan siang, Pemandu", "Wisata satu hari keliling kota."}
    };

    jumlahProduk = sizeof(data) / sizeof(data[0]);

    // POINTER: salin data ke array asli dan array aktif dengan menggeser pointer
    Produk* sumber = data;
    Produk* tujuanAsli = dataAsliProduk;
    Produk* tujuanAktif = daftarProduk;
    for (int i = 0; i < jumlahProduk; i++) {
        *tujuanAsli = *sumber;
        *tujuanAktif = *sumber;
        sumber++;
        tujuanAsli++;
        tujuanAktif++;
    }
}

bool kategoriDikenal(const string& kategori) {
    const string dikenal[] = {"kereta", "mobil", "hotel", "vila", "apartemen", "aktivitas", "paket"};
    for (const string& k : dikenal) {
        if (k == kategori) return true;
    }
    return false;
}

// Mengumpulkan POINTER ke semua elemen array yang kategorinya cocok
vector<Produk*> ambilProdukKategori(const string& kategori) {
    vector<Produk*> hasil;
    Produk* p = daftarProduk;
    for (int i = 0; i < jumlahProduk; i++) {
        if (p->kategori == kategori) {
            hasil.push_back(p);
        }
        p++;
    }
    return hasil;
}

// Mengembalikan isi array aktif ke kondisi awal, hanya untuk satu kategori
void resetProduk(const string& kategori) {
    Produk* aktif = daftarProduk;
    Produk* asli = dataAsliProduk;
    for (int i = 0; i < jumlahProduk; i++) {
        if (asli->kategori == kategori) {
            *aktif = *asli;
        }
        aktif++;
        asli++;
    }
}

// Mengembalikan pointer ke produk dengan id tertentu, atau nullptr
Produk* cariProdukById(int id) {
    Produk* p = daftarProduk;
    for (int i = 0; i < jumlahProduk; i++) {
        if (p->id == id) {
            return p;
        }
        p++;
    }
    return nullptr;
}