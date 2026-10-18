#include <cstdint>
#include <string>
#include <vector>
#include "httplib.h"
#include "json.hpp"
#include "produk.h"

using namespace std;
using json = nlohmann::json;

static json produkKeJson(const Produk* p) {
    return {
        {"id", p->id},
        {"kategori", p->kategori},
        {"nama", p->nama},
        {"asal", p->asal},
        {"tujuan", p->tujuan},
        {"lokasi", p->lokasi},
        {"berangkat", p->berangkat},
        {"tiba", p->tiba},
        {"durasi", p->durasi},
        {"tipe", p->tipe},
        {"kapasitas", p->kapasitas},
        {"harga", p->harga},
        {"satuan", p->satuan},
        {"fasilitas", p->fasilitas},
        {"deskripsi", p->deskripsi}
    };
}

static json daftarProdukKeJson(const string& kategori) {
    json daftar = json::array();
    vector<Produk*> produk = ambilProdukKategori(kategori);
    for (Produk* p : produk) {
        daftar.push_back(produkKeJson(p));
    }
    return daftar;
}

static json logKeJson(const vector<BarisLog>& log) {
    json hasil = json::array();
    for (const BarisLog& baris : log) {
        hasil.push_back({{"tipe", baris.tipe}, {"teks", baris.teks}});
    }
    return hasil;
}

static void kirimGalat(httplib::Response& res, int status, const string& pesan) {
    res.status = status;
    json galat = {{"galat", pesan}};
    res.set_content(galat.dump(), "application/json");
}

// Membaca dan memeriksa parameter kategori
static bool bacaKategori(const httplib::Request& req, httplib::Response& res, string& kategori) {
    kategori = req.get_param_value("kategori");
    if (!kategoriDikenal(kategori)) {
        kirimGalat(res, 400, "Kategori tidak dikenal.");
        return false;
    }
    return true;
}

void daftarkanApiProduk(httplib::Server& server) {

    // Daftar produk satu kategori (urutan saat ini)
    server.Get("/api/produk", [](const httplib::Request& req, httplib::Response& res) {
        string kategori;
        if (!bacaKategori(req, res, kategori)) return;

        json daftar = daftarProdukKeJson(kategori);
        json jawaban = {{"kategori", kategori}, {"jumlah", daftar.size()}, {"produk", daftar}};
        res.set_content(jawaban.dump(), "application/json");
    });

    // Detail satu produk memakai pointer hasil cariProdukById
    server.Get("/api/produk/detail", [](const httplib::Request& req, httplib::Response& res) {
        int id = 0;
        try {
            id = stoi(req.get_param_value("id"));
        } catch (...) {
            kirimGalat(res, 400, "Parameter id harus berupa angka.");
            return;
        }

        Produk* p = cariProdukById(id);
        if (p == nullptr) {
            kirimGalat(res, 404, "Produk dengan id tersebut tidak ditemukan.");
            return;
        }

        json jawaban = produkKeJson(p);
        jawaban["alamat_memori"] = reinterpret_cast<uintptr_t>(p);
        res.set_content(jawaban.dump(), "application/json");
    });

    // Bubble Sort. Contoh: POST /api/produk/sort?kategori=kereta&urutan=termurah
    server.Post("/api/produk/sort", [](const httplib::Request& req, httplib::Response& res) {
        string kategori;
        if (!bacaKategori(req, res, kategori)) return;

        string urutan = req.get_param_value("urutan");
        if (urutan != "termurah" && urutan != "termahal") {
            kirimGalat(res, 400, "Parameter urutan harus 'termurah' atau 'termahal'.");
            return;
        }

        HasilSort hasil = bubbleSortProduk(kategori, urutan == "termurah");

        json jawaban = {
            {"produk", daftarProdukKeJson(kategori)},
            {"log", logKeJson(hasil.log)},
            {"perbandingan", hasil.perbandingan},
            {"pertukaran", hasil.pertukaran},
            {"jumlahPass", hasil.jumlahPass}
        };
        res.set_content(jawaban.dump(), "application/json");
    });

    // Mengembalikan urutan awal satu kategori
    server.Post("/api/produk/reset", [](const httplib::Request& req, httplib::Response& res) {
        string kategori;
        if (!bacaKategori(req, res, kategori)) return;

        resetProduk(kategori);
        json jawaban = {{"produk", daftarProdukKeJson(kategori)}};
        res.set_content(jawaban.dump(), "application/json");
    });

    // Linear Search. Contoh: GET /api/produk/search?kategori=kereta&atribut=tujuan&kata=Jakarta
    server.Get("/api/produk/search", [](const httplib::Request& req, httplib::Response& res) {
        string kategori;
        if (!bacaKategori(req, res, kategori)) return;

        string atribut = req.get_param_value("atribut");
        if (atribut.empty()) atribut = "tujuan";
        if (!atributDikenal(atribut)) {
            kirimGalat(res, 400, "Atribut harus 'tujuan', 'nama', atau 'tipe'.");
            return;
        }

        string kata = req.get_param_value("kata");
        if (normalisasi(kata).empty()) {
            kirimGalat(res, 400, "Kata kunci tidak boleh kosong.");
            return;
        }

        HasilSearchProduk hs = linearSearchProduk(kategori, atribut, kata);

        // Ubah pointer hasil menjadi JSON selagi alamatnya masih valid
        json hasil = json::array();
        for (Produk* p : hs.hasil) {
            hasil.push_back(produkKeJson(p));
        }

        json jawaban = {
            {"hasil", hasil},
            {"log", logKeJson(hs.log)},
            {"diperiksa", hs.diperiksa},
            {"ditemukan", hs.ditemukan}
        };
        res.set_content(jawaban.dump(), "application/json");
    });
}