# ⚡ Quick Start: Deploy ke Vercel

Tutorial cepat deploy ke Vercel dalam 5 menit. Untuk tutorial lengkap, lihat [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🚀 Langkah Cepat

### 1. Push ke GitHub
```bash
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

### 2. Import ke Vercel
1. Buka [vercel.com](https://vercel.com) → Login dengan GitHub
2. Klik **"Add New Project"**
3. Pilih repository Anda
4. **PENTING:** Set **Root Directory** = `website`
5. Klik **"Deploy"**

### 3. Setup Environment Variable
1. Di Vercel dashboard → Settings → Environment Variables
2. Tambahkan:
   - **Key:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** `https://YOUR-PROJECT.vercel.app` (ganti dengan URL Anda)
   - **Environment:** Pilih semua (Production, Preview, Development)
3. Save → Redeploy

### 4. Selesai! ✅
Website Anda sekarang live di: `https://YOUR-PROJECT.vercel.app`

---

## ⚠️ Troubleshooting Cepat

**Build Error?**
- Pastikan root directory = `website`
- Test build lokal: `cd website && npm run build`

**Data tidak muncul?**
- Pastikan `website/public/data/trees.json` ada dan di-commit

**Images tidak muncul?**
- Pastikan images di `website/public/assets/` dan sudah di-commit

**404 Error?**
- Pastikan root directory = `website` (bukan root project)

---

📖 Untuk tutorial lengkap dengan troubleshooting detail, lihat [DEPLOYMENT.md](./DEPLOYMENT.md)

