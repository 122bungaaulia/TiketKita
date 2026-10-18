#include <iostream>
#include <string>
#include <cstdint>
#include "httplib.h"
#include "json.hpp"
#include "tiket.h"
#include "produk.h"

using namespace std;
using json = nlohmann::json;

// Didefinisikan di api_produk.cpp
void daftarkanApiProduk(httplib::Server& server);

// Mengubah satu struct Tiket menjadi JSON (parameternya pointer)
json tiketKeJson(const Tiket* t) {
    return {
        {"id", t->id},
        {"kode", t->kode},
        {"maskapai", t->maskapai},
        {"asal", t->asal},
        {"tujuan", t->tujuan},
        {"berangkat", t->berangkat},
        {"tiba", t->tiba},
        {"durasi", t->durasi},
        {"harga", t->harga}
    };
}

// Mengubah seluruh array daftarTiket menjadi JSON array
json daftarKeJson() {
    json daftar = json::array();
    Tiket* p = daftarTiket;
    for (int i = 0; i < jumlahTiket; i++) {
        daftar.push_back(tiketKeJson(p));
        p++;
    }
    return daftar;
}

int main() {
    isiDataAwal();      // data tiket pesawat
    isiDataProduk();    // data kereta, mobil, hotel, vila, apartemen

    httplib::Server server;
    server.set_mount_point("/", "./frontend");

    server.Get("/api/ping", [](const httplib::Request&, httplib::Response& res) {
        json jawaban = {{"status", "ok"}, {"pesan", "Backend C++ TiketKita berjalan"}};
        res.set_content(jawaban.dump(), "application/json");
    });

    // Data tiket pesawat saat ini
    server.Get("/api/tiket", [](const httplib::Request&, httplib::Response& res) {
        json jawaban = {{"jumlah", jumlahTiket}, {"tiket", daftarKeJson()}};
        res.set_content(jawaban.dump(), "application/json");
    });

    // Detail satu tiket (memakai pointer hasil cariTiketById)
    server.Get("/api/tiket/detail", [](const httplib::Request& req, httplib::Response& res) {
        int id = 0;
        try {
            id = stoi(req.get_param_value("id"));
        } catch (...) {
            res.status = 400;
            json galat = {{"galat", "Parameter id harus berupa angka."}};
            res.set_content(galat.dump(), "application/json");
            return;
        }

        Tiket* hasil = cariTiketById(id);
        if (hasil == nullptr) {
            res.status = 404;
            json galat = {{"galat", "Tiket dengan id tersebut tidak ditemukan."}};
            res.set_content(galat.dump(), "application/json");
            return;
        }

        json jawaban = tiketKeJson(hasil);
        jawaban["alamat_memori"] = reinterpret_cast<uintptr_t>(hasil);
        res.set_content(jawaban.dump(), "application/json");
    });

    // Menjalankan Bubble Sort pesawat. Contoh: POST /api/sort?urutan=termurah
    server.Post("/api/sort", [](const httplib::Request& req, httplib::Response& res) {
        string urutan = req.get_param_value("urutan");
        if (urutan != "termurah" && urutan != "termahal") {
            res.status = 400;
            json galat = {{"galat", "Parameter urutan harus 'termurah' atau 'termahal'."}};
            res.set_content(galat.dump(), "application/json");
            return;
        }

        HasilSort hasil = bubbleSort(urutan == "termurah");

        json log = json::array();
        for (const BarisLog& baris : hasil.log) {
            log.push_back({{"tipe", baris.tipe}, {"teks", baris.teks}});
        }

        // Rekaman langkah untuk visualisasi di browser
        json langkah = json::array();
        for (const LangkahSort& l : hasil.langkah) {
            langkah.push_back({
                {"pass", l.pass},
                {"posisi", l.posisi},
                {"tukar", l.tukar},
                {"jumlahTerurut", l.jumlahTerurut},
                {"urutanId", l.urutanId}
            });
        }

        json jawaban = {
            {"tiket", daftarKeJson()},
            {"log", log},
            {"urutanAwal", hasil.urutanAwal},
            {"langkah", langkah},
            {"perbandingan", hasil.perbandingan},
            {"pertukaran", hasil.pertukaran},
            {"jumlahPass", hasil.jumlahPass}
        };
        res.set_content(jawaban.dump(), "application/json");
    });

    // Mengembalikan urutan awal tiket pesawat
    server.Post("/api/reset", [](const httplib::Request&, httplib::Response& res) {
        resetData();
        json jawaban = {{"tiket", daftarKeJson()}};
        res.set_content(jawaban.dump(), "application/json");
    });

    // Linear Search pesawat. Contoh: GET /api/search?tujuan=Jakarta
    server.Get("/api/search", [](const httplib::Request& req, httplib::Response& res) {
        string tujuan = req.get_param_value("tujuan");

        if (normalisasi(tujuan).empty()) {
            res.status = 400;
            json galat = {{"galat", "Kota tujuan tidak boleh kosong."}};
            res.set_content(galat.dump(), "application/json");
            return;
        }

        HasilSearch hs = linearSearch(tujuan);

        json log = json::array();
        for (const BarisLog& baris : hs.log) {
            log.push_back({{"tipe", baris.tipe}, {"teks", baris.teks}});
        }

        json hasil = json::array();
        for (Tiket* t : hs.hasil) {
            hasil.push_back(tiketKeJson(t));
        }

        json jawaban = {
            {"hasil", hasil},
            {"log", log},
            {"diperiksa", hs.diperiksa},
            {"ditemukan", hs.ditemukan}
        };
        res.set_content(jawaban.dump(), "application/json");
    });

    // Endpoint untuk kereta, mobil, hotel, vila, apartemen
    daftarkanApiProduk(server);

    cout << "Server berjalan di http://localhost:8080" << endl;
    server.listen("localhost", 8080);
    return 0;
}