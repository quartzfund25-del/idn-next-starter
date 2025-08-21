

---

## CMS Integration
Pilih provider via ENV:
```
CMS_PROVIDER=local      # atau: strapi | wp | sanity
STRAPI_URL=https://your-strapi
STRAPI_TOKEN=...
WP_URL=https://your-wp-site.com
SANITY_PROJECT_ID=xxxxx
SANITY_DATASET=production
```

## Analytics ringan
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com
# atau Umami
NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_UMAMI_SRC=https://umami.yourdomain.com/script.js
```

## Komentar (Giscus)
Ambil nilai dari https://giscus.app dan isi:
```
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=...
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=...
```

## Infinite Scroll
Halaman beranda memuat 9 artikel pertama dari server, lalu menambah 9 per sentinel via IntersectionObserver.

## Core Web Vitals + RUM
- `next/image` untuk optimasi gambar.
- ISR `revalidate=300` untuk cache ringan.
- Klien mengirim metrik **web-vitals** ke `/api/rum` via `navigator.sendBeacon`.
- Ganti handler `/api/rum` untuk menyimpan ke DB/log service (BigQuery/S3).

