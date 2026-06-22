# Shellafood — Project Architecture

Next.js App Router project (Arabic RTL). Business logic lives in `features/`, routes in `app/`, BFF API routes in `app/api/`.

---

## Core Pattern

Every page follows the same composition:

```
app/.../page.tsx          → Suspense + Shell + Sections only (no fetch, no layout logic)
features/<domain>/
  api/                    → Server-side fetch functions (called from section index.tsx)
  types/                  → TypeScript interfaces
  components/
    <Domain>Shell.tsx     → Client page wrapper (layout, topbar, context)
    sections/<Name>/      → One folder per UI section
      index.tsx           → Server: fetch + guard + decide
      *Client.tsx         → Client: layout, state, events
      *Card.tsx           → Presentational unit
      skeleton.tsx        → Loading state
    shared/               → Reusable within the feature
```

### Naming Convention

| File | Role | Rules |
|------|------|-------|
| `index.tsx` | Server section entry | `async`, fetches data, returns `null` if empty, never `"use client"` |
| `*Client.tsx` | Client section UI | `"use client"`, className, state, Swiper — never fetches |
| `*Card.tsx` / `*Slide.tsx` | Presentational | Props in, JSX out |
| `skeleton.tsx` | Loading placeholder | Matches real layout dimensions |
| `*Shell.tsx` | Page wrapper | Client layout shell for the route |
| `page.tsx` | Route | Only `Suspense` + imports — no business logic |

---

## `app/` — Routes & API

```
app/
├── layout.tsx                          # Root HTML, RTL, global metadata
├── global.css                          # Tailwind + Swiper overrides
├── loading.tsx                         # Global loading UI
├── error.tsx                           # Global error boundary
├── not-found.tsx                       # 404 entry
├── NotFoundContent.tsx                 # 404 content component
├── page.tsx                            # Root redirect
├── favicon.ico
│
├── auth/
│   └── page.tsx                        # Auth flow entry
│
├── onboarding/
│   ├── page.tsx                        # Onboarding screens
│   └── error.tsx
│
├── (main)/                             # Authenticated main app routes
│   ├── layout.tsx                      # Auth guard (token or guest cookie)
│   ├── home/
│   │   └── page.tsx                    # → features/home
│   ├── modules/[id]/
│   │   └── page.tsx                    # → features/markets (generic module)
│   ├── markets/                        # (via redirect or modules route)
│   ├── search/
│   │   └── page.tsx                    # → features/search
│   ├── items/[id]/
│   │   └── page.tsx                    # → features/item
│   ├── stores/[id]/
│   │   ├── page.tsx                    # → features/store (legacy pattern)
│   │   └── categories/
│   │       └── page.tsx                # → features/store
│   ├── notifications/
│   │   └── page.tsx                    # → features/notifications
│   ├── cart/page.tsx
│   ├── profile/page.tsx
│   ├── my-orders/page.tsx
│   └── discounts/page.tsx
│
├── (modules)/                          # Module-specific experiences
│   ├── layout.tsx                      # Auth guard
│   ├── markets/
│   │   └── page.tsx                    # → features/markets
│   └── hyper-market/
│       ├── page.tsx                    # → features/hyper-market/StoreDetails
│       └── categories/
│           └── page.tsx                # → features/hyper-market/Categories
│
└── api/                                # BFF — proxies to external API
    ├── auth/
    │   ├── guest/route.ts
    │   ├── register/route.ts
    │   ├── send-otp/route.ts
    │   ├── session/route.ts
    │   └── verify-otp/route.ts
    ├── home/
    │   ├── banners/route.ts
    │   ├── modules/route.ts
    │   ├── current-offers/route.ts
    │   ├── discounted-stores/route.ts
    │   └── recent-orders/route.ts
    ├── module/
    │   ├── categories/route.ts
    │   ├── offers/route.ts
    │   ├── current-offers/route.ts
    │   ├── stores/route.ts
    │   ├── popular-brands/route.ts
    │   └── recent-orders/route.ts
    ├── store/
    │   ├── details/route.ts
    │   └── categories/
    │       ├── details/route.ts
    │       └── [id]/route.ts
    ├── item/
    │   ├── details/route.ts
    │   └── related/route.ts
    └── search/
        ├── popular-brands/route.ts
        └── popular-search/route.ts
```

---

## `features/` — Domain Modules

### `features/auth/` — Authentication

```
features/auth/
├── api/
│   ├── guest.ts
│   ├── register.ts
│   ├── send-otp.ts
│   ├── session.ts
│   └── verify-otp.ts
├── components/
│   ├── AuthFlowPage.tsx
│   ├── WelcomeScreen.tsx
│   ├── EnterPhoneScreen.tsx
│   ├── OtpScreen.tsx
│   ├── CreateAccountScreen.tsx
│   └── NumericKeypad.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── auth.lib.ts
└── types/
    └── auth.types.ts
```

---

### `features/home/` — Home Page *(section-based)*

```
features/home/
├── api/
│   ├── banners.ts
│   ├── modules.ts
│   ├── current-offers.ts
│   ├── discounted-stores.ts
│   └── recent-orders.ts
├── types/
│   ├── banners.types.ts
│   ├── modules.types.ts
│   ├── current-offers.types.ts
│   ├── discounted-stores.types.ts
│   └── recent-orders.types.ts
└── components/
    ├── HomeShell.tsx
    ├── Topbar.tsx
    ├── shared/
    │   ├── PriceTag.tsx
    │   ├── ImageWithFallback.tsx
    │   └── ScrollContainer.tsx
    └── sections/
        ├── Banners/
        │   ├── index.tsx
        │   ├── BannersClient.tsx
        │   ├── BannerSlide.tsx
        │   └── skeleton.tsx
        ├── Modules/
        │   ├── index.tsx
        │   ├── ModulesClient.tsx
        │   ├── ModuleCard.tsx
        │   └── skeleton.tsx
        ├── DiscountedStores/
        │   ├── index.tsx
        │   ├── DiscountedStoresClient.tsx
        │   ├── StoreCard.tsx
        │   └── skeleton.tsx
        ├── CurrentOffers/
        │   ├── index.tsx
        │   ├── CurrentOffersClient.tsx
        │   ├── OfferCard.tsx
        │   └── skeleton.tsx
        ├── RecentOrders/
        │   ├── index.tsx
        │   ├── RecentOrdersClient.tsx
        │   ├── OrderCard.tsx
        │   └── skeleton.tsx
        └── PromoBanner/
            └── index.tsx
```

**Route:** `app/(main)/home/page.tsx`

---

### `features/markets/` — Markets / Generic Module *(section-based)*

```
features/markets/
├── api/
│   ├── categories.ts
│   ├── offers.ts
│   ├── current-offers.ts
│   ├── stores.ts
│   ├── popular-brands.ts
│   └── recent-orders.ts
├── types/
│   ├── categories.types.ts
│   ├── offers.types.ts
│   ├── current-offers.types.ts
│   ├── stores.types.ts
│   ├── popular-brands.types.ts
│   └── recent-orders.types.ts
├── hooks/
│   └── useStores.ts
└── components/
    ├── MarketsShell.tsx
    ├── Topbar.tsx
    └── sections/
        ├── Categories/
        │   ├── index.tsx
        │   ├── CategoriesClient.tsx
        │   ├── CategoryCard.tsx
        │   └── skeleton.tsx
        ├── Offers/
        │   ├── index.tsx
        │   ├── OffersClient.tsx
        │   ├── OfferSlide.tsx
        │   └── skeleton.tsx
        ├── CurrentOffers/
        │   ├── index.tsx
        │   ├── CurrentOffersClient.tsx
        │   ├── CurrentOfferCard.tsx
        │   └── skeleton.tsx
        ├── Stores/
        │   ├── index.tsx
        │   ├── StoresClient.tsx
        │   ├── StoreCard.tsx
        │   └── skeleton.tsx
        ├── PopularBrands/
        │   ├── index.tsx
        │   ├── PopularBrandsClient.tsx
        │   ├── BrandCard.tsx
        │   └── skeleton.tsx
        └── RecentOrders/
            ├── index.tsx
            ├── RecentOrdersClient.tsx
            ├── OrderCard.tsx
            └── skeleton.tsx
```

**Routes:** `app/(modules)/markets/page.tsx`, `app/(main)/modules/[id]/page.tsx`

---

### `features/hyper-market/` — Hyper Market *(section-based, nested by screen)*

```
features/hyper-market/
│
├── StoreDetails/                       # /hyper-market
│   ├── api/
│   │   └── store-details.ts
│   ├── types/
│   │   └── store-details.types.ts
│   └── components/
│       ├── HyperMarketShell.tsx
│       ├── Topbar.tsx
│       ├── shared/
│       │   └── ProductCard.tsx
│       └── sections/
│           ├── StoreDetails/
│           │   ├── index.tsx
│           │   ├── StoreDetailsClient.tsx
│           │   └── skeleton.tsx
│           ├── CategoriesGrid/
│           │   ├── CategoriesGridClient.tsx
│           │   └── CategoryCard.tsx
│           └── FeaturedSections/
│               └── FeaturedSections.tsx
│
└── Categories/                         # /hyper-market/categories
    ├── api/
    │   ├── categories.ts
    │   └── category-detail.ts
    ├── types/
    │   ├── categories.types.ts
    │   └── category-detail.types.ts
    └── components/
        ├── CategoriesPageShell.tsx
        └── sections/
            ├── CategoryTabs/
            │   ├── index.tsx
            │   ├── CategoryTabsClient.tsx
            │   └── skeleton.tsx
            └── CategoryDetail/
                ├── index.tsx
                ├── CategoryDetailClient.tsx
                ├── CategoryProductCard.tsx
                └── skeleton.tsx
```

**Routes:** `app/(modules)/hyper-market/page.tsx`, `app/(modules)/hyper-market/categories/page.tsx`

---

### `features/item/` — Product Detail *(section-based)*

```
features/item/
├── api/
│   ├── item-details.ts
│   └── related-items.ts
├── types/
│   ├── item.types.ts
│   └── related-items.types.ts
└── components/
    ├── ItemShell.tsx
    └── sections/
        ├── ItemInfo/
        │   ├── index.tsx
        │   ├── ItemInfoClient.tsx
        │   └── skeleton.tsx
        ├── ItemGallery/
        │   ├── ItemGalleryClient.tsx
        │   └── skeleton.tsx
        ├── AddToCart/
        │   └── AddToCartClient.tsx
        └── RelatedItems/
            ├── index.tsx
            ├── RelatedItemsClient.tsx
            ├── RelatedProductCard.tsx
            └── skeleton.tsx
```

**Route:** `app/(main)/items/[id]/page.tsx`

---

### `features/search/` — Search *(section-based)*

```
features/search/
├── api/
│   ├── popular-brands.ts
│   └── popular-search.ts
├── types/
│   ├── popular-brands.types.ts
│   └── popular-search.types.ts
├── hooks/
│   └── useRecentSearches.ts
└── components/
    ├── SearchShell.tsx
    ├── SearchBar.tsx
    ├── SearchContext.tsx
    ├── shared/
    │   └── SearchChip.tsx
    └── sections/
        ├── PopularBrands/
        │   ├── index.tsx
        │   ├── PopularBrandsClient.tsx
        │   ├── BrandCard.tsx
        │   └── skeleton.tsx
        ├── PopularSearch/
        │   ├── index.tsx
        │   ├── PopularSearchClient.tsx
        │   └── skeleton.tsx
        └── RecentSearches/
            ├── index.tsx
            └── RecentSearchesClient.tsx
```

**Route:** `app/(main)/search/page.tsx`

---

### `features/notifications/` — Notifications *(section-based)*

```
features/notifications/
├── api/
│   └── notifications.ts
├── types/
│   └── notifications.types.ts
└── components/
    ├── NotificationsShell.tsx
    └── sections/
        └── Notifications/
            ├── index.tsx
            ├── NotificationsClient.tsx
            ├── NotificationCard.tsx
            ├── NotificationsEmpty.tsx
            └── skeleton.tsx
```

**Route:** `app/(main)/notifications/page.tsx`

---

### `features/store/` — Store Detail *(legacy — pre-refactor)*

```
features/store/
├── components/
│   └── StorePage.tsx                   # Monolithic page component
├── hooks/
│   ├── useStoreDetails.ts
│   └── useStoreCategories.ts
└── types/
    ├── store-details.types.ts
    └── store-categories.types.ts
```

**Routes:** `app/(main)/stores/[id]/page.tsx`, `app/(main)/stores/[id]/categories/page.tsx`  
**Note:** Not yet migrated to the section-based pattern used elsewhere.

---

### `features/module/` — Old Module UI *(legacy — superseded by markets/)*

```
features/module/
├── components/
│   ├── ModulePage.tsx
│   ├── Categories.tsx
│   ├── Offers.tsx
│   ├── CurrentOffers.tsx
│   ├── Stores.tsx
│   ├── PopularBrands.tsx
│   ├── RecentOrders.tsx
│   └── topbar.tsx
├── hooks/
│   ├── useCategories.ts
│   ├── useOffers.ts
│   ├── useCurrentOffers.ts
│   ├── useStores.ts
│   ├── usePopularBrands.ts
│   └── useRecentOrders.ts
└── types/
    ├── categories.types.ts
    ├── offers.types.ts
    ├── current-offers.types.ts
    ├── stores.types.ts
    ├── popular-brands.types.ts
    └── recent-orders.types.ts
```

**Note:** Replaced by `features/markets/`. Safe to remove once confirmed unused.

---

### Other Features

```
features/layout/
└── components/
    └── Navbar.tsx

features/onboarding/
└── OnboardingScreens.tsx
```

---

## `shared/` — Cross-Feature Utilities

```
shared/
└── lib/
    └── api-response.ts                 # Shared API response helpers
```

---

## `public/` — Static Assets

```
public/
├── home/
│   └── banner.png
├── hyper-market/
│   └── banner.png
├── notifications/
│   └── notifications-empty.png
└── onboarding/
    ├── bag.png
    ├── boxes.png
    ├── clock.png
    └── discount.png
```

---

## Route → Feature Map

| URL | Feature | Pattern |
|-----|---------|---------|
| `/home` | `features/home` | Section-based |
| `/modules/[id]` | `features/markets` | Section-based |
| `/markets` | `features/markets` | Section-based |
| `/hyper-market` | `features/hyper-market/StoreDetails` | Section-based |
| `/hyper-market/categories` | `features/hyper-market/Categories` | Section-based |
| `/items/[id]` | `features/item` | Section-based |
| `/search` | `features/search` | Section-based |
| `/notifications` | `features/notifications` | Section-based |
| `/stores/[id]` | `features/store` | Legacy (monolithic) |
| `/auth` | `features/auth` | Screen flow |
| `/onboarding` | `features/onboarding` | Screen flow |

---

## Data Flow

```
Browser
  └── app/.../page.tsx          (composition only)
        └── Section/index.tsx   (server fetch via features/<domain>/api/)
              └── *Client.tsx   (interactive UI)
                    └── *Card.tsx (presentational)

Client hooks (legacy)           → app/api/*/route.ts → External Shellafood API
Server fetch (new pattern)        → External API directly (with revalidate tags)
```

---

## Example — Minimal `page.tsx`

```tsx
import { Suspense } from "react";
import { HomeShell } from "@/features/home/components/HomeShell";
import { Banners } from "@/features/home/components/sections/Banners";

export default async function HomePage() {
  return (
    <HomeShell>
      <Suspense fallback={<Banners.skeleton />}>
        <Banners />
      </Suspense>
    </HomeShell>
  );
}
```

---

## Example — Section `index.tsx`

```tsx
import { getBanners } from "@/features/home/api/banners";
import { BannersClient } from "./BannersClient";

export { default as skeleton } from "./skeleton";

export async function Banners() {
  const { banners } = await getBanners();
  if (banners.length === 0) return null;
  return <BannersClient banners={banners} />;
}
```

---

## The Rule (Summary)

| File | Contains | Never Contains |
|------|----------|----------------|
| `page.tsx` | `Suspense`, shell, section imports | `fetch`, business logic, layout classNames |
| `index.tsx` | `async`, `await getX()`, empty guard | `"use client"`, className, `<section>` |
| `*Client.tsx` | `"use client"`, layout, state, events | `fetch`, `async` |
| `*Card.tsx` | Props + JSX | fetch, state, effects |
| `skeleton.tsx` | `animate-pulse`, matching size | logic |

A developer should know what a file does from its name — without opening it.
