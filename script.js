// ====== ADAN PROJECT — shared script ======

// GANTI nomor WhatsApp di bawah ini dengan nomor aktif Adan
// Format internasional tanpa "+" dan tanpa spasi, contoh: 6281234567890
const WA_NUMBER = "6281234567890";

document.addEventListener("DOMContentLoaded", () => {
  // --- mobile nav toggle ---
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  // --- highlight active nav link ---
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // --- prefill layanan dari query string (dipakai di pesan.html) ---
  const select = document.getElementById("layanan");
  if (select) {
    const params = new URLSearchParams(location.search);
    const layanan = params.get("layanan");
    if (layanan) {
      const opt = [...select.options].find((o) => o.value === layanan);
      if (opt) select.value = layanan;
    }
  }

  // --- handle form pemesanan ---
  const form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const status = document.getElementById("statusMsg");

      if (!data.nama || !data.kontak || !data.layanan || !data.deskripsi) {
        status.textContent = "Mohon lengkapi Nama, Kontak, Jenis Layanan, dan Deskripsi Kebutuhan.";
        status.className = "show err";
        return;
      }

      const lines = [
        "Halo ADAN PROJECT, saya ingin memesan layanan:",
        "",
        `Nama: ${data.nama}`,
        `Kontak: ${data.kontak}`,
        `Jenis Layanan: ${data.layanan}`,
        `Deskripsi Kebutuhan: ${data.deskripsi}`,
        data.deadline ? `Target Selesai: ${data.deadline}` : null,
        data.budget ? `Estimasi Budget: ${data.budget}` : null,
      ].filter(Boolean);

      const message = lines.join("\n");
      window.lastOrderMessage = message;

      if (WA_NUMBER.includes("6281234567890")) {
        status.textContent = "Catatan: nomor WhatsApp belum diatur oleh pemilik website. Gunakan tombol \"Salin Ringkasan\" untuk sementara.";
        status.className = "show err";
        return;
      }

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
      status.textContent = "Membuka WhatsApp dengan ringkasan pesanan Anda...";
      status.className = "show ok";
      window.open(url, "_blank");
    });
  }

  // --- salin ringkasan (fallback tanpa WA) ---
  const copyBtn = document.getElementById("copySummaryBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const form = document.getElementById("orderForm");
      const data = Object.fromEntries(new FormData(form).entries());
      const status = document.getElementById("statusMsg");
      if (!data.nama || !data.kontak || !data.layanan || !data.deskripsi) {
        status.textContent = "Mohon lengkapi Nama, Kontak, Jenis Layanan, dan Deskripsi Kebutuhan.";
        status.className = "show err";
        return;
      }
      const lines = [
        "Halo ADAN PROJECT, saya ingin memesan layanan:",
        "",
        `Nama: ${data.nama}`,
        `Kontak: ${data.kontak}`,
        `Jenis Layanan: ${data.layanan}`,
        `Deskripsi Kebutuhan: ${data.deskripsi}`,
        data.deadline ? `Target Selesai: ${data.deadline}` : null,
        data.budget ? `Estimasi Budget: ${data.budget}` : null,
      ].filter(Boolean);
      navigator.clipboard.writeText(lines.join("\n")).then(() => {
        status.textContent = "Ringkasan pesanan disalin. Kirim ke kontak ADAN PROJECT melalui WhatsApp atau email.";
        status.className = "show ok";
      });
    });
  }
});
