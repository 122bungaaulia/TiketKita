"use strict";

// Pesanan disimpan di localStorage browser (simulasi, tanpa pembayaran sungguhan).
// Fungsi el() dan rupiah() berasal dari script.js.

const KUNCI_PESANAN = "tiketkita_pesanan";
const KUNCI_NOMOR = "tiketkita_nomor_pesanan";

const STATUS_MENUNGGU = "Menunggu konfirmasi";
const STATUS_BERHASIL = "Berhasil";
const STATUS_BATAL = "Dibatalkan";

const dialogRingkasan = document.getElementById("dialogRingkasan");
const isiRingkasan = document.getElementById("isiRingkasan");
const daftarPesananEl = document.getElementById("daftarPesanan");
const ringkasanPesananEl = document.getElementById("ringkasanPesanan");

// ---------- Penyimpanan ----------
function bacaPesanan() {
  try {
    const mentah = localStorage.getItem(KUNCI_PESANAN);
    return mentah ? JSON.parse(mentah) : [];
  } catch (error) {
    return [];
  }
}

function tulisPesanan(daftar) {
  try {
    localStorage.setItem(KUNCI_PESANAN, JSON.stringify(daftar));
    return true;
  } catch (error) {
    return false;
  }
}

// Nomor pesanan bertambah terus: TK-0001, TK-0002, ...
function kodePesananBaru() {
  try {
    const nomor = parseInt(localStorage.getItem(KUNCI_NOMOR) || "0", 10) + 1;
    localStorage.setItem(KUNCI_NOMOR, String(nomor));
    return "TK-" + String(nomor).padStart(4, "0");
  } catch (error) {
    return null;
  }
}

function simpanPesananBaru(pesanan) {
  const kode = kodePesananBaru();
  if (kode === null) return false;
  pesanan.kode = kode;
  const daftar = bacaPesanan();
  daftar.push(pesanan);
  return tulisPesanan(daftar);
}

// ---------- Dialog ringkasan (dipakai semua layanan) ----------
// opsi: { kategori, nama, rincian: [[label, nilai], ...], hargaSatuan, satuan,
//         jumlahMaks, jumlahAwal, jumlahTetap }
// jumlahTetap = true berarti jumlah dihitung dari tanggal dan tidak dapat diubah manual.
function bukaRingkasan(opsi) {
  const awal = opsi.jumlahAwal || 1;
  const maks = Math.max(opsi.jumlahMaks || 9, awal);

  isiRingkasan.replaceChildren();
  isiRingkasan.append(
    el("h3", null, "Ringkasan Pesanan"),
    el("p", "catatan", opsi.kategori + " · " + opsi.nama)
  );

  const daftar = el("dl", "detail-daftar");
  opsi.rincian.forEach(([nama, nilai]) => daftar.append(el("dt", null, nama), el("dd", null, nilai)));
  isiRingkasan.append(daftar);

  const kolomJumlah = el("div", "kolom");
  const label = el("label", null,
    "Jumlah " + opsi.satuan + (opsi.jumlahTetap ? " (dihitung dari tanggal yang dipilih)" : ""));
  label.htmlFor = "inputJumlahPesanan";
  const input = document.createElement("input");
  input.type = "number";
  input.id = "inputJumlahPesanan";
  input.min = "1";
  input.max = String(maks);
  input.value = String(awal);
  if (opsi.jumlahTetap) input.readOnly = true;
  kolomJumlah.append(label, input);

  const rincianBiaya = el("div", "rincian-biaya");
  const galat = el("p", "galat");

  const tombolBuat = el("button", "tombol tombol-utama", "Buat Pesanan (simulasi)");
  tombolBuat.type = "button";
  const tombolBatal = el("button", "tombol tombol-garis", "Batal");
  tombolBatal.type = "button";
  const aksi = el("div", "aksi-dialog");
  aksi.append(tombolBuat, tombolBatal);

  // Menghitung total; mengembalikan jumlah jika valid, selain itu null
  function hitung() {
    const jumlah = Number(input.value);
    const valid = Number.isInteger(jumlah) && jumlah >= 1 && jumlah <= maks;
    galat.textContent = valid ? "" : "Jumlah harus bilangan bulat 1 sampai " + maks + ".";
    tombolBuat.disabled = !valid;
    rincianBiaya.replaceChildren();
    if (!valid) return null;

    const total = opsi.hargaSatuan * jumlah;
    [
      ["Harga per " + opsi.satuan, rupiah(opsi.hargaSatuan), ""],
      ["Jumlah", jumlah + " " + opsi.satuan, ""],
      ["Total", rupiah(total), " total"]
    ].forEach(([nama, nilai, tambahan]) => {
      const baris = el("div", "baris-biaya" + tambahan);
      baris.append(el("span", null, nama), el("span", null, nilai));
      rincianBiaya.append(baris);
    });
    return jumlah;
  }

  input.addEventListener("input", hitung);

  tombolBuat.addEventListener("click", () => {
    const jumlah = hitung();
    if (jumlah === null) return;

    const pesanan = {
      kode: "",
      kategori: opsi.kategori,
      nama: opsi.nama,
      rincian: opsi.rincian,
      jumlah: jumlah,
      satuan: opsi.satuan,
      hargaSatuan: opsi.hargaSatuan,
      total: opsi.hargaSatuan * jumlah,
      status: STATUS_MENUNGGU,
      dibuat: new Date().toLocaleString("id-ID")
    };

    if (!simpanPesananBaru(pesanan)) {
      galat.textContent = "Penyimpanan browser tidak tersedia, pesanan tidak dapat disimpan.";
      return;
    }
    dialogRingkasan.close();
    location.hash = "#/pesanan";
  });

  tombolBatal.addEventListener("click", () => dialogRingkasan.close());

  isiRingkasan.append(
    kolomJumlah,
    rincianBiaya,
    galat,
    el("p", "catatan", "Simulasi: tidak ada pembayaran sungguhan. Diskon dan biaya tambahan belum diterapkan."),
    aksi
  );

  hitung();
  dialogRingkasan.showModal();
}

// ---------- Memilih tiket pesawat ----------
function pilihTiketPesawat(t) {
  const tanggal = document.getElementById("inputTanggal").value;
  bukaRingkasan({
    kategori: "Pesawat",
    nama: t.maskapai + " " + t.kode,
    rincian: [
      ["Rute", t.asal + " → " + t.tujuan],
      ["Tanggal berangkat", tanggal ? tanggal : "Belum dipilih"],
      ["Berangkat", t.berangkat],
      ["Tiba", t.tiba],
      ["Durasi", t.durasi]
    ],
    hargaSatuan: t.harga,
    satuan: "penumpang",
    jumlahMaks: 9
  });
}

// ---------- Halaman Pesanan Saya ----------
function ubahStatus(kode, statusBaru) {
  const daftar = bacaPesanan();
  const pesanan = daftar.find(p => p.kode === kode);
  // Hanya pesanan yang masih menunggu yang boleh diubah
  if (!pesanan || pesanan.status !== STATUS_MENUNGGU) return;
  pesanan.status = statusBaru;
  tulisPesanan(daftar);
  renderPesanan();
}

function buatKartuPesanan(p) {
  const kartu = el("article", "kartu kartu-pesanan");

  let kelasStatus = "status-menunggu";
  if (p.status === STATUS_BERHASIL) kelasStatus = "status-berhasil";
  if (p.status === STATUS_BATAL) kelasStatus = "status-batal";

  const kepala = el("div", "pesanan-kepala");
  kepala.append(el("strong", null, p.kode), el("span", "status-pesanan " + kelasStatus, p.status));

  kartu.append(
    kepala,
    el("p", "pesanan-nama", p.nama),
    el("p", "deskripsi-kecil", p.kategori + " · dibuat " + p.dibuat)
  );

  const daftar = el("dl", "detail-daftar");
  p.rincian.forEach(([nama, nilai]) => daftar.append(el("dt", null, nama), el("dd", null, nilai)));
  kartu.append(daftar);

  kartu.append(el("p", "pesanan-total",
    p.jumlah + " " + p.satuan + " × " + rupiah(p.hargaSatuan) + " = " + rupiah(p.total)));

  if (p.status === STATUS_MENUNGGU) {
    const aksi = el("div", "aksi-dialog");
    const tombolKonfirmasi = el("button", "tombol tombol-utama", "Konfirmasi (simulasi bayar)");
    tombolKonfirmasi.type = "button";
    tombolKonfirmasi.addEventListener("click", () => ubahStatus(p.kode, STATUS_BERHASIL));
    const tombolBatal = el("button", "tombol tombol-garis", "Batalkan");
    tombolBatal.type = "button";
    tombolBatal.addEventListener("click", () => {
      if (confirm("Batalkan pesanan " + p.kode + "?")) ubahStatus(p.kode, STATUS_BATAL);
    });
    aksi.append(tombolKonfirmasi, tombolBatal);
    kartu.append(aksi);
  }
  return kartu;
}

function renderPesanan() {
  const daftar = bacaPesanan();
  daftarPesananEl.replaceChildren();

  if (daftar.length === 0) {
    ringkasanPesananEl.hidden = true;
    daftarPesananEl.append(el("p", "kosong",
      "Belum ada pesanan. Pilih produk di salah satu layanan untuk membuat pesanan simulasi."));
    return;
  }

  const hitungStatus = (status) => daftar.filter(p => p.status === status).length;
  ringkasanPesananEl.hidden = false;
  ringkasanPesananEl.textContent =
    "Total " + daftar.length + " pesanan | Menunggu: " + hitungStatus(STATUS_MENUNGGU) +
    " | Berhasil: " + hitungStatus(STATUS_BERHASIL) +
    " | Dibatalkan: " + hitungStatus(STATUS_BATAL);

  // Pesanan terbaru di atas
  daftar.slice().reverse().forEach(p => daftarPesananEl.append(buatKartuPesanan(p)));
}

document.getElementById("tombolKosongkan").addEventListener("click", () => {
  if (bacaPesanan().length === 0) return;
  if (confirm("Hapus semua pesanan simulasi?")) {
    tulisPesanan([]);
    renderPesanan();
  }
});