Here is the clean folder structure. Every file name tells you its role instantly — no need to open it.

---

## `features/home/components/` — Clean Structure

```
features/home/components/
│
├── sections/                    ← One folder per page section
│   ├── Banners/
│   │   ├── index.tsx            ← Server: fetch + guard + decide
│   │   ├── BannersClient.tsx    ← Client: Swiper, layout, className
│   │   ├── BannerSlide.tsx      ← Shared: pure card, props in JSX out
│   │   └── skeleton.tsx         ← Shared: loading state
│   │
│   ├── Modules/
│   │   ├── index.tsx            ← Server: fetch + guard
│   │   ├── ModulesClient.tsx    ← Client: grid, colors, layout
│   │   ├── ModuleCard.tsx       ← Shared: one module card
│   │   └── skeleton.tsx
│   │
│   ├── DiscountedStores/
│   │   ├── index.tsx            ← Server: fetch + guard
│   │   ├── DiscountedStoresClient.tsx
│   │   ├── StoreCard.tsx
│   │   └── skeleton.tsx
│   │
│   ├── CurrentOffers/
│   │   ├── index.tsx            ← Server: fetch + guard
│   │   ├── CurrentOffersClient.tsx
│   │   ├── OfferCard.tsx
│   │   └── skeleton.tsx
│   │
│   └── RecentOrders/
│       ├── index.tsx            ← Server: fetch + guard
│       ├── RecentOrdersClient.tsx
│       ├── OrderCard.tsx
│       └── skeleton.tsx
│
├── shared/                        ← Reusable across all sections
│   ├── PriceTag.tsx             ← Currency SVG + formatting
│   ├── ImageWithFallback.tsx    ← Image + error state
│   └── ScrollContainer.tsx      ← Horizontal scroll track
│
└── HomeShell.tsx                  ← Client: "use client", layout shell
```

---

## Naming Convention (Never Break This)

| Suffix | Meaning | Example |
|--------|---------|---------|
| `index.tsx` | Server entry point — always async, never `"use client"` | `Banners/index.tsx` |
| `*Client.tsx` | Client component — always `"use client"`, never fetches | `BannersClient.tsx` |
| `*Card.tsx` | Shared presentational — pure props, no directive | `OfferCard.tsx` |
| `skeleton.tsx` | Loading state — always safe, no directive | `skeleton.tsx` |
| `HomeShell.tsx` | Page-level client wrapper — layout, context, providers | `HomeShell.tsx` |

---

## `app/(main)/home/page.tsx` — Only This

```tsx
import { Suspense } from "react";
import { Banners } from "@/features/home/components/sections/Banners";
import { Modules } from "@/features/home/components/sections/Modules";
import { DiscountedStores } from "@/features/home/components/sections/DiscountedStores";
import { CurrentOffers } from "@/features/home/components/sections/CurrentOffers";
import { RecentOrders } from "@/features/home/components/sections/RecentOrders";
import { HomeShell } from "@/features/home/components/HomeShell";

export default async function HomePage() {
  return (
    <HomeShell>
      <Suspense fallback={<Banners.skeleton />}>
        <Banners />
      </Suspense>

      <Suspense fallback={<Modules.skeleton />}>
        <Modules />
      </Suspense>

      <Suspense fallback={<DiscountedStores.skeleton />}>
        <DiscountedStores />
      </Suspense>

      <Suspense fallback={<CurrentOffers.skeleton />}>
        <CurrentOffers />
      </Suspense>

      <Suspense fallback={<RecentOrders.skeleton />}>
        <RecentOrders />
      </Suspense>
    </HomeShell>
  );
}
```

---

## One Section Example — `Banners/`

### `Banners/index.tsx` — Server only

```tsx
// Server: fetch + guard + decide. No className, no <section>, no layout.
import { getBanners } from "@/features/home/api/banners";
import { BannersClient } from "./BannersClient";
import { BannerSlide } from "./BannerSlide";

export { default as skeleton } from "./skeleton";

export async function Banners() {
  const { banners } = await getBanners();

  if (banners.length === 0) return null;
  if (banners.length === 1) return <BannerSlide banner={banners[0]} priority />;

  return <BannersClient banners={banners} />;
}
```

### `Banners/BannersClient.tsx` — Client only

```tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Banner } from "@/features/home/types/banners.types";
import { BannerSlide } from "./BannerSlide";

export function BannersClient({ banners }: { banners: Banner[] }) {
  return (
    <section aria-label="العروض المميزة" className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={banner.id}>
            <BannerSlide banner={banner} priority={i === 0} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
```

### `Banners/BannerSlide.tsx` — Shared

```tsx
// Pure: props in, JSX out. Works in server or client parent.
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/features/home/types/banners.types";

export function BannerSlide({ banner, priority = false }: { banner: Banner; priority?: boolean }) {
  const href = banner.link ?? (banner.store?.slug ? `/stores/${banner.store.slug}` : null);

  const image = (
    <div className="relative w-full aspect-[21/7] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <Image
        src={banner.image_full_url}
        alt={banner.title || "عرض ترويجي"}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 960px"
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]">
        {image}
      </Link>
    );
  }

  return image;
}
```

### `Banners/skeleton.tsx` — Shared

```tsx
export default function BannerSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <div className="aspect-[21/7] sm:aspect-[21/6] w-full animate-pulse rounded-2xl bg-gray-100" />
    </div>
  );
}
```

---

## The Rule

| File | Contains | Never Contains |
|------|----------|----------------|
| `index.tsx` | `async function`, `await getX()`, `if (length === 0)`, `return <Client />` | `className`, `<section>`, `"use client"` |
| `*Client.tsx` | `"use client"`, `className`, `<section>`, event handlers, Swiper, state | `fetch`, `async`, `await` |
| `*Card.tsx` | Props interface, JSX, `Image`, `Link` | `fetch`, state, effects |
| `skeleton.tsx` | `animate-pulse`, matching dimensions | Logic, conditions |
| `page.tsx` | `Suspense`, imports, composition | `fetch`, `async`, logic |

A developer should know what a file does by reading its name. Never by opening it.