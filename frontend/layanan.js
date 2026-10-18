"use strict";

// Halaman layanan generik untuk Kereta Api, Sewa Mobil, Hotel/Vila/Apartemen,
// Aktivitas & Hiburan, dan Paket Wisata.
// Memakai fungsi dari foto.js (buatFoto), script.js (el, rupiah, normal, panggilApi,
// pesanGalat, tampilkanLog, dialogDetail, isiDetail) dan dari pesanan.js (bukaRingkasan).

const KONFIG_LAYANAN = {
  kereta: {
    judul: "Kereta Api",
    deskripsi: "Cari tiket kereta antarkota, bandingkan harga, lalu pilih untuk membuat pesanan simulasi.",
    jenisForm: "kereta",
    tab: [{ kategori: "kereta", nama: "Kereta Api" }]
  },
  mobil: {
    judul: "Sewa Mobil",
    deskripsi: "Pilih mobil, tentukan waktu pengambilan dan pengembalian, lalu lihat total biaya sewa.",
    jenisForm: "mobil",
    tab: [{ kategori: "mobil", nama: "Sewa Mobil" }]
  },
  hotel: {
    judul: "Hotel, Vila, dan Apartemen",
    deskripsi: "Bandingkan akomodasi berdasarkan destinasi, tanggal menginap, jumlah tamu, dan harga.",
    jenisForm: "akomodasi",
    tab: [
      { kategori: "hotel", nama: "Hotel" },
      { kategori: "vila", nama: "Vila" },
      { kategori: "apartemen", nama: "Apartemen" }
    ]
  },
  aktivitas: {
    judul: "Aktivitas & Hiburan",
    deskripsi: "Temukan tiket wisata, kuliner, spa, dan hiburan di kota tujuanmu.",
    jenisForm: "aktivitas",
    tab: [{ kategori: "aktivitas", nama: "Aktivitas & Hiburan" }]
  },
  paket: {
    judul: "Paket Wisata",
    deskripsi: "Pilih paket perjalanan siap pakai, lengkap dengan durasi dan fasilitas.",
    jenisForm: "paket",
    tab: [{ kategori: "paket", nama: "Paket Wisata" }]
  }
};

const NAMA_KATEGORI = {
  kereta: "Kereta Api", mobil: "Sewa Mobil", hotel: "Hotel", vila: "Vila", apartemen: "Apartemen",
  aktivitas: "Aktivitas", paket: "Paket Wisata"
};

// Status halaman layanan yang sedang dibuka
const layanan = {
  halaman: null,    // kereta | mobil | hotel | aktivitas | paket
  kategori: null,   // kategori produk yang sedang ditampilkan
  daftar: [],       // produk yang sedang tampil di grid
  filter: null      // hasil pencarian terakhir (null = tampil semua)
};

// ---------- Fungsi bantu ----------
function ambil(id) {
  return document.getElementById(id);
}

function pad(angka) {
  return String(angka).padStart(2, "0");
}

function tanggalOffset(tambahHari) {
  const d = new Date();
  d.setDate(d.getDate() + tambahHari);
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function bacaField(id) {
  const elemen = ambil("lay-" + id);
  return elemen ? elemen.value : "";
}

function tampilkanGalat(pesan) {
  ambil("galatLayanan").textContent = pesan;
}

// ---------- Form pencarian ----------
function buatField(spec) {
  const kolom = el("div", "kolom");
  const label = el("label", null, spec.label);
  label.htmlFor = "lay-" + spec.id;

  const input = document.createElement("input");
  input.id = "lay-" + spec.id;
  input.type = spec.tipe || "text";
  if (spec.placeholder) input.placeholder = spec.placeholder;
  if (spec.daftar) input.setAttribute("list", "daftarKota");
  if (spec.min !== undefined) input.min = spec.min;
  if (spec.max !== undefined) input.max = spec.max;
  if (spec.nilai !== undefined) input.value = spec.nilai;
  input.autocomplete = "off";

  kolom.append(label, input);
  return kolom;
}

function bangunForm(jenis) {
  const form = ambil("formLayanan");
  form.replaceChildren();
  const hariIni = tanggalOffset(0);
  const besok = tanggalOffset(1);

  let medan = [];
  if (jenis === "kereta") {
    medan = [
      { id: "asal", label: "Kota asal", placeholder: "mis. Surabaya", daftar: true },
      { id: "tujuan", label: "Kota tujuan", placeholder: "mis. Jakarta", daftar: true },
      { id: "tanggal", label: "Tanggal berangkat", tipe: "date", min: hariIni }
    ];
  } else if (jenis === "mobil") {
    medan = [
      { id: "tujuan", label: "Kota pengambilan", placeholder: "mis. Surabaya", daftar: true },
      { id: "ambilTanggal", label: "Tanggal pengambilan", tipe: "date", min: hariIni, nilai: hariIni },
      { id: "ambilJam", label: "Jam pengambilan", tipe: "time", nilai: "09:00" },
      { id: "kembaliTanggal", label: "Tanggal pengembalian", tipe: "date", min: hariIni, nilai: besok },
      { id: "kembaliJam", label: "Jam pengembalian", tipe: "time", nilai: "09:00" }
    ];
  } else if (jenis === "aktivitas") {
    medan = [
      { id: "tujuan", label: "Kota destinasi", placeholder: "mis. Denpasar", daftar: true },
      { id: "tanggal", label: "Tanggal kunjungan", tipe: "date", min: hariIni, nilai: besok },
      { id: "jumlah", label: "Jumlah tiket", tipe: "number", min: "1", max: "20", nilai: "1" }
    ];
  } else if (jenis === "paket") {
    medan = [
      { id: "tujuan", label: "Destinasi", placeholder: "mis. Yogyakarta", daftar: true },
      { id: "tanggal", label: "Tanggal berangkat", tipe: "date", min: hariIni, nilai: besok },
      { id: "jumlah", label: "Jumlah peserta", tipe: "number", min: "1", max: "20", nilai: "2" }
    ];
  } else {
    medan = [
      { id: "tujuan", label: "Destinasi", placeholder: "mis. Denpasar", daftar: true },
      { id: "masuk", label: "Check-in", tipe: "date", min: hariIni, nilai: hariIni },
      { id: "keluar", label: "Check-out", tipe: "date", min: hariIni, nilai: besok },
      { id: "tamu", label: "Jumlah tamu", tipe: "number", min: "1", max: "20", nilai: "2" },
      { id: "kamar", label: "Jumlah kamar/unit", tipe: "number", min: "1", max: "10", nilai: "1" }
    ];
  }

  medan.forEach(m => form.append(buatField(m)));
  const tombol = el("button", "tombol tombol-utama", "Cari");
  tombol.type = "submit";
  form.append(tombol);
}

// ---------- Validasi ----------
function gagal(pesan) {
  return { ok: false, pesan: pesan };
}

// Mengembalikan { ok: true, ...nilai } atau { ok: false, pesan }
function validasiForm(jenis, perluTujuan) {
  const hariIni = tanggalOffset(0);
  const tujuan = bacaField("tujuan").trim();

  if (perluTujuan && !tujuan) {
    return gagal("Masukkan kota tujuan terlebih dahulu.");
  }

  if (jenis === "kereta") {
    const asal = bacaField("asal").trim();
    const tanggal = bacaField("tanggal");
    if (asal && tujuan && normal(asal) === normal(tujuan)) {
      return gagal("Kota asal dan kota tujuan tidak boleh sama.");
    }
    if (tanggal && tanggal < hariIni) {
      return gagal("Tanggal keberangkatan tidak boleh sebelum hari ini.");
    }
    return { ok: true, tujuan: tujuan, asal: asal, tanggal: tanggal };
  }

  if (jenis === "mobil") {
    const ambilTgl = bacaField("ambilTanggal");
    const ambilJam = bacaField("ambilJam");
    const kembaliTgl = bacaField("kembaliTanggal");
    const kembaliJam = bacaField("kembaliJam");

    if (!ambilTgl || !ambilJam || !kembaliTgl || !kembaliJam) {
      return gagal("Isi tanggal dan jam pengambilan serta pengembalian.");
    }
    if (ambilTgl < hariIni) {
      return gagal("Tanggal pengambilan tidak boleh sebelum hari ini.");
    }
    const mulai = new Date(ambilTgl + "T" + ambilJam);
    const selesai = new Date(kembaliTgl + "T" + kembaliJam);
    if (selesai <= mulai) {
      return gagal("Waktu pengembalian harus setelah waktu pengambilan.");
    }
    // Sewa dihitung per 24 jam, dibulatkan ke atas, minimal 1 hari
    const hari = Math.max(1, Math.ceil((selesai - mulai) / 86400000));
    return {
      ok: true, tujuan: tujuan, hari: hari,
      ambil: ambilTgl + " " + ambilJam, kembali: kembaliTgl + " " + kembaliJam
    };
  }

  if (jenis === "aktivitas" || jenis === "paket") {
    const kataTanggal = jenis === "aktivitas" ? "kunjungan" : "keberangkatan";
    const kataJumlah = jenis === "aktivitas" ? "tiket" : "peserta";
    const tanggal = bacaField("tanggal");
    const jumlah = Number(bacaField("jumlah"));

    if (!tanggal) {
      return gagal("Isi tanggal " + kataTanggal + ".");
    }
    if (tanggal < hariIni) {
      return gagal("Tanggal " + kataTanggal + " tidak boleh sebelum hari ini.");
    }
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) {
      return gagal("Jumlah " + kataJumlah + " harus bilangan bulat 1 sampai 20.");
    }
    return { ok: true, tujuan: tujuan, tanggal: tanggal, jumlah: jumlah };
  }

  // Akomodasi
  const masuk = bacaField("masuk");
  const keluar = bacaField("keluar");
  const tamu = Number(bacaField("tamu"));
  const kamar = Number(bacaField("kamar"));

  if (!masuk || !keluar) {
    return gagal("Isi tanggal check-in dan check-out.");
  }
  if (masuk < hariIni) {
    return gagal("Tanggal check-in tidak boleh sebelum hari ini.");
  }
  if (keluar <= masuk) {
    return gagal("Tanggal check-out harus setelah tanggal check-in.");
  }
  if (!Number.isInteger(tamu) || tamu < 1 || tamu > 20) {
    return gagal("Jumlah tamu harus bilangan bulat 1 sampai 20.");
  }
  if (!Number.isInteger(kamar) || kamar < 1 || kamar > 10) {
    return gagal("Jumlah kamar/unit harus bilangan bulat 1 sampai 10.");
  }
  const malam = Math.round((new Date(keluar) - new Date(masuk)) / 86400000);
  return { ok: true, tujuan: tujuan, masuk: masuk, keluar: keluar, tamu: tamu, kamar: kamar, malam: malam };
}

// ---------- Menampilkan produk ----------
function buatKartuProduk(p, jenis) {
  const kartu = el("article", "kartu-tiket kartu-produk");

  // Foto produk: gambar/produk/<id>.jpg, lalu gambar/<kategori>.jpg, lalu placeholder
  kartu.append(buatFoto(
    ["gambar/produk/" + p.id + ".jpg", "gambar/" + p.kategori + ".jpg"],
    p.kategori,
    p.nama
  ));

  const kepala = el("div", "tiket-kepala");
  kepala.append(el("span", "maskapai", p.nama), el("span", "chip", p.tipe));
  kartu.append(kepala);

  if (jenis === "kereta") {
    const kiri = el("div", "titik");
    kiri.append(el("strong", null, p.berangkat), el("span", null, p.asal));
    const tengah = el("div", "tengah");
    tengah.append(el("span", "durasi", p.durasi), el("span", "garis-rute"));
    const kanan = el("div", "titik kanan");
    kanan.append(el("strong", null, p.tiba), el("span", null, p.tujuan));
    const rute = el("div", "tiket-rute");
    rute.append(kiri, tengah, kanan);
    kartu.append(rute);
    kartu.append(el("p", "info-produk", p.lokasi + " · Kursi tersedia (contoh): " + p.kapasitas));
  } else if (jenis === "aktivitas") {
    kartu.append(el("p", "info-produk",
      p.lokasi + ", " + p.tujuan + " · Durasi " + p.durasi + " · Kuota " + p.kapasitas));
  } else if (jenis === "paket") {
    kartu.append(el("p", "info-produk",
      p.tujuan + " · " + p.durasi + " · Maks " + p.kapasitas + " peserta"));
  } else {
    const satuanKapasitas = jenis === "mobil" ? " penumpang" : " tamu";
    kartu.append(el("p", "info-produk",
      p.lokasi + ", " + p.tujuan + " · Kapasitas " + p.kapasitas + satuanKapasitas));
  }

  const fasilitas = el("div", "fasilitas");
  p.fasilitas.split(", ").slice(0, 4).forEach(f => fasilitas.append(el("span", "chip", f)));
  kartu.append(fasilitas, el("p", "deskripsi-produk", p.deskripsi));

  const harga = el("div", "harga", rupiah(p.harga));
  harga.append(el("span", "harga-satuan", p.satuan));

  const tombolDetail = el("button", "tombol tombol-garis", "Detail");
  tombolDetail.type = "button";
  tombolDetail.addEventListener("click", () => lihatDetailProduk(p.id));
  const tombolPilih = el("button", "tombol tombol-utama", "Pilih");
  tombolPilih.type = "button";
  tombolPilih.addEventListener("click", () => pilihProduk(p));
  const aksi = el("div", "tiket-aksi");
  aksi.append(tombolDetail, tombolPilih);

  const kaki = el("div", "tiket-kaki");
  kaki.append(harga, aksi);
  kartu.append(kaki);
  return kartu;
}

function tampilkanDaftar() {
  const konfig = KONFIG_LAYANAN[layanan.halaman];
  const grid = ambil("gridLayanan");
  grid.replaceChildren();

  ambil("jumlahLayanan").textContent = layanan.daftar.length + " produk";

  if (layanan.daftar.length === 0) {
    const pesan = layanan.filter
      ? "Tidak ada hasil yang cocok dengan pencarian ini."
      : "Belum ada data untuk kategori ini.";
    grid.append(el("p", "kosong", pesan));
    return;
  }
  layanan.daftar.forEach(p => grid.append(buatKartuProduk(p, konfig.jenisForm)));
}

// ---------- Memuat data ----------
async function muatDaftar() {
  try {
    const data = await panggilApi("/api/produk?kategori=" + encodeURIComponent(layanan.kategori));
    layanan.daftar = data.produk;
    layanan.filter = null;
    tampilkanDaftar();
    return true;
  } catch (error) {
    ambil("gridLayanan").replaceChildren(el("p", "kosong galat", pesanGalat(error)));
    return false;
  }
}

function bersihkanHasil() {
  ["logSortLayanan", "logCariLayanan"].forEach(id => ambil(id).replaceChildren());
  ["ringkasanSortLayanan", "ringkasanCariLayanan"].forEach(id => {
    ambil(id).hidden = true;
    ambil(id).textContent = "";
  });
  tampilkanGalat("");
}

// ---------- Searching (Linear Search di backend) ----------
async function eksekusiCari(filter) {
  const konfig = KONFIG_LAYANAN[layanan.halaman];
  const data = await panggilApi(
    "/api/produk/search?kategori=" + encodeURIComponent(layanan.kategori) +
    "&atribut=tujuan&kata=" + encodeURIComponent(filter.tujuan)
  );

  // Penyaringan tambahan hanya memengaruhi tampilan hasil
  let hasil = data.hasil;
  let keterangan = "";
  if (konfig.jenisForm === "kereta" && filter.asal) {
    hasil = hasil.filter(p => normal(p.asal) === normal(filter.asal));
    keterangan = " | Disaring kota asal: " + filter.asal;
  }
  if (konfig.jenisForm === "akomodasi") {
    hasil = hasil.filter(p => p.kapasitas * filter.kamar >= filter.tamu);
    keterangan = " | Disaring kapasitas untuk " + filter.tamu + " tamu, " + filter.kamar + " kamar/unit";
  }
  if (konfig.jenisForm === "aktivitas" || konfig.jenisForm === "paket") {
    hasil = hasil.filter(p => p.kapasitas >= filter.jumlah);
    keterangan = " | Disaring kuota untuk " + filter.jumlah +
      (konfig.jenisForm === "aktivitas" ? " tiket" : " peserta");
  }

  layanan.filter = filter;
  layanan.daftar = hasil;
  tampilkanLog("logCariLayanan", data.log);

  const ringkasan = ambil("ringkasanCariLayanan");
  ringkasan.hidden = false;
  ringkasan.textContent =
    "Elemen diperiksa: " + data.diperiksa +
    " | Ditemukan Linear Search: " + data.ditemukan + keterangan +
    " | Ditampilkan: " + hasil.length;
  tampilkanDaftar();
}

async function cariLayanan() {
  tampilkanGalat("");
  const konfig = KONFIG_LAYANAN[layanan.halaman];
  const nilai = validasiForm(konfig.jenisForm, true);
  if (!nilai.ok) {
    tampilkanGalat(nilai.pesan);
    return;
  }
  try {
    await eksekusiCari(nilai);
  } catch (error) {
    tampilkanGalat(pesanGalat(error));
  }
}

// ---------- Sorting (Bubble Sort di backend) ----------
async function urutkanLayanan(urutan) {
  tampilkanGalat("");
  try {
    const data = await panggilApi(
      "/api/produk/sort?kategori=" + encodeURIComponent(layanan.kategori) + "&urutan=" + urutan,
      { method: "POST" }
    );
    tampilkanLog("logSortLayanan", data.log);

    // Jika sedang menampilkan hasil pencarian, jalankan ulang pencarian pada urutan baru
    if (layanan.filter) {
      layanan.daftar = data.produk;
      await eksekusiCari(layanan.filter);
    } else {
      layanan.daftar = data.produk;
      tampilkanDaftar();
    }

    const ringkasan = ambil("ringkasanSortLayanan");
    ringkasan.hidden = false;
    ringkasan.textContent =
      "Bubble Sort " + urutan + " | Perbandingan: " + data.perbandingan +
      " | Pertukaran: " + data.pertukaran + " | Jumlah pass: " + data.jumlahPass;
  } catch (error) {
    tampilkanGalat(pesanGalat(error));
  }
}

async function resetLayanan() {
  tampilkanGalat("");
  try {
    await panggilApi("/api/produk/reset?kategori=" + encodeURIComponent(layanan.kategori), { method: "POST" });
    bersihkanHasil();
    await muatDaftar();
  } catch (error) {
    tampilkanGalat(pesanGalat(error));
  }
}

async function tampilkanSemua() {
  ambil("ringkasanCariLayanan").hidden = true;
  ambil("logCariLayanan").replaceChildren();
  tampilkanGalat("");
  await muatDaftar();
}

// ---------- Detail produk (memakai pointer di backend) ----------
async function lihatDetailProduk(id) {
  try {
    const p = await panggilApi("/api/produk/detail?id=" + id);
    isiDetail.replaceChildren();
    isiDetail.append(el("h3", null, p.nama));

    let labelKapasitas = "Kapasitas";
    if (p.kategori === "aktivitas") labelKapasitas = "Kuota";
    if (p.kategori === "paket") labelKapasitas = "Maks peserta";

    const baris = [
      ["Kategori", NAMA_KATEGORI[p.kategori] || p.kategori],
      ["Lokasi", p.lokasi + ", " + p.tujuan],
      ["Jenis", p.tipe],
      [labelKapasitas, String(p.kapasitas)],
      ["Harga", rupiah(p.harga) + " " + p.satuan],
      ["Fasilitas", p.fasilitas],
      ["Alamat memori", "0x" + p.alamat_memori.toString(16).toUpperCase()]
    ];
    if (p.kategori === "kereta") {
      baris.splice(2, 0, ["Rute", p.asal + " → " + p.tujuan], ["Jadwal", p.berangkat + " – " + p.tiba + " (" + p.durasi + ")"]);
    }
    if (p.kategori === "aktivitas" || p.kategori === "paket") {
      baris.splice(2, 0, ["Durasi", p.durasi]);
    }

    const daftar = el("dl", "detail-daftar");
    baris.forEach(([nama, nilai]) => daftar.append(el("dt", null, nama), el("dd", null, nilai)));

    isiDetail.append(
      daftar,
      el("p", "catatan", p.deskripsi),
      el("p", "catatan", "Data diambil oleh fungsi C++ cariProdukById() yang mengembalikan pointer ke elemen array daftarProduk.")
    );
    dialogDetail.showModal();
  } catch (error) {
    alert(pesanGalat(error));
  }
}

// ---------- Memilih produk (ringkasan pesanan) ----------
function pilihProduk(p) {
  const konfig = KONFIG_LAYANAN[layanan.halaman];
  const jenis = konfig.jenisForm;

  const nilai = validasiForm(jenis, false);
  if (!nilai.ok) {
    tampilkanGalat(nilai.pesan + " Lengkapi form di atas sebelum memilih.");
    ambil("formLayanan").scrollIntoView({ behavior: "smooth" });
    return;
  }
  tampilkanGalat("");

  const kategoriNama = NAMA_KATEGORI[p.kategori] || p.kategori;

  if (jenis === "kereta") {
    bukaRingkasan({
      kategori: kategoriNama,
      nama: p.nama,
      rincian: [
        ["Rute", p.asal + " → " + p.tujuan],
        ["Stasiun", p.lokasi],
        ["Kelas", p.tipe],
        ["Tanggal berangkat", nilai.tanggal ? nilai.tanggal : "Belum dipilih"],
        ["Berangkat", p.berangkat],
        ["Tiba", p.tiba],
        ["Durasi", p.durasi]
      ],
      hargaSatuan: p.harga,
      satuan: "penumpang",
      jumlahMaks: 9
    });
  } else if (jenis === "mobil") {
    bukaRingkasan({
      kategori: kategoriNama,
      nama: p.nama,
      rincian: [
        ["Lokasi", p.lokasi + ", " + p.tujuan],
        ["Transmisi", p.tipe],
        ["Kapasitas", p.kapasitas + " penumpang"],
        ["Pengambilan", nilai.ambil],
        ["Pengembalian", nilai.kembali],
        ["Durasi sewa", nilai.hari + " hari"]
      ],
      hargaSatuan: p.harga,
      satuan: "hari",
      jumlahAwal: nilai.hari,
      jumlahTetap: true
    });
  } else if (jenis === "aktivitas") {
    if (nilai.jumlah > p.kapasitas) {
      tampilkanGalat("Jumlah tiket (" + nilai.jumlah + ") melebihi kuota " + p.kapasitas + " untuk " + p.nama + ".");
      return;
    }
    bukaRingkasan({
      kategori: kategoriNama,
      nama: p.nama,
      rincian: [
        ["Lokasi", p.lokasi + ", " + p.tujuan],
        ["Jenis", p.tipe],
        ["Tanggal kunjungan", nilai.tanggal],
        ["Durasi", p.durasi]
      ],
      hargaSatuan: p.harga,
      satuan: "tiket",
      jumlahAwal: nilai.jumlah,
      jumlahMaks: p.kapasitas
    });
  } else if (jenis === "paket") {
    if (nilai.jumlah > p.kapasitas) {
      tampilkanGalat("Jumlah peserta (" + nilai.jumlah + ") melebihi batas " + p.kapasitas + " peserta untuk " + p.nama + ".");
      return;
    }
    bukaRingkasan({
      kategori: kategoriNama,
      nama: p.nama,
      rincian: [
        ["Destinasi", p.tujuan],
        ["Area", p.lokasi],
        ["Tema", p.tipe],
        ["Durasi", p.durasi],
        ["Tanggal berangkat", nilai.tanggal],
        ["Fasilitas", p.fasilitas]
      ],
      hargaSatuan: p.harga,
      satuan: "orang",
      jumlahAwal: nilai.jumlah,
      jumlahMaks: p.kapasitas
    });
  } else {
    bukaRingkasan({
      kategori: kategoriNama,
      nama: p.nama,
      rincian: [
        ["Lokasi", p.lokasi + ", " + p.tujuan],
        ["Jenis", p.tipe],
        ["Check-in", nilai.masuk],
        ["Check-out", nilai.keluar],
        ["Menginap", nilai.malam + " malam"],
        ["Tamu", String(nilai.tamu)],
        ["Kamar/unit", String(nilai.kamar)]
      ],
      hargaSatuan: p.harga,
      satuan: "malam-kamar",
      jumlahAwal: nilai.malam * nilai.kamar,
      jumlahTetap: true
    });
  }
}

// ---------- Tab kategori (khusus Hotel) ----------
function bangunTab(konfig) {
  const wadah = ambil("tabLayanan");
  wadah.replaceChildren();
  if (konfig.tab.length < 2) return;

  konfig.tab.forEach(t => {
    const tombol = el("button", "tab" + (t.kategori === layanan.kategori ? " aktif" : ""), t.nama);
    tombol.type = "button";
    tombol.addEventListener("click", async () => {
      if (layanan.kategori === t.kategori) return;
      layanan.kategori = t.kategori;
      wadah.querySelectorAll(".tab").forEach(b => b.classList.toggle("aktif", b === tombol));
      bersihkanHasil();
      await muatDaftar();
    });
    wadah.append(tombol);
  });
}

// ---------- Dipanggil navigasi.js saat halaman dibuka ----------
async function bukaHalamanLayanan(nama) {
  if (layanan.halaman === nama) return;   // pertahankan isian form jika kembali ke halaman yang sama

  const konfig = KONFIG_LAYANAN[nama];
  layanan.halaman = nama;
  layanan.kategori = konfig.tab[0].kategori;
  layanan.filter = null;
  layanan.daftar = [];

  ambil("judulLayanan").textContent = konfig.judul;
  ambil("deskLayanan").textContent = konfig.deskripsi;
  bangunTab(konfig);
  bangunForm(konfig.jenisForm);
  bersihkanHasil();

  const berhasil = await muatDaftar();
  if (!berhasil) layanan.halaman = null;   // coba lagi saat halaman dibuka berikutnya
}

// ---------- Pasang event ----------
ambil("formLayanan").addEventListener("submit", (e) => {
  e.preventDefault();
  cariLayanan();
});
ambil("urutMurahLayanan").addEventListener("click", () => urutkanLayanan("termurah"));
ambil("urutMahalLayanan").addEventListener("click", () => urutkanLayanan("termahal"));
ambil("resetLayanan").addEventListener("click", resetLayanan);
ambil("semuaLayanan").addEventListener("click", tampilkanSemua);