# DrapeCurve — Drape Different.

Premium oversized streetwear website. Next.js 14 · Tailwind · Supabase · Vercel.

## Files (only 9 to upload)

```
drapecurve/
├── app/
│   ├── api/orders/route.ts   ← order API (Supabase + Telegram/Email/WhatsApp)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              ← entire site in ONE file (easy to edit)
├── public/products/          ← drop your product images here
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── supabase-schema.sql
├── tailwind.config.ts
└── tsconfig.json
```

## Setup (15 minutes)

### 1. Supabase
- supabase.com → New project → SQL Editor → paste `supabase-schema.sql` → Run
- Settings → API → copy URL + anon key

### 2. Notification (pick one)
**Telegram (easiest):** Message @BotFather → /newbot → get token. Message @userinfobot → get chat ID.
**Email:** resend.com → free account → create API key.

### 3. Environment variables
```bash
cp .env.example .env.local
# fill in your values
```

### 4. Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

### 5. Add product images
Put your photos in `/public/products/` as `product-01.jpg` through `product-04.jpg`.
Then in `app/page.tsx` find the `ProductCard` function, uncomment the `<Image>` line, and delete the placeholder div.

### 6. Deploy to Vercel
```bash
npx vercel
# or push to GitHub → import at vercel.com → add env vars → Deploy
```

## Customise
Everything is in `app/page.tsx` — products, prices, colours, text. Just edit and save.
