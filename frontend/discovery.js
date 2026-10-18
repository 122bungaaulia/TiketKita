"use strict";

// Halaman Discovery: menjelajah Aktivitas dan Paket Wisata berdasarkan tema.
// Setiap tema dicari dengan Linear Search pada atribut "tipe" di backend C++.
// Memakai fungsi dari foto.js (buatFoto), script.js (el, rupiah, panggilApi, pesanGalat,
// tampilkanLog) dan dari layanan.js (NAMA_KATEGORI, lihatDetailProduk).

const TEMA_DISCOVERY = ["Alam", "Pantai", "Keluarga", "Kuliner", "Budaya"];

const discovery = {
  siap: false   // true setelah tombol tema dibuat
};

function ambilDisc(id) {
  return document.getElementById(id);
}

// ---------- Kartu hasil ----------
function buatKartuDiscovery(p) {
  const kartu = el("article", "kartu-tiket kartu-produk");

  kartu.append(buatFoto(
    ["gambar/produk/" + p.id + ".jpg", "gambar/" + p.kategori + ".jpg"],
    p.kategori,
    p.nama
  ));

  const kepala = el("div", "tiket-kepala");
  kepala.append(el("span", "maskapai", p.nama), el("span", "chip", p.tipe));
  kartu.append(kepala);

  kartu.append(el("p", "info-produk",
    (NAMA_KATEGORI[p.kategori] || p.kategori) + " · " + p.tujuan + " · " + p.durasi));
  kartu.append(el("p", "deskripsi-produk", p.deskripsi));

  const harga = el("div", "harga", rupiah(p.harga));
  harga.append(el("span", "harga-satuan", p.satuan));

  const tombolDetail = el("button", "tombol tombol-garis", "Detail");
  tombolDetail.type = "button";
  tombolDetail.addEventListener("click", () => lihatDetailProduk(p.id));

  const tautan = el("a", "tombol tombol-utama",
    p.kategori === "paket" ? "Buka Paket" : "Buka Aktivitas");
  tautan.href = p.kategori === "paket" ? "#/paket" : "#/aktivitas";

  const aksi = el("div", "tiket-aksi");
  aksi.append(tombolDetail, tautan);

  const kaki = el("div", "tiket-kaki");
  kaki.append(harga, aksi);
  kartu.append(kaki);
  return kartu;
}

// ---------- Menjalankan pencarian tema ----------
async function jalankanDiscovery(tema) {
  const galat = ambilDisc("galatDiscovery");
  const grid = ambilDisc("gridDiscovery");
  const ringkasan = ambilDisc("ringkasanDiscovery");
  galat.textContent = "";

  try {
    // Dua kali Linear Search pada atribut "tipe": satu untuk aktivitas, satu untuk paket
    const dataAktivitas = await panggilApi(
      "/api/produk/search?kategori=aktivitas&atribut=tipe&kata=" + encodeURIComponent(tema)
    );
    const dataPaket = await panggilApi(
      "/api/produk/search?kategori=paket&atribut=tipe&kata=" + encodeURIComponent(tema)
    );

    const hasil = dataAktivitas.hasil.concat(dataPaket.hasil);

    tampilkanLog("logDiscAktivitas", dataAktivitas.log);
    tampilkanLog("logDiscPaket", dataPaket.log);

    ringkasan.hidden = false;
    ringkasan.textContent =
      "Tema: " + tema +
      " | Aktivitas diperiksa: " + dataAktivitas.diperiksa + ", ditemukan: " + dataAktivitas.ditemukan +
      " | Paket diperiksa: " + dataPaket.diperiksa + ", ditemukan: " + dataPaket.ditemukan +
      " | Total ditampilkan: " + hasil.length;
    ambilDisc("jumlahDiscovery").textContent = hasil.length + " hasil";

    grid.replaceChildren();
    if (hasil.length === 0) {
      grid.append(el("p", "kosong", "Belum ada aktivitas atau paket untuk tema " + tema + "."));
      return;
    }
    hasil.forEach(p => grid.append(buatKartuDiscovery(p)));
  } catch (error) {
    galat.textContent = pesanGalat(error);
  }
}

// ---------- Dipanggil navigasi.js saat halaman Discovery dibuka ----------
function bukaDiscovery() {
  if (discovery.siap) return;   // pertahankan tema yang sedang dipilih
  discovery.siap = true;

  const wadahTab = ambilDisc("tabTema");
  wadahTab.replaceChildren();
  TEMA_DISCOVERY.forEach(tema => {
    const tombol = el("button", "tab", tema);
    tombol.type = "button";
    tombol.addEventListener("click", () => {
      wadahTab.querySelectorAll(".tab").forEach(b => b.classList.toggle("aktif", b === tombol));
      jalankanDiscovery(tema);
    });
    wadahTab.append(tombol);
  });

  ambilDisc("gridDiscovery").replaceChildren(
    el("p", "kosong", "Pilih salah satu tema di atas untuk mulai menjelajah.")
  );
}