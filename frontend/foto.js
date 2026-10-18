"use strict";

// Foto untuk kartu layanan dan produk.
// File ini dimuat paling awal dan tidak bergantung pada file JavaScript lain.
//
// Sumber foto dicoba satu per satu:
//   1. gambar/produk/<id>.jpg   (opsional, foto khusus satu produk)
//   2. gambar/<kategori>.jpg    (opsional, foto umum satu kategori)
//   3. gambar/foto.jpg          (foto umum untuk semua layanan)
//   4. kotak ikon "Foto contoh" (jika tidak ada foto sama sekali)

const FOTO_UMUM = "gambar/foto.jpg";

// Ikon placeholder (string SVG tetap buatan sendiri, bukan data dari pengguna)
const ATRIBUT_SVG = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const IKON = {
  pesawat: '<svg ' + ATRIBUT_SVG + '><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>',
  kereta: '<svg ' + ATRIBUT_SVG + '><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/><circle cx="9" cy="14" r="0.8"/><circle cx="15" cy="14" r="0.8"/></svg>',
  mobil: '<svg ' + ATRIBUT_SVG + '><path d="M3 15l2-6a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 6v3h-3v-2H6v2H3z"/><circle cx="7.5" cy="13.5" r="0.8"/><circle cx="16.5" cy="13.5" r="0.8"/></svg>',
  hotel: '<svg ' + ATRIBUT_SVG + '><path d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16M16 10h3a1 1 0 0 1 1 1v10M2 21h20M8 8h4M8 12h4M8 16h4"/></svg>',
  vila: '<svg ' + ATRIBUT_SVG + '><path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg>',
  apartemen: '<svg ' + ATRIBUT_SVG + '><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>',
  aktivitas: '<svg ' + ATRIBUT_SVG + '><path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M13 6v12" stroke-dasharray="2 2"/></svg>',
  paket: '<svg ' + ATRIBUT_SVG + '><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/></svg>',
  discovery: '<svg ' + ATRIBUT_SVG + '><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>'
};

// Mengisi satu wadah dengan kotak placeholder dan foto di atasnya.
// Foto baru terlihat setelah berhasil dimuat; jika gagal, sumber berikutnya dicoba.
function isiFoto(wadah, sumber, kategori, alt) {
  const placeholder = document.createElement("div");
  placeholder.className = "gambar-placeholder";
  const ikon = document.createElement("span");
  ikon.className = "ikon-placeholder";
  ikon.innerHTML = IKON[kategori] || "";
  const label = document.createElement("span");
  label.className = "label-gambar";
  label.textContent = "Foto contoh";
  placeholder.append(ikon, label);
  wadah.append(placeholder);

  // Foto umum selalu menjadi sumber terakhir
  const daftarSumber = sumber.concat([FOTO_UMUM]);

  const gambar = document.createElement("img");
  gambar.className = "foto-gambar";
  gambar.alt = alt;

  let indeks = 0;
  function cobaBerikutnya() {
    if (indeks >= daftarSumber.length) {
      gambar.remove();   // tidak ada foto, placeholder tetap tampil
      return;
    }
    gambar.src = daftarSumber[indeks];
    indeks++;
  }
  gambar.addEventListener("load", () => gambar.classList.add("muncul"));
  gambar.addEventListener("error", cobaBerikutnya);

  wadah.append(gambar);
  cobaBerikutnya();
}

// Membuat wadah foto baru (dipakai kartu tiket dan kartu produk)
function buatFoto(sumber, kategori, alt) {
  const wadah = document.createElement("div");
  wadah.className = "foto-wadah";
  isiFoto(wadah, sumber, kategori, alt);
  return wadah;
}

// Kartu layanan di Beranda: elemen dengan atribut data-foto di index.html
document.querySelectorAll("[data-foto]").forEach(wadah => {
  const kategori = wadah.dataset.foto;
  isiFoto(wadah, ["gambar/" + kategori + ".jpg"], kategori, wadah.dataset.alt || kategori);
});