# Panduan Deployment

Dokumentasi untuk deploy I.Q.R.A ke berbagai platform.

---

## 🚀 Deploy ke Vercel (Recommended)

### Otomatis via GitHub

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import di Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Klik "Import Project"
   - Pilih repository GitHub
   - Set root directory: `website`
   - Klik "Deploy"

3. **Auto Deploy**
   - Setiap push ke `main` akan otomatis deploy
   - Preview deploy untuk branch lain

### Manual via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd website
vercel

# Deploy ke production
vercel --prod
```

---

## 🔧 Konfigurasi Vercel

### vercel.json (Optional)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

### Environment Variables

Tidak ada environment variables yang diperlukan untuk deployment dasar.

Jika perlu di masa depan:
1. Vercel Dashboard → Settings → Environment Variables
2. Tambahkan variable
3. Redeploy

---

## 📦 Build Lokal

```bash
# Build production bundle
npm run build

# Test production build locally
npm run start

# Open http://localhost:3000
```

### Build Output

```
.next/
├── cache/          # Build cache
├── server/         # Server components
├── static/         # Static assets (hashed)
└── standalone/     # Standalone server (optional)
```

---

## 🌐 Deploy ke Platform Lain

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Tambahkan plugin: `@netlify/plugin-nextjs`

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t iqra-website .
docker run -p 3000:3000 iqra-website
```

---

## ✅ Checklist Pre-Deploy

- [ ] `npm run build` sukses tanpa error
- [ ] `npm test` semua pass
- [ ] `npm run lint` tanpa error
- [ ] `npm audit` tidak ada high/critical vulnerabilities
- [ ] Gambar pohon sudah di-commit ke repository
- [ ] trees.json sudah valid

---

## 🔍 Troubleshooting

### Build Error: Image Optimization

```bash
# Jika error terkait sharp
npm install sharp
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Cache Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📊 Monitoring (Optional)

### Vercel Analytics

1. Vercel Dashboard → Analytics → Enable
2. Otomatis tracking pageviews & web vitals

### Custom Analytics

Tambahkan di `src/app/layout.js`:

```jsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script src="https://analytics-provider.com/script.js" />
      </body>
    </html>
  )
}
```

---

## 🔄 Rollback

### Vercel

1. Dashboard → Deployments
2. Pilih deployment sebelumnya
3. Klik "..." → "Promote to Production"

### Manual

```bash
git revert HEAD
git push origin main
```
