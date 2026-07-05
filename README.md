# Revi & Irwan — Undangan Pernikahan Digital

Undangan pernikahan digital premium, dibangun dengan HTML, CSS, dan JavaScript murni (tanpa framework). Tema: **Elegant Minang Modern Luxury** — navy, gold, ivory, dengan sentuhan ornamen atap gonjong Minangkabau.

## Struktur Project

```
project/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── sw.js
├── assets/
│   ├── audio/
│   │   └── README.txt      (letakkan music.mp3 Anda di sini)
│   ├── images/
│   │   ├── ornament.svg
│   │   ├── cover-bg.svg
│   │   └── hero-bg.svg
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

## Cara Menjalankan Secara Lokal

Karena Service Worker & fetch memerlukan HTTP server (bukan `file://`), jalankan salah satu:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
```

Lalu buka `http://localhost:8000`.

## Kustomisasi Wajib Sebelum Digunakan

1. **Musik latar**: tambahkan file `music.mp3` ke `assets/audio/`. Jika tidak ada file, tombol musik tetap tampil namun tidak memutar apa pun (tidak error).
2. **Nomor rekening**: ganti nilai di `index.html` (elemen `#rekNumber` dan teks "NAMA PEMILIK REKENING") serta di `CONFIG.bankAccount` pada `script.js`.
3. **Nomor WhatsApp RSVP**: ganti `CONFIG.whatsappNumber` di `script.js` (format: kode negara tanpa `+`, contoh `6281234567890`).
4. **Foto mempelai**: saat ini menggunakan monogram huruf sebagai placeholder elegan. Untuk mengganti dengan foto asli, ubah `.couple__photo` di `style.css` menjadi `background-image` atau tambahkan tag `<img>` di dalam `.couple__photo` pada `index.html`.
5. **Tanggal & waktu acara**: ubah `CONFIG.eventDate` di `script.js` (format ISO 8601 dengan zona waktu, contoh `2026-07-17T10:00:00+07:00`).

## Fitur

- Nama tamu otomatis dari URL: `index.html?to=Nama%20Tamu`
- Countdown real-time (hari, jam, menit, detik)
- Profil mempelai, rangkaian acara (akad & resepsi), lokasi dengan tombol Google Maps + embed peta
- Wedding gift dengan tombol salin nomor rekening
- RSVP melalui WhatsApp dengan pesan otomatis
- Form ucapan & doa tersimpan di `localStorage` browser tamu (data tidak terkirim ke server mana pun)
- Floating navigation dengan active state saat scroll, smooth scroll
- Auto-scroll antar section yang berhenti otomatis saat tamu melakukan scroll/sentuh manual
- Progress bar, loader screen, animasi fade-in (IntersectionObserver), mendukung `prefers-reduced-motion`
- PWA-ready (manifest + service worker) sehingga dapat "Add to Home Screen"
- Sepenuhnya responsive: mobile (320px+), tablet, desktop, large desktop

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub, lalu unggah seluruh isi folder `project/` ke root repository (bukan di dalam subfolder).
2. Buka **Settings → Pages** pada repository.
3. Pilih source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Simpan. Situs akan tersedia di `https://<username>.github.io/<nama-repo>/` dalam beberapa menit.
5. Untuk mengirim ke tamu dengan nama otomatis, gunakan format:
   `https://<username>.github.io/<nama-repo>/?to=Nama%20Tamu`

## Catatan Privasi

Nomor rekening dan nomor WhatsApp pada file ini adalah **data dummy/placeholder**. Wajib diganti dengan data asli Anda sebelum undangan dibagikan. Data ucapan tamu disimpan lokal di perangkat masing-masing tamu (`localStorage`) dan tidak dikirim ke server atau pihak ketiga mana pun.

## Lisensi

Bebas digunakan dan dimodifikasi untuk keperluan pribadi.
