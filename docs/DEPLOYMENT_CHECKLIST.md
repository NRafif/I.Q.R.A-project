# ✅ Deployment Checklist

Checklist file dan konfigurasi yang perlu ada sebelum deploy ke Vercel.

## 📁 File yang HARUS Ada di Repository

### Required Files

- [ ] `website/package.json` - Dependencies dan scripts
- [ ] `website/next.config.js` - Next.js configuration
- [ ] `website/jsconfig.json` atau `tsconfig.json` - Path aliases (@/*)
- [ ] `website/tailwind.config.js` - Tailwind CSS config
- [ ] `website/postcss.config.js` - PostCSS config
- [ ] `website/public/data/trees.json` - Data pohon (penting!)
- [ ] `website/src/` - Source code
- [ ] `README.md` - Project documentation

### File yang TIDAK Perlu di-Commit

- [ ] `.env.local` - Environment variables (dibuat di Vercel)
- [ ] `.env` - Environment variables
- [ ] `node_modules/` - Dependencies (akan diinstall oleh Vercel)
- [ ] `.next/` - Build output
- [ ] `website/.next/` - Build output

## 🔧 Konfigurasi Vercel

### Root Directory
- [ ] Root Directory = `website` (penting!)

### Build Settings (Auto-detect, tapi pastikan)
- [ ] Framework Preset = Next.js
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `.next`
- [ ] Install Command = `npm install`

### Environment Variables
- [ ] `NEXT_PUBLIC_BASE_URL` = `https://your-project.vercel.app`

## ✅ Pre-Deployment Checklist

Sebelum push ke GitHub:

- [ ] Build test lokal berhasil: `cd website && npm run build`
- [ ] Dev server berjalan tanpa error: `npm run dev`
- [ ] Tidak ada error di console
- [ ] Semua images ada di `website/public/assets/`
- [ ] Data JSON valid dan bisa di-parse
- [ ] Git status clean atau semua perubahan sudah di-stage

## 🧪 Post-Deployment Checklist

Setelah deploy:

- [ ] Website bisa diakses di production URL
- [ ] Homepage load dengan benar
- [ ] Tree detail pages load dengan benar
- [ ] Images ter-load dengan benar
- [ ] Data JSON ter-load (test: `/data/trees.json`)
- [ ] Navigation berfungsi
- [ ] Sticky scroll berfungsi (di tree detail page)
- [ ] Responsive di mobile
- [ ] No console errors di browser
- [ ] SEO metadata bekerja (test dengan ogp.me)

## 📝 Quick Commands

```bash
# Pre-deployment test
cd website
npm run build          # Test build
npm run lint           # Check linting
npm test               # Run tests (optional)

# Git commands
git status             # Check changes
git add .              # Stage all changes
git commit -m "..."    # Commit changes
git push origin main   # Push to GitHub

# Vercel CLI (optional)
vercel                 # Deploy via CLI
vercel --prod          # Deploy to production
```

## ⚠️ Common Mistakes

- ❌ **Lupa set root directory** = Build akan gagal
- ❌ **Commit `.env.local`** = Security risk
- ❌ **Lupa commit `trees.json`** = Data tidak muncul
- ❌ **Lupa commit images** = Images tidak muncul
- ❌ **Environment variable salah** = Metadata error

---

✅ Jika semua checklist sudah dicentang, Anda siap untuk deploy!

