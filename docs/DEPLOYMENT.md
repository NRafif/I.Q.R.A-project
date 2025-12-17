# 🚀 Tutorial Deploy ke Vercel - Dari Awal Sampai Akhir

Tutorial lengkap untuk deploy I.Q.R.A project ke Vercel, mulai dari push ke GitHub hingga production.

## 📋 Daftar Isi

1. [Persiapan](#1-persiapan)
2. [Push ke GitHub](#2-push-ke-github)
3. [Persiapan untuk Vercel](#3-persiapan-untuk-vercel)
4. [Deploy ke Vercel](#4-deploy-ke-vercel)
5. [Setup Environment Variables](#5-setup-environment-variables)
6. [Verifikasi Deploy](#6-verifikasi-deploy)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Persiapan

### 1.1 Pastikan Project Sudah Siap

Sebelum deploy, pastikan:

- ✅ Kode sudah di-test dan berjalan dengan baik
- ✅ Tidak ada error saat `npm run build`
- ✅ File `.env.local` tidak akan di-commit (sudah ada di `.gitignore`)
- ✅ File penting sudah ada:
  - `website/package.json`
  - `website/next.config.js`
  - `website/public/data/trees.json`

### 1.2 Build Test Lokal

Test build lokal terlebih dahulu untuk memastikan tidak ada error:

```bash
cd website
npm run build
```

Jika build berhasil, lanjut ke langkah berikutnya. Jika ada error, perbaiki terlebih dahulu.

---

## 2. Push ke GitHub

### 2.1 Cek Status Git

Cek status repository dan pastikan semua perubahan sudah siap:

```bash
git status
```

### 2.2 Add Semua Perubahan

Tambahkan semua file yang berubah ke staging area:

```bash
# Add semua file yang berubah
git add .

# Atau add file spesifik jika perlu
git add website/
git add README.md
git add docs/
```

### 2.3 Commit Perubahan

Buat commit dengan pesan yang deskriptif:

```bash
git commit -m "feat: update project untuk deployment ke Vercel

- Update dependencies ke Next.js 16 dan React 19
- Implement sticky scroll untuk trunk section
- Fix error handling dan loading states
- Update dokumentasi deployment"
```

**Tips:** Gunakan conventional commit format:
- `feat:` untuk fitur baru
- `fix:` untuk perbaikan bug
- `docs:` untuk perubahan dokumentasi
- `refactor:` untuk refactoring code

### 2.4 Cek Branch

Pastikan Anda di branch yang benar (biasanya `main` atau `master`):

```bash
git branch
```

Jika perlu pindah branch:

```bash
git checkout main
# atau
git checkout master
```

### 2.5 Push ke GitHub

Push perubahan ke repository GitHub:

```bash
git push origin main
# atau jika branch Anda master
git push origin master
```

Jika ini pertama kali push ke repository yang sudah ada:

```bash
git remote -v  # Cek remote URL
git push -u origin main  # Push dan set upstream
```

**Jika ada error "remote already exists":**
```bash
# Update remote URL jika perlu
git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
git push origin main
```

---

## 3. Persiapan untuk Vercel

### 3.1 Buat Akun Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik **"Sign Up"**
3. Pilih **"Continue with GitHub"** (recommended untuk integrasi otomatis)
4. Authorize Vercel untuk mengakses GitHub repositories Anda

### 3.2 Persiapkan Repository

Pastikan repository GitHub Anda:
- ✅ Bersifat public (untuk free tier) atau private (untuk Pro plan)
- ✅ Memiliki file `package.json` di folder `website/`
- ✅ Memiliki `next.config.js`

### 3.3 Catat Informasi Penting

Catat informasi berikut untuk digunakan nanti:
- GitHub repository URL: `https://github.com/USERNAME/REPOSITORY`
- Project name yang diinginkan di Vercel (misalnya: `iqra-project`)

---

## 4. Deploy ke Vercel

### 4.1 Import Project

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik tombol **"Add New..."** → **"Project"**
3. Pilih repository GitHub Anda dari daftar
4. Jika repository tidak muncul, klik **"Adjust GitHub App Permissions"** dan berikan akses

### 4.2 Konfigurasi Project

Di halaman konfigurasi project:

#### 4.2.1 Root Directory

**PENTING:** Karena Next.js project ada di folder `website/`, atur root directory:

1. Klik **"Root Directory"** → **"Edit"**
2. Pilih folder **`website`** 
3. Klik **"Continue"**

Atau secara manual, klik **"Configure Project"** dan set:
- **Root Directory:** `website`

#### 4.2.2 Build Settings

Vercel biasanya auto-detect Next.js, tapi pastikan:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (otomatis terdeteksi)
- **Output Directory:** `.next` (otomatis terdeteksi)
- **Install Command:** `npm install` (otomatis terdeteksi)

#### 4.2.3 Environment Variables

**Sementara skip dulu** (akan kita setup di langkah berikutnya). Klik **"Deploy"** terlebih dahulu.

### 4.3 Proses Deploy

Vercel akan:
1. Install dependencies (`npm install`)
2. Build project (`npm run build`)
3. Deploy ke production

Proses ini biasanya memakan waktu 1-3 menit. Anda bisa melihat progress di dashboard.

**Jika ada error saat build:**
- Cek log error di Vercel dashboard
- Pastikan `npm run build` berhasil di lokal
- Lihat bagian [Troubleshooting](#7-troubleshooting)

---

## 5. Setup Environment Variables

### 5.1 Akses Project Settings

Setelah deploy pertama berhasil:

1. Di Vercel dashboard, klik project Anda
2. Klik tab **"Settings"**
3. Klik **"Environment Variables"** di sidebar kiri

### 5.2 Tambah Environment Variables

Tambahkan environment variable berikut:

#### `NEXT_PUBLIC_BASE_URL`

1. Klik **"Add New"**
2. Isi:
   - **Key:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** URL Vercel Anda (contoh: `https://iqra-project.vercel.app`)
     - URL bisa ditemukan di halaman project: `https://YOUR-PROJECT.vercel.app`
   - **Environment:** Pilih semua (Production, Preview, Development)
3. Klik **"Save"**

**Cara menemukan URL Vercel:**
- Di dashboard project, URL production ada di bagian atas
- Format: `https://PROJECT-NAME.vercel.app`
- Atau `https://PROJECT-NAME-YOUR-TEAM.vercel.app` jika menggunakan team

### 5.3 Redeploy

Setelah menambah environment variables:

1. Klik tab **"Deployments"**
2. Klik **"..."** pada deployment terbaru
3. Klik **"Redeploy"**
4. Centang **"Use existing Build Cache"** (opsional, untuk build lebih cepat)
5. Klik **"Redeploy"**

**Atau** push commit baru ke GitHub (jika sudah setup auto-deploy):
```bash
git commit --allow-empty -m "chore: trigger redeploy untuk update env vars"
git push origin main
```

---

## 6. Verifikasi Deploy

### 6.1 Cek Website

1. Buka URL Vercel Anda: `https://YOUR-PROJECT.vercel.app`
2. Test halaman utama
3. Test halaman detail pohon (misalnya: `/tree/1`)
4. Cek console browser untuk error (F12 → Console)

### 6.2 Test Fitur Utama

✅ **Homepage:**
- Cards pohon muncul
- Navigation berfungsi
- Loading states bekerja

✅ **Tree Detail Page:**
- Data pohon muncul dengan benar
- Sticky scroll berfungsi
- Images ter-load dengan baik
- Navigation back berfungsi

✅ **SEO & Metadata:**
- Page title sesuai
- Open Graph tags bekerja (test dengan [ogp.me](https://www.opengraph.xyz/))

### 6.3 Test di Berbagai Device

- ✅ Desktop browser
- ✅ Mobile browser (responsive)
- ✅ Tablet

### 6.4 Cek Performance

Gunakan tools berikut:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- Vercel Analytics (jika diaktifkan)

---

## 7. Troubleshooting

### 7.1 Build Error: Module Not Found

**Error:**
```
Module not found: Can't resolve '@/components/...'
```

**Solusi:**
- Pastikan `jsconfig.json` atau `tsconfig.json` ada di folder `website/`
- Pastikan path aliases sudah benar:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```

### 7.2 Build Error: Environment Variable Missing

**Error:**
```
Error: NEXT_PUBLIC_BASE_URL is not defined
```

**Solusi:**
1. Pastikan environment variable sudah ditambahkan di Vercel
2. Pastikan variable dimulai dengan `NEXT_PUBLIC_` untuk client-side access
3. Redeploy setelah menambah environment variable

### 7.3 Build Error: Out of Memory

**Error:**
```
JavaScript heap out of memory
```

**Solusi:**
- Vercel free tier memiliki limit memory
- Pastikan tidak ada dependency yang terlalu besar
- Cek `node_modules` size
- Gunakan Vercel Pro plan jika diperlukan

### 7.4 Deploy Success Tapi Website Error 404

**Kemungkinan Penyebab:**
- Root directory tidak di-set ke `website/`
- `package.json` tidak ditemukan di root directory yang benar

**Solusi:**
1. Di Vercel dashboard → Settings → General
2. Pastikan **Root Directory** = `website`
3. Redeploy

### 7.5 Images Tidak Muncul

**Kemungkinan Penyebab:**
- Path images salah
- Images tidak di-include di build

**Solusi:**
- Pastikan images ada di `website/public/assets/`
- Gunakan absolute path: `/assets/...` (dengan leading slash)
- Pastikan images di-commit ke GitHub (tidak di `.gitignore`)

### 7.6 Data JSON Tidak Ter-load

**Error:**
```
Failed to load trees data
```

**Solusi:**
1. Pastikan `website/public/data/trees.json` ada dan di-commit
2. Test dengan fetch langsung: `https://YOUR-PROJECT.vercel.app/data/trees.json`
3. Pastikan file JSON valid (bisa di-test dengan JSON validator)

### 7.7 Sticky Scroll Tidak Berfungsi

**Kemungkinan Penyebab:**
- CSS tidak ter-load dengan benar
- Build optimization issue

**Solusi:**
- Pastikan Tailwind CSS sudah ter-build
- Check console untuk CSS errors
- Pastikan `tailwind.config.js` ada dan benar

### 7.8 Custom Domain (Opsional)

Jika ingin menggunakan custom domain:

1. Di Vercel dashboard → Settings → Domains
2. Klik **"Add Domain"**
3. Masukkan domain Anda (contoh: `iqra.example.com`)
4. Ikuti instruksi untuk setup DNS:
   - Add CNAME record: `iqra.example.com` → `cname.vercel-dns.com`
   - Atau A record sesuai instruksi Vercel
5. Tunggu DNS propagation (bisa sampai 24 jam)

---

## 8. Best Practices

### 8.1 Auto-Deploy dari GitHub

Vercel secara default akan auto-deploy setiap push ke `main` branch:

```bash
git push origin main  # Akan trigger deploy otomatis
```

Untuk preview deployments, push ke branch lain:
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
# Vercel akan membuat preview deployment
```

### 8.2 Environment Variables Management

- ✅ Jangan commit `.env.local` ke Git
- ✅ Gunakan Vercel dashboard untuk production env vars
- ✅ Gunakan `NEXT_PUBLIC_` prefix untuk client-side variables
- ✅ Setup env vars untuk Production, Preview, dan Development secara terpisah jika berbeda

### 8.3 Monitoring & Analytics

Vercel menyediakan:
- **Analytics:** Track page views, performance metrics
- **Speed Insights:** Real user monitoring (RUM)
- **Logs:** View function logs dan errors

Aktifkan di Settings → Analytics (untuk Pro plan)

### 8.4 Performance Optimization

Setelah deploy, optimize lebih lanjut:
- ✅ Enable Vercel Analytics
- ✅ Setup caching untuk static assets
- ✅ Optimize images dengan Next.js Image component (sudah diimplementasikan)
- ✅ Monitor Core Web Vitals

---

## 9. Checklist Final

Sebelum menganggap deploy selesai, pastikan:

- [ ] Build berhasil tanpa error
- [ ] Website bisa diakses di production URL
- [ ] Semua halaman berfungsi dengan baik
- [ ] Environment variables sudah di-set
- [ ] Images dan assets ter-load dengan benar
- [ ] Data JSON ter-load dengan benar
- [ ] Sticky scroll dan animasi berfungsi
- [ ] Responsive di mobile dan desktop
- [ ] SEO metadata bekerja (test dengan ogp.me)
- [ ] Error handling bekerja (test dengan invalid tree ID)
- [ ] Navigation berfungsi dengan baik

---

## 10. Update Deployment

Untuk update deployment di masa depan:

1. **Buat perubahan di lokal:**
   ```bash
   # Edit files
   # Test lokal dengan npm run dev
   # Build test: npm run build
   ```

2. **Commit dan push:**
   ```bash
   git add .
   git commit -m "feat: update feature description"
   git push origin main
   ```

3. **Vercel akan auto-deploy** (jika sudah setup)

4. **Atau manual deploy:**
   - Klik "Redeploy" di Vercel dashboard
   - Atau buat deployment baru dari specific commit

---

## 📞 Bantuan Tambahan

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Common Issues

Jika masih mengalami masalah yang tidak ada di troubleshooting:
1. Cek [Vercel Status](https://www.vercel-status.com/)
2. Cek build logs di Vercel dashboard
3. Test build lokal untuk memastikan issue bukan dari Vercel
4. Cek [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)

---

**Selamat! Website Anda sudah live di Vercel! 🎉**

Jika ada pertanyaan atau issue, silakan cek troubleshooting section atau dokumentasi Vercel.

