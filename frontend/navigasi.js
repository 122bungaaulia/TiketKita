"use strict";

// Perpindahan tampilan memakai hash di alamat, mis. #/pesawat.
// renderPesanan() berasal dari pesanan.js, bukaHalamanLayanan() dari layanan.js,
// bukaDiscovery() dari discovery.js, renderPoin() dari poin.js.

const HALAMAN_VALID = [
  "beranda", "pesawat", "kereta", "mobil", "hotel",
  "aktivitas", "paket", "discovery", "pesanan", "poin", "demo"
];
const HALAMAN_LAYANAN = ["pesawat", "kereta", "mobil", "hotel", "aktivitas", "paket", "discovery"];
const HALAMAN_GENERIK = ["kereta", "mobil", "hotel", "aktivitas", "paket"];

const dropdownTombol = document.getElementById("dropdownTombol");
const dropdownIsi = document.getElementById("dropdownIsi");

function tampilkanHalaman() {
  let nama = location.hash.replace(/^#\//, "");
  if (!HALAMAN_VALID.includes(nama)) nama = "beranda";

  document.querySelectorAll(".halaman").forEach(h => {
    h.classList.toggle("aktif", h.dataset.halaman.split(" ").includes(nama));
  });

  if (HALAMAN_GENERIK.includes(nama)) bukaHalamanLayanan(nama);
  if (nama === "discovery") bukaDiscovery();

  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.dataset.nav === nama) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  dropdownTombol.classList.toggle("aktif", HALAMAN_LAYANAN.includes(nama));

  if (nama === "pesanan") renderPesanan();
  if (nama === "poin") renderPoin();
  window.scrollTo(0, 0);
}

// ---------- Dropdown Layanan ----------
function tutupDropdown() {
  dropdownIsi.classList.remove("terbuka");
  dropdownTombol.setAttribute("aria-expanded", "false");
}

dropdownTombol.addEventListener("click", (e) => {
  e.stopPropagation();
  const terbuka = dropdownIsi.classList.toggle("terbuka");
  dropdownTombol.setAttribute("aria-expanded", String(terbuka));
});
document.addEventListener("click", tutupDropdown);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") tutupDropdown();
});

window.addEventListener("hashchange", tampilkanHalaman);
tampilkanHalaman();