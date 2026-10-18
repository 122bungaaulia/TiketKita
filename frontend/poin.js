"use strict";

// Halaman Poin & Reward (simulasi).
// Poin dihitung dari pesanan berstatus "Berhasil" di Pesanan Saya (data localStorage).
// Penukaran reward disimpan terpisah di localStorage.
// Memakai fungsi dari script.js (el, rupiah) dan pesanan.js (bacaPesanan, STATUS_BERHASIL).

const KUNCI_TUKAR = "tiketkita_poin_tukar";
const NILAI_PER_POIN = 10000;   // 1 poin untuk setiap Rp10.000 total pesanan

const DAFTAR_REWARD = [
  { nama: "Kupon Diskon Rp10.000", biaya: 50, deskripsi: "Kupon contoh bernilai Rp10.000." },
  { nama: "Kupon Diskon Rp25.000", biaya: 125, deskripsi: "Kupon contoh bernilai Rp25.000." },
  { nama: "Kupon Diskon Rp50.000", biaya: 250, deskripsi: "Kupon contoh bernilai Rp50.000." },
  { nama: "Kupon Diskon Rp100.000", biaya: 500, deskripsi: "Kupon contoh bernilai Rp100.000." }
];

function ambilPoin(id) {
  return document.getElementById(id);
}

// ---------- Penyimpanan kupon yang sudah ditukar ----------
function bacaTukar() {
  try {
    const mentah = localStorage.getItem(KUNCI_TUKAR);
    return mentah ? JSON.parse(mentah) : [];
  } catch (error) {
    return [];
  }
}

function tulisTukar(daftar) {
  try {
    localStorage.setItem(KUNCI_TUKAR, JSON.stringify(daftar));
    return true;
  } catch (error) {
    return false;
  }
}

// ---------- Perhitungan poin ----------
// Poin masuk berasal dari pesanan Berhasil. Saldo = terkumpul - terpakai (tidak kurang dari 0).
function hitungPoin() {
  const masuk = [];
  const semuaPesanan = bacaPesanan();
  for (const p of semuaPesanan) {
    if (p.status === STATUS_BERHASIL) {
      masuk.push({
        kode: p.kode,
        nama: p.nama,
        total: p.total,
        poin: Math.floor(p.total / NILAI_PER_POIN)
      });
    }
  }

  let terkumpul = 0;
  for (const m of masuk) {
    terkumpul += m.poin;
  }

  const tukar = bacaTukar();
  let terpakai = 0;
  for (const t of tukar) {
    terpakai += t.biaya;
  }

  return {
    masuk: masuk,
    tukar: tukar,
    terkumpul: terkumpul,
    terpakai: terpakai,
    saldo: Math.max(0, terkumpul - terpakai)
  };
}

// ---------- Menukar reward ----------
function tukarReward(reward) {
  const galat = ambilPoin("galatPoin");
  galat.textContent = "";

  const data = hitungPoin();
  if (data.saldo < reward.biaya) {
    galat.textContent = "Saldo poin tidak cukup untuk menukar " + reward.nama + ".";
    return;
  }
  if (!confirm("Tukar " + reward.biaya + " poin dengan " + reward.nama + "? (simulasi)")) {
    return;
  }

  const daftar = data.tukar;
  daftar.push({
    kode: "KP-" + String(daftar.length + 1).padStart(4, "0"),
    nama: reward.nama,
    biaya: reward.biaya,
    waktu: new Date().toLocaleString("id-ID")
  });

  if (!tulisTukar(daftar)) {
    galat.textContent = "Penyimpanan browser tidak tersedia, penukaran tidak dapat disimpan.";
    return;
  }
  renderPoin();
}

function resetKupon() {
  if (bacaTukar().length === 0) return;
  if (confirm("Hapus semua kupon hasil penukaran? Poin terpakai akan kembali ke saldo.")) {
    tulisTukar([]);
    renderPoin();
  }
}

// ---------- Tampilan ----------
function buatItemRiwayat(teksKiri, teksKanan, kelasKanan) {
  const item = el("li", "item-riwayat");
  item.append(el("span", null, teksKiri), el("span", kelasKanan, teksKanan));
  return item;
}

// Dipanggil navigasi.js setiap kali halaman Poin dibuka
function renderPoin() {
  const data = hitungPoin();

  ambilPoin("galatPoin").textContent = "";
  ambilPoin("angkaSaldo").textContent = String(data.saldo);
  ambilPoin("poinTerkumpul").textContent = "Terkumpul: " + data.terkumpul + " poin";
  ambilPoin("poinTerpakai").textContent = "Terpakai: " + data.terpakai + " poin";

  // Reward Zone
  const grid = ambilPoin("gridReward");
  grid.replaceChildren();
  DAFTAR_REWARD.forEach(r => {
    const kartu = el("article", "kartu kartu-reward");
    kartu.append(
      el("strong", null, r.nama),
      el("p", "deskripsi-kecil", r.deskripsi),
      el("p", "reward-biaya", r.biaya + " poin")
    );
    const tombol = el("button", "tombol tombol-utama", "Tukar");
    tombol.type = "button";
    tombol.disabled = data.saldo < r.biaya;
    tombol.addEventListener("click", () => tukarReward(r));
    kartu.append(tombol);
    grid.append(kartu);
  });

  // Poin masuk (terbaru di atas)
  const daftarMasuk = ambilPoin("daftarPoinMasuk");
  daftarMasuk.replaceChildren();
  if (data.masuk.length === 0) {
    daftarMasuk.append(el("li", "kosong",
      "Belum ada pesanan berstatus Berhasil. Konfirmasi pesanan di Pesanan Saya untuk mendapat poin."));
  } else {
    data.masuk.slice().reverse().forEach(m => {
      daftarMasuk.append(buatItemRiwayat(
        m.kode + " · " + m.nama + " · " + rupiah(m.total),
        "+" + m.poin + " poin",
        "poin-plus"
      ));
    });
  }

  // Kupon yang sudah ditukar (terbaru di atas)
  const daftarKupon = ambilPoin("daftarKupon");
  daftarKupon.replaceChildren();
  if (data.tukar.length === 0) {
    daftarKupon.append(el("li", "kosong", "Belum ada kupon yang ditukar."));
  } else {
    data.tukar.slice().reverse().forEach(t => {
      daftarKupon.append(buatItemRiwayat(
        t.kode + " · " + t.nama + " · " + t.waktu,
        "-" + t.biaya + " poin",
        "poin-minus"
      ));
    });
  }
}

ambilPoin("tombolResetKupon").addEventListener("click", resetKupon);