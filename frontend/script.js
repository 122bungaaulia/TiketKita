"use strict";

// ---------- Elemen halaman ----------
const menuTombol = document.getElementById("menuTombol");
const menu = document.getElementById("menu");
const formCari = document.getElementById("formCari");
const galatForm = document.getElementById("galatForm");
const jumlahTiketTeks = document.getElementById("jumlahTiketTeks");
const ringkasanSort = document.getElementById("ringkasanSort");
const ringkasanSortPesawat = document.getElementById("ringkasanSortPesawat");
const ringkasanCari = document.getElementById("ringkasanCari");
const pesanCari = document.getElementById("pesanCari");
const inputCariPanel = document.getElementById("inputCariPanel");
const dialogDetail = document.getElementById("dialogDetail");
const isiDetail = document.getElementById("isiDetail");
const batangWadah = document.getElementById("batangWadah");
const keteranganVisual = document.getElementById("keteranganVisual");
const pilihKecepatan = document.getElementById("kecepatan");
const hasilPesawatWadah = document.getElementById("hasilPesawatWadah");
const ringkasanPesawat = document.getElementById("ringkasanPesawat");

// ---------- Fungsi bantu ----------
// Membuat elemen dengan teks (memakai textContent agar aman dari HTML liar)
function el(tag, kelas, teks) {
  const elemen = document.createElement(tag);
  if (kelas) elemen.className = kelas;
  if (teks !== undefined) elemen.textContent = teks;
  return elemen;
}

function rupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

function normal(teks) {
  return teks.trim().toLowerCase();
}

function tidur(ms) {
  return new Promise(selesai => setTimeout(selesai, ms));
}

function pesanGalat(error) {
  if (error instanceof TypeError) {
    return "Backend tidak terhubung. Pastikan tiketkita.exe sedang berjalan.";
  }
  return error.message;
}

// Memanggil API backend C++ dan mengembalikan JSON-nya
async function panggilApi(url, opsi) {
  const respons = await fetch(url, opsi);
  const data = await respons.json();
  if (!respons.ok) {
    throw new Error(data.galat || "Terjadi kesalahan pada server.");
  }
  return data;
}

// ---------- Menampilkan data ----------
function buatKartu(t) {
  const kartu = el("article", "kartu-tiket");

  // buatFoto() ada di foto.js
  kartu.append(buatFoto(["gambar/pesawat.jpg"], "pesawat", "Pesawat " + t.maskapai));

  const kepala = el("div", "tiket-kepala");
  kepala.append(el("span", "maskapai", t.maskapai), el("span", "chip", t.kode));

  const kiri = el("div", "titik");
  kiri.append(el("strong", null, t.berangkat), el("span", null, t.asal));
  const tengah = el("div", "tengah");
  tengah.append(el("span", "durasi", t.durasi), el("span", "garis-rute"));
  const kanan = el("div", "titik kanan");
  kanan.append(el("strong", null, t.tiba), el("span", null, t.tujuan));
  const rute = el("div", "tiket-rute");
  rute.append(kiri, tengah, kanan);

  const tombolDetail = el("button", "tombol tombol-garis", "Detail");
  tombolDetail.type = "button";
  tombolDetail.addEventListener("click", () => bukaDetail(t.id));

  // pilihTiketPesawat() ada di pesanan.js
  const tombolPilih = el("button", "tombol tombol-utama", "Pilih Tiket");
  tombolPilih.type = "button";
  tombolPilih.addEventListener("click", () => pilihTiketPesawat(t));

  const aksi = el("div", "tiket-aksi");
  aksi.append(tombolDetail, tombolPilih);

  const kaki = el("div", "tiket-kaki");
  kaki.append(el("div", "harga", rupiah(t.harga)), aksi);

  kartu.append(kepala, rute, kaki);
  return kartu;
}

function renderKartu(idWadah, daftar, pesanKosong) {
  const wadah = document.getElementById(idWadah);
  wadah.replaceChildren();
  if (daftar.length === 0) {
    if (pesanKosong) wadah.append(el("p", "kosong", pesanKosong));
    return;
  }
  daftar.forEach(t => wadah.append(buatKartu(t)));
}

function tampilkanLog(idKotak, log) {
  const kotak = document.getElementById(idKotak);
  kotak.replaceChildren();
  log.forEach(b => kotak.append(el("div", "baris " + b.tipe, b.teks)));
  kotak.scrollTop = 0;
}

// ---------- Memuat data awal ----------
async function muatTiket() {
  try {
    const data = await panggilApi("/api/tiket");
    renderKartu("daftarKartu", data.tiket);
    jumlahTiketTeks.textContent = data.jumlah + " tiket";
  } catch (error) {
    const wadah = document.getElementById("daftarKartu");
    wadah.replaceChildren(el("p", "kosong galat", pesanGalat(error)));
  }
}

// ---------- Visualisasi Bubble Sort ----------
// Animasi hanya memutar ulang rekaman langkah dari backend C++.
// Hasil akhir tidak dihitung ulang di sini.
let idAnimasi = 0;          // setiap animasi baru memiliki nomor; animasi lama berhenti
let dataSortTerakhir = null;

function siapkanPeta(data) {
  const peta = {};
  data.tiket.forEach(t => { peta[t.id] = t; });
  const hargaMaks = Math.max(...data.tiket.map(t => t.harga));
  return { peta, hargaMaks };
}

// Menggambar batang. sorot = { posisi, tukar } atau null.
function gambarBatang(urutanId, peta, hargaMaks, sorot, jumlahTerurut) {
  batangWadah.replaceChildren();
  urutanId.forEach((id, indeks) => {
    const t = peta[id];
    const batang = el("div", "batang");
    batang.style.height = ((t.harga / hargaMaks) * 80) + "%";

    if (indeks >= urutanId.length - jumlahTerurut) {
      batang.classList.add("terurut");
    }
    if (sorot && (indeks === sorot.posisi || indeks === sorot.posisi + 1)) {
      batang.classList.add(sorot.tukar ? "bertukar" : "dibandingkan");
    }

    const kolom = el("div", "kolom-batang");
    kolom.append(
      el("span", "batang-harga", Math.round(t.harga / 1000) + "K"),
      batang,
      el("span", "batang-kode", t.kode)
    );
    batangWadah.append(kolom);
  });
}

function tampilkanHasilAkhir(data) {
  const { peta, hargaMaks } = siapkanPeta(data);
  const urutanAkhir = data.tiket.map(t => t.id);
  gambarBatang(urutanAkhir, peta, hargaMaks, null, urutanAkhir.length);
  keteranganVisual.textContent = "Sorting selesai. Semua tiket sudah berada di posisi akhir.";
}

async function putarAnimasi(data) {
  const id = ++idAnimasi;
  const { peta, hargaMaks } = siapkanPeta(data);
  let sebelum = data.urutanAwal;

  gambarBatang(sebelum, peta, hargaMaks, null, 0);
  keteranganVisual.textContent = "Kondisi awal sebelum sorting.";
  await tidur(parseInt(pilihKecepatan.value, 10));

  for (const l of data.langkah) {
    if (id !== idAnimasi) return;   // dibatalkan (Lewati / Reset / sort baru)

    const jeda = parseInt(pilihKecepatan.value, 10);
    const kiri = peta[sebelum[l.posisi]];
    const kanan = peta[sebelum[l.posisi + 1]];

    // Frame 1: dua tiket dibandingkan
    gambarBatang(sebelum, peta, hargaMaks, { posisi: l.posisi, tukar: false }, l.jumlahTerurut);
    keteranganVisual.textContent =
      "Pass " + l.pass + ": bandingkan " + kiri.kode + " (" + rupiah(kiri.harga) + ") dengan " +
      kanan.kode + " (" + rupiah(kanan.harga) + ")";
    await tidur(jeda);
    if (id !== idAnimasi) return;

    // Frame 2: jika ditukar, tampilkan urutan setelah pertukaran
    if (l.tukar) {
      gambarBatang(l.urutanId, peta, hargaMaks, { posisi: l.posisi, tukar: true }, l.jumlahTerurut);
      keteranganVisual.textContent = "Tukar posisi " + kiri.kode + " dan " + kanan.kode + ".";
      await tidur(jeda);
    }

    sebelum = l.urutanId;
  }

  if (id !== idAnimasi) return;
  tampilkanHasilAkhir(data);
}

// ---------- Sorting ----------
async function jalankanSort(urutan) {
  try {
    const data = await panggilApi("/api/sort?urutan=" + urutan, { method: "POST" });

    // Hasil sebenarnya langsung tampil di kartu dan log
    renderKartu("daftarKartu", data.tiket);
    tampilkanLog("logSort", data.log);
    const teksRingkasan =
      "Perbandingan: " + data.perbandingan +
      " | Pertukaran: " + data.pertukaran +
      " | Jumlah pass: " + data.jumlahPass;
    ringkasanSort.textContent = teksRingkasan;
    ringkasanSortPesawat.textContent = teksRingkasan;
    ringkasanSortPesawat.hidden = false;

    // Animasi diputar sebagai visualisasi tambahan
    dataSortTerakhir = data;
    putarAnimasi(data);
  } catch (error) {
    ringkasanSort.textContent = pesanGalat(error);
    ringkasanSortPesawat.textContent = pesanGalat(error);
    ringkasanSortPesawat.hidden = false;
  }
}

async function resetUrutan() {
  try {
    const data = await panggilApi("/api/reset", { method: "POST" });
    idAnimasi++;                      // hentikan animasi yang sedang berjalan
    dataSortTerakhir = null;
    renderKartu("daftarKartu", data.tiket);
    document.getElementById("logSort").replaceChildren();
    batangWadah.replaceChildren();
    keteranganVisual.textContent = "Jalankan Bubble Sort untuk melihat animasinya.";
    ringkasanSort.textContent = "Urutan dikembalikan ke data awal.";
    ringkasanSortPesawat.hidden = true;
  } catch (error) {
    ringkasanSort.textContent = pesanGalat(error);
  }
}

// ---------- Searching ----------
// Mengembalikan { tampil, diperiksa, ditemukan } atau null jika gagal/tidak valid
async function jalankanPencarian(tujuan, asal) {
  pesanCari.textContent = "";

  if (!tujuan.trim()) {
    pesanCari.textContent = "Masukkan kota tujuan terlebih dahulu.";
    return null;
  }

  try {
    const data = await panggilApi("/api/search?tujuan=" + encodeURIComponent(tujuan));

    // Kota asal (jika diisi) hanya menyaring tampilan hasil Linear Search
    let hasil = data.hasil;
    let keterangan = "";
    if (asal && asal.trim()) {
      hasil = hasil.filter(t => normal(t.asal) === normal(asal));
      keterangan = " | Disaring kota asal: " + asal.trim() + " | Ditampilkan: " + hasil.length;
    }

    renderKartu("hasilCari", hasil);
    tampilkanLog("logCari", data.log);
    ringkasanCari.textContent =
      "Elemen diperiksa: " + data.diperiksa +
      " | Ditemukan Linear Search: " + data.ditemukan + keterangan;

    if (hasil.length === 0) {
      pesanCari.textContent = "Tiket tidak ditemukan untuk tujuan \"" + tujuan.trim() + "\".";
    }
    return { tampil: hasil, diperiksa: data.diperiksa, ditemukan: data.ditemukan, keterangan: keterangan };
  } catch (error) {
    pesanCari.textContent = pesanGalat(error);
    return null;
  }
}

// ---------- Detail tiket (memakai pointer di backend) ----------
async function bukaDetail(id) {
  try {
    const t = await panggilApi("/api/tiket/detail?id=" + id);
    isiDetail.replaceChildren();
    isiDetail.append(el("h3", null, t.maskapai + " · " + t.kode));

    const daftar = el("dl", "detail-daftar");
    [
      ["Rute", t.asal + " → " + t.tujuan],
      ["Berangkat", t.berangkat],
      ["Tiba", t.tiba],
      ["Durasi", t.durasi],
      ["Harga", rupiah(t.harga)],
      ["Alamat memori", "0x" + t.alamat_memori.toString(16).toUpperCase()]
    ].forEach(([nama, nilai]) => daftar.append(el("dt", null, nama), el("dd", null, nilai)));

    isiDetail.append(
      daftar,
      el("p", "catatan",
        "Detail diambil oleh fungsi C++ cariTiketById() yang mengembalikan pointer ke elemen array daftarTiket.")
    );
    dialogDetail.showModal();
  } catch (error) {
    alert(pesanGalat(error));
  }
}

// ---------- Pasang event ----------
menuTombol.addEventListener("click", () => {
  const terbuka = menu.classList.toggle("terbuka");
  menuTombol.setAttribute("aria-expanded", String(terbuka));
});
menu.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => menu.classList.remove("terbuka"))
);

document.querySelectorAll("[data-urutan]").forEach(tombol =>
  tombol.addEventListener("click", () => jalankanSort(tombol.dataset.urutan))
);
document.querySelectorAll(".aksi-reset").forEach(tombol =>
  tombol.addEventListener("click", resetUrutan)
);

document.getElementById("tombolUlang").addEventListener("click", () => {
  if (dataSortTerakhir) putarAnimasi(dataSortTerakhir);
});
document.getElementById("tombolLewati").addEventListener("click", () => {
  if (dataSortTerakhir) {
    idAnimasi++;                      // hentikan animasi, langsung tampilkan hasil akhir
    tampilkanHasilAkhir(dataSortTerakhir);
  }
});

formCari.addEventListener("submit", async (e) => {
  e.preventDefault();
  galatForm.textContent = "";

  const asal = document.getElementById("inputAsal").value;
  const tujuan = document.getElementById("inputTujuan").value;

  if (!tujuan.trim()) {
    galatForm.textContent = "Masukkan kota tujuan terlebih dahulu.";
    return;
  }
  if (asal.trim() && normal(asal) === normal(tujuan)) {
    galatForm.textContent = "Kota asal dan kota tujuan tidak boleh sama.";
    return;
  }

  inputCariPanel.value = tujuan;
  const hasilData = await jalankanPencarian(tujuan, asal);
  if (hasilData === null) {
    galatForm.textContent = pesanCari.textContent;
    return;
  }

  // Tampilkan hasil langsung di halaman Pesawat
  hasilPesawatWadah.hidden = false;
  renderKartu("hasilPesawat", hasilData.tampil);
  ringkasanPesawat.textContent =
    "Elemen diperiksa: " + hasilData.diperiksa +
    " | Ditemukan Linear Search: " + hasilData.ditemukan + hasilData.keterangan;
  if (hasilData.tampil.length === 0) {
    ringkasanPesawat.textContent += " | Tiket tidak ditemukan untuk pencarian ini.";
  }
  hasilPesawatWadah.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("tombolCariPanel").addEventListener("click", () =>
  jalankanPencarian(inputCariPanel.value, "")
);
inputCariPanel.addEventListener("keydown", (e) => {
  if (e.key === "Enter") jalankanPencarian(inputCariPanel.value, "");
});

document.getElementById("tutupDetail").addEventListener("click", () => dialogDetail.close());

// ---------- Mulai ----------
muatTiket();