# Shellafood — AI Project Evaluation Guide

> **Purpose:** This document describes the **actual** architecture, data flow, and implementation state of the Shellafood codebase. AI reviewers should use this file as the source of truth when rating, auditing, or extending the project.
>
> **Last verified:** June 2026 · **Version:** 0.1.0 · **Branch:** `dev`

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Architecture Pattern](#4-architecture-pattern)
5. [Routing & Pages](#5-routing--pages)
6. [API Layer (BFF)](#6-api-layer-bff)
7. [Data Fetching Patterns](#7-data-fetching-patterns)
8. [Authentication & Session](#8-authentication--session)
9. [Feature Modules](#9-feature-modules)
10. [Shared Utilities](#10-shared-utilities)
11. [Types & Conventions](#11-types--conventions)
12. [Configuration & Environment](#12-configuration--environment)
13. [UI & Styling](#13-ui--styling)
14. [Implementation Maturity Matrix](#14-implementation-maturity-matrix)
15. [AI Evaluation Criteria](#15-ai-evaluation-criteria)
16. [Known Gaps & Technical Debt](#16-known-gaps--technical-debt)

---

## 1. Project Overview

**Shellafood** is an Arabic-first (RTL) food delivery and multi-service web platform built with **Next.js 16 App Router**. It connects to an external Shellafood REST API and uses a **Backend-for-Frontend (BFF)** pattern: the browser never calls the external API directly.

### What the app does today

| Flow | Status |
|------|--------|
| Onboarding → Auth (OTP) → Home | ✅ Implemented |
| Browse modules (grocery, restaurants, etc.) | ✅ Implemented |
| View stores, categories, products | ✅ Implemented |
| Product detail + related items | ✅ Implemented |
| Search (popular terms & brands) | ✅ Partial (no live search API) |
| Cart, Profile, My Orders, Discounts | ❌ Stub pages only |

### Important distinction

The root `README.md` describes many planned features (Pick & Order, Serve Me, cart, i18n, dark mode, etc.) that are **not present in the current source code**. This document reflects **what is actually built**.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript (strict) | 5.x |
| UI | React | 18.3 |
| Styling | Tailwind CSS | 4.x |
| Forms | react-hook-form + zod | 7.x / 4.x |
| UI Primitives | Radix UI | various |
| Carousel | Swiper | 12.x |
| Animation | Framer Motion | 12.x |
| Icons | Lucide React, React Icons | — |
| Maps | @react-google-maps/api | 2.x |
| File Upload | UploadThing | 6.x |
| Analytics | @vercel/analytics, speed-insights | — |
| Virtual Lists | @tanstack/react-virtual | 3.x |

### Dependencies declared but **not used** in source

| Package | Notes |
|---------|-------|
| `swr` | Listed in `package.json`; all hooks use manual `fetch` + `useState` |
| `i18next` / `react-i18next` | Listed; UI is hardcoded Arabic, no i18n config |
| `next-themes` | Listed; no theme provider in layout |

---

## 3. Directory Structure

```
shellafood/
├── app/                          # Next.js App Router (routes only)
│   ├── (main)/                   # Authenticated shell (Navbar + auth guard)
│   │   ├── layout.tsx            # Cookie guard → redirect /auth
│   │   ├── home/page.tsx
│   │   ├── cart/page.tsx         # STUB
│   │   ├── discounts/page.tsx    # STUB
│   │   ├── my-orders/page.tsx    # STUB
│   │   ├── profile/page.tsx      # STUB
│   │   ├── search/page.tsx
│   │   ├── modules/[id]/page.tsx
│   │   ├── stores/[id]/
│   │   │   ├── page.tsx
│   │   │   └── categories/page.tsx
│   │   └── items/[id]/page.tsx
│   ├── api/                      # BFF proxy routes (23 endpoints)
│   │   ├── auth/                 # guest, send-otp, verify-otp, register, session
│   │   ├── home/                 # banners, modules, offers, stores, orders
│   │   ├── module/               # categories, offers, brands, stores, orders
│   │   ├── search/               # popular-search, popular-brands
│   │   ├── store/                # details, categories
│   │   └── item/                 # details, related
│   ├── auth/page.tsx             # OTP auth flow
│   ├── onboarding/page.tsx       # Intro screens
│   ├── layout.tsx                # Root: lang=ar, dir=rtl
│   ├── page.tsx                  # Redirects to /onboarding
│   ├── loading.tsx               # Global loading UI
│   └── global.css                # Tailwind + Swiper overrides
│
├── features/                     # Feature-sliced domain code
│   ├── auth/                     # components, hooks, lib, types
│   ├── home/
│   ├── module/
│   ├── store/
│   ├── categories/
│   ├── item/
│   ├── search/
│   ├── layout/                   # Navbar
│   └── onboarding/
│
├── shared/
│   └── lib/
│       └── api-response.ts       # API envelope + unwrap helper
│
├── postman/
│   └── Shellafood API.json       # Backend API collection
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json                 # @/* → project root
├── vercel.json
└── package.json
```

### Architectural rules

1. **`app/`** — Route definitions only. Pages are thin wrappers that import from `features/`.
2. **`features/`** — Business logic, components, hooks, and types grouped by domain.
3. **`shared/`** — Cross-cutting utilities used by multiple features.
4. **No top-level `lib/` or `components/`** — Shared code lives in `shared/` or inside features.
5. **Path alias:** `@/*` maps to project root.

---

## 4. Architecture Pattern

### BFF (Backend-for-Frontend) Proxy

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (Client Component)                                     │
│  useBanners() → fetch("/api/home/banners")                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Next.js API Route (Server)                                     │
│  app/api/home/banners/route.ts                                  │
│  • Reads env (BACKEND_URL, ZONE_ID)                             │
│  • Adds headers (zoneId, moduleId, lat/lng, Authorization)    │
│  • fetch(BACKEND_URL + path, { next: { revalidate } })          │
│  • Returns { success, data } envelope                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  External Shellafood API                                        │
│  NEXT_PUBLIC_API_URL (e.g. https://api.shellafood.com)          │
└─────────────────────────────────────────────────────────────────┘
```

### Server vs Client split

| Layer | Role |
|-------|------|
| **Server Components** (`app/**/page.tsx`) | Metadata/SEO, read cookies, pass `isAuthenticated` props |
| **Client Components** (`features/**`) | UI, data hooks, interactivity (`"use client"`) |
| **API Routes** (`app/api/**`) | Proxy to backend, hide secrets, normalize responses |

---

## 5. Routing & Pages

### Public routes (no auth guard)

| URL | File | Renders |
|-----|------|---------|
| `/` | `app/page.tsx` | Redirect → `/onboarding` |
| `/onboarding` | `app/onboarding/page.tsx` | `OnboardingScreens` |
| `/auth` | `app/auth/page.tsx` | `AuthFlowPage` (OTP flow) |

### Protected routes (`app/(main)/layout.tsx`)

Guard: redirects to `/auth` if neither `access_token` nor `guest_id` cookie exists.

| URL | Query params | Feature component |
|-----|--------------|-------------------|
| `/home` | — | `HomePage` |
| `/search` | `module_id` | `SearchPage` |
| `/modules/[id]` | `module_name` | `ModulePage` |
| `/stores/[id]` | `module_id` | `StorePage` |
| `/stores/[id]/categories` | `categoryId` | `CategoriesPage` |
| `/items/[id]` | `module_id` | `ItemPage` |
| `/cart` | — | Stub (`<div>CartPage</div>`) |
| `/discounts` | — | Stub |
| `/my-orders` | — | Stub |
| `/profile` | — | Stub |

### Layout hierarchy

```
app/layout.tsx          → <html lang="ar" dir="rtl">
  app/(main)/layout.tsx → Auth guard + Navbar + pb-[68px] for bottom nav
    page content
```

### Error boundaries

- `app/error.tsx` — Root
- `app/auth/error.tsx` — Auth route
- `app/onboarding/error.tsx` — Onboarding route

### SEO

Pages define rich `metadata` or `generateMetadata` with Arabic titles, Open Graph, Twitter cards, and `metadataBase: https://shellafood.com`.

---

## 6. API Layer (BFF)

### Response envelope

All API routes use `shared/lib/api-response.ts`:

```typescript
// Success
{ "success": true, "data": T }

// Error
{ "success": false, "message": "..." }
```

Helpers: `apiSuccess(data, status)`, `apiError(message, status)`, `unwrap(response)` (client-side).

### Complete API route map

#### Auth (`/api/auth/*`)

| Route | Method | Backend endpoint | Auth |
|-------|--------|------------------|------|
| `/api/auth/guest` | POST | `POST /api/v1/auth/guest/request` | No |
| `/api/auth/send-otp` | POST | `POST /api/v2/auth/send-otp` | No |
| `/api/auth/verify-otp` | POST | `POST /api/v2/auth/verify-otp` | No |
| `/api/auth/register` | POST | `POST /api/v2/auth/register` | No |
| `/api/auth/session` | POST, DELETE | Cookie management (no backend) | No |

#### Home (`/api/home/*`)

| Route | Method | Backend endpoint | Auth |
|-------|--------|------------------|------|
| `/api/home/banners` | GET | `GET /api/v1/banners?featured=1` | No |
| `/api/home/modules` | GET | `GET /api/v2/modules?zone_id=` | No |
| `/api/home/current-offers` | GET | `GET /api/v2/stores/offers` | No |
| `/api/home/discounted-stores` | GET | `GET /api/v2/stores/discounted` | No |
| `/api/home/recent-orders` | GET | `GET /api/v1/customer/order/recent` | **Yes** |

#### Module (`/api/module/*`)

| Route | Method | Backend endpoint | Auth |
|-------|--------|------------------|------|
| `/api/module/categories` | GET | `GET /api/v2/categories` | No |
| `/api/module/offers` | GET | `GET /api/v1/offers/active` | No |
| `/api/module/current-offers` | GET | `GET /api/v2/stores/offers` | No |
| `/api/module/popular-brands` | GET | `GET /api/v2/brands` | No |
| `/api/module/recent-orders` | GET | `GET /api/v1/customer/order/recent` | **Yes** |
| `/api/module/stores` | GET | `GET /api/v2/stores` (paginated + filters) | No |

#### Search (`/api/search/*`)

| Route | Method | Backend endpoint | Auth |
|-------|--------|------------------|------|
| `/api/search/popular-search` | GET | `GET /api/v2/search/popular` | No |
| `/api/search/popular-brands` | GET | `GET /api/v2/brands` | No |

#### Store (`/api/store/*`)

| Route | Method | Backend endpoint | Auth |
|-------|--------|------------------|------|
| `/api/store/details` | GET | `GET /api/v2/stores/{id}` | No |
| `/api/store/categories/details` | GET | `GET /api/v2/stores/{id}/categories` | No |
| `/api/store/categories/[id]` | GET | `GET /api/v2/stores/{storeId}/categories/{id}` | No |

#### Item (`/api/item/*`)

| Route | Method | Backend endpoint | Auth |
|-------|--------|------------------|------|
| `/api/item/details` | GET | `GET /api/v1/items/details/{id}` | No |
| `/api/item/related` | GET | `GET /api/v1/items/related-items/{id}` | No |

### Common backend request headers

| Header | Source | Purpose |
|--------|--------|---------|
| `zoneId` | `process.env.ZONE_ID` | Geo-scoped data |
| `moduleId` | Query param or env | Module context |
| `latitude` / `longitude` | Env or query | Store distance/sorting |
| `X-Localization: ar` | Hardcoded | Arabic content |
| `Accept-Language: ar` | Hardcoded | Arabic content |
| `Authorization: Bearer {token}` | Cookie `access_token` | Authenticated endpoints |

### Caching

Most GET routes use ISR-style revalidation:

```typescript
fetch(url, { next: { revalidate: Number(process.env.REVALIDATE_TIME) } })
```

---

## 7. Data Fetching Patterns

### Standard hook pattern

Every data hook follows the same structure:

```typescript
"use client";

export function useExample() {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/...");
      const json = await res.json() as ApiResponse<T>;
      const data = unwrap(json);  // throws if success=false
      setData(data);
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, isLoading, error, refetch: fetchData };
}
```

### All hooks (21 total)

| Hook | Feature | Endpoint / Storage |
|------|---------|-------------------|
| `useAuth` | auth | `/api/auth/*` — multi-step OTP state machine |
| `useBanners` | home | `/api/home/banners` |
| `useModules` | home | `/api/home/modules` |
| `useCurrentOffers` | home | `/api/home/current-offers` |
| `useDiscountedStores` | home | `/api/home/discounted-stores` |
| `useRecentOrders` | home | `/api/home/recent-orders` (auth required) |
| `useCategories` | module | `/api/module/categories` |
| `useOffers` | module | `/api/module/offers` |
| `useCurrentOffers` | module | `/api/module/current-offers` |
| `useRecentOrders` | module | `/api/module/recent-orders` (auth required) |
| `usePopularBrands` | module | `/api/module/popular-brands` |
| `useStores` | module | `/api/module/stores` — pagination + filters |
| `useStoreDetails` | store | `/api/store/details` |
| `useStoreCategories` | store | `/api/store/categories/details` |
| `useCategories` | categories | Composes `useCategoryDetail` |
| `useCategoryDetail` | categories | `/api/store/categories/[id]` — ref cache |
| `useItemDetails` | item | `/api/item/details` — composes `useRelatedItems` |
| `useRelatedItems` | item | `/api/item/related` |
| `usePopularSearch` | search | `/api/search/popular-search` |
| `usePopularBrands` | search | `/api/search/popular-brands` |
| `useRecentSearches` | search | `localStorage` key `shellafood:recent-searches` |

### Advanced patterns

#### `useStores` — Infinite scroll + filters

- Page size: 12
- Filters: `categoryId`, `hasOffer`, `freeDelivery`, `topRated`, `openNow`, `under30Min`
- Uses `AbortController` to cancel in-flight requests on filter change
- `loadMore()` appends results; `refetch()` resets offset

#### `useCategoryDetail` — Tab cache

- `useRef<Map<categoryId, data>>` caches fetched category products
- Avoids re-fetch when switching tabs back

#### `useAuth` — State machine

Steps: `welcome` → `enter-phone` → `otp` → `create` (new users) → redirect `/home`

Shared `post<T>()` helper for auth API calls.

### State management summary

| Concern | Mechanism |
|---------|-----------|
| Server auth | Next.js `cookies()` in layouts/pages |
| Client data | Per-hook `useState` + `useEffect` |
| Auth flow | `useAuth` local state |
| Search history | `localStorage` (max 12 entries) |
| Category cache | `useRef<Map>` |
| Global state | **None** (no Context, Zustand, Redux) |

---

## 8. Authentication & Session

### Auth flow diagram

```
Welcome Screen
    │
    ├─ Guest → POST /api/auth/guest → POST /api/auth/session (guest_id) → /home
    │
    └─ Phone → Enter Phone → POST /api/auth/send-otp
                    │
                    ▼
              OTP Screen → POST /api/auth/verify-otp
                    │
        ┌───────────┴───────────┐
        │                       │
   is_existed: true        is_existed: false
        │                       │
   save token+user          Create Account screen
        │                  POST /api/auth/register
        │                       │
        └───────────┬───────────┘
                    ▼
              POST /api/auth/session → /home
```

### Cookies

| Cookie | Key | httpOnly | Purpose |
|--------|-----|----------|---------|
| Access token | `access_token` | **Yes** | Bearer token for backend |
| User profile | `auth_user` | No | Serialized `AuthUser` for UI |
| Guest ID | `guest_id` | No | Guest session (JS-readable) |

Managed by `features/auth/lib/auth.lib.ts` via `/api/auth/session`.

### Route protection

- **Location:** `app/(main)/layout.tsx` (not middleware)
- **Rule:** Must have `access_token` OR `guest_id`
- **Logout:** `DELETE /api/auth/session` clears all cookies
- **No `middleware.ts`** exists in the repo

### Auth types

Defined in `features/auth/types/auth.types.ts`:

- `AuthUser`, `AuthStep`, `COOKIE_KEYS`
- `SendOtpRequest/Response`, `VerifyOtpRequest/Response`
- `RegisterRequest/Response`, `GuestRequestResponse`

---

## 9. Feature Modules

### `features/auth`

| File | Purpose |
|------|---------|
| `components/AuthFlowPage.tsx` | Orchestrates auth screens |
| `components/WelcomeScreen.tsx` | Guest or phone login entry |
| `components/EnterPhoneScreen.tsx` | Phone input |
| `components/OtpScreen.tsx` | OTP verification |
| `components/CreateAccountScreen.tsx` | New user registration |
| `components/NumericKeypad.tsx` | Custom OTP keypad |
| `hooks/useAuth.ts` | Auth state machine |
| `lib/auth.lib.ts` | Session cookie helpers |
| `types/auth.types.ts` | All auth types |

### `features/home`

| Component | Hook | Data |
|-----------|------|------|
| `HomePage` | — | Composes all sections |
| `Topbar` | — | Location, search link |
| `Banners` | `useBanners` | Featured banners + campaigns |
| `Modules` | `useModules` | Service modules grid |
| `DiscountedStores` | `useDiscountedStores` | Stores with discounts |
| `CurrentOffers` | `useCurrentOffers` | Active store offers |
| `RecentOrders` | `useRecentOrders` | User's recent orders (auth) |

### `features/module`

| Component | Hook | Data |
|-----------|------|------|
| `ModulePage` | — | Module landing page |
| `topbar` | — | Module header |
| `Categories` | `useCategories` | Module categories |
| `Offers` | `useOffers` | Promotional offers |
| `CurrentOffers` | `useCurrentOffers` | Store offers carousel |
| `RecentOrders` | `useRecentOrders` | Recent orders (auth) |
| `PopularBrands` | `usePopularBrands` | Brand logos |
| `Stores` | `useStores` | Paginated store list + filters |

### `features/store`

| Component | Hook | Data |
|-----------|------|------|
| `StorePage` | `useStoreDetails`, `useStoreCategories` | Store header, categories, products (~750 lines) |

### `features/categories`

| Component | Hook | Data |
|-----------|------|------|
| `CategoriesPage` | `useCategories`, `useCategoryDetail` | Category tabs, product grid, load-more |

### `features/item`

| Component | Hook | Data |
|-----------|------|------|
| `ItemPage` | `useItemDetails` | Product detail + related items |

### `features/search`

| Component | Hook | Data |
|-----------|------|------|
| `SearchPage` | — | Search UI shell |
| `SearchBar` | — | Input (no live search API wired) |
| `RecentSearches` | `useRecentSearches` | localStorage history |
| `PopularSearch` | `usePopularSearch` | Popular search terms |
| `PopularBrands` | `usePopularBrands` | Popular brands |

### `features/layout`

| Component | Purpose |
|-----------|---------|
| `Navbar` | Fixed bottom nav: home, cart, my-orders, discounts, profile |

### `features/onboarding`

| Component | Purpose |
|-----------|---------|
| `OnboardingScreens` | Swipeable intro → navigates to `/auth` |

---

## 10. Shared Utilities

### `shared/lib/api-response.ts`

```typescript
export interface ApiSuccess<T> { success: true; data: T; }
export interface ApiError { success: false; message: string; }
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function apiSuccess<T>(data: T, status?: number): NextResponse;
export function apiError(message: string, status?: number): NextResponse;
export function unwrap<T>(response: ApiResponse<T>): T;
```

Used by **all** API routes and **all** client hooks.

### `features/auth/lib/auth.lib.ts`

- `saveSession(token, user)` → POST `/api/auth/session`
- `saveGuestId(guestId)` → POST `/api/auth/session`
- `clearSession()` → DELETE `/api/auth/session`
- `readCookie(name)`, `getGuestId()` — client-side cookie readers

---

## 11. Types & Conventions

### File naming

| Pattern | Example |
|---------|---------|
| Components | `PascalCase.tsx` |
| Hooks | `useCamelCase.ts` |
| Types | `kebab-case.types.ts` |
| API routes | `route.ts` |
| Pages | `page.tsx` |

### Type organization

Each feature has a `types/` folder with response/request interfaces matching backend shapes:

```
features/home/types/banners.types.ts      → Banner, Campaign, GetBannersResponse
features/module/types/stores.types.ts     → Store, StoreFilters, GetStoresResponse
features/store/types/store-details.types.ts
```

### Code conventions

1. Pages in `app/` are thin — they import feature components and define metadata.
2. All client data fetching goes through `/api/*` routes, never directly to backend.
3. Hooks return `{ data, isLoading, error, refetch }` (or extended variants).
4. Arabic UI strings are inline (no translation keys).
5. `"use client"` directive on all interactive components and hooks.

---

## 12. Configuration & Environment

### Required environment variables

```env
NEXT_PUBLIC_API_URL=https://api.shellafood.com   # Backend base URL
ZONE_ID=1                                         # Zone header for geo data
REVALIDATE_TIME=3600                              # ISR revalidation (seconds)
NEXT_PUBLIC_LATITUDE=24.7136                      # Default coordinates
NEXT_PUBLIC_LONGITUDE=46.6753
MODULE_ID=1                                       # Default module (some routes)
NODE_ENV=production                               # Cookie secure flag
```

### Key config files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Image CDN hosts, AVIF/WebP, mobile-first sizes, Turbopack |
| `tsconfig.json` | Strict mode, `@/*` path alias, ES2017 target |
| `tailwind.config.ts` | `darkMode: "class"`, content paths, marquee animations |
| `postcss.config.mjs` | `@tailwindcss/postcss` (Tailwind v4) |
| `vercel.json` | Disables auto-deploy for `dev` branch |

### Image CDN hosts (next.config.mjs)

`shellafood.com`, `dev.shelafood.com`, `images.deliveryhero.io`, Azure blob storage, CloudFront, and others.

### Postman collection

`postman/Shellafood API.json` — mirrors backend endpoints for manual testing.

---

## 13. UI & Styling

### Global styles (`app/global.css`)

- `@import "tailwindcss"` + `tw-animate-css`
- Brand green: `#30913F`
- Swiper overrides: `.banner-swiper`, `.offers-swiper`

### Design approach

- **Mobile-first** responsive design
- **RTL** layout (`dir="rtl"`, `lang="ar"`)
- **Bottom navigation** (68px padding on main content)
- **Swiper** carousels for banners and offers
- **Framer Motion** for transitions (onboarding, auth screens)

### Breakpoints (Tailwind defaults)

```
sm: 640px | md: 768px | lg: 1024px | xl: 1280px | 2xl: 1536px
```

---

## 14. Implementation Maturity Matrix

Use this table when rating project completeness:

| Area | Status | Notes |
|------|--------|-------|
| Onboarding | ✅ Complete | Swipeable intro screens |
| Auth (OTP + Guest) | ✅ Complete | Full flow with cookie session |
| Home feed | ✅ Complete | Banners, modules, offers, stores, orders |
| Module page | ✅ Complete | Categories, offers, brands, stores w/ filters |
| Store page | ✅ Complete | Header, categories, products |
| Category drill-down | ✅ Complete | Tabs, pagination, cache |
| Item detail | ✅ Complete | Details + related items |
| Search UI | 🟡 Partial | Popular terms/brands only; no live search |
| Cart | ❌ Stub | Empty placeholder page |
| Profile | ❌ Stub | Empty placeholder page |
| My Orders | ❌ Stub | Empty placeholder page |
| Discounts | ❌ Stub | Empty placeholder page |
| i18n | ❌ Not wired | Dependency only; Arabic hardcoded |
| Dark mode | ❌ Not wired | `next-themes` not used |
| SWR / React Query | ❌ Not used | Manual fetch in all hooks |
| Global cart state | ❌ Missing | No Context/localStorage cart |
| Middleware auth | ❌ Missing | Layout-level guard only |
| English `/en` route | ❌ Missing | Referenced in metadata only |
| Order tracking | ❌ Missing | Described in README only |
| Pick & Order | ❌ Missing | Described in README only |
| Serve Me | ❌ Missing | Described in README only |

---

## 15. AI Evaluation Criteria

When rating this project, consider these dimensions:

### Architecture (weight: 25%)

| Criterion | What to look for |
|-----------|------------------|
| Separation of concerns | `app/` routes vs `features/` logic vs `shared/` utils |
| BFF pattern | Consistent proxy layer, no direct backend calls from client |
| Feature slicing | Domain-grouped folders with co-located hooks/types/components |
| Type safety | TypeScript strict mode, typed API responses |

**Strengths:** Clean BFF, consistent API envelope, feature-sliced structure.
**Weaknesses:** No middleware, duplicated hook names across features (`useCategories`, `useCurrentOffers`).

### Data Fetching (weight: 20%)

| Criterion | What to look for |
|-----------|------------------|
| Consistency | All hooks follow same fetch → unwrap pattern |
| Error handling | try/catch + error state in hooks |
| Caching | ISR via `revalidate` on server; client ref cache in categories |
| Advanced patterns | Pagination, AbortController, filter state in `useStores` |

**Strengths:** Predictable hook API, server-side caching.
**Weaknesses:** No SWR/React Query (duplicate requests, no dedup), manual loading state everywhere.

### Security (weight: 15%)

| Criterion | What to look for |
|-----------|------------------|
| Token storage | httpOnly cookie for `access_token` |
| XSS protection | Token not readable by JS |
| Route protection | Layout-level cookie check |
| API proxy | Backend URL hidden from client |

**Strengths:** httpOnly token, BFF hides backend.
**Weaknesses:** No middleware, `auth_user` cookie is JS-readable, no CSRF tokens.

### Code Quality (weight: 15%)

| Criterion | What to look for |
|-----------|------------------|
| TypeScript usage | Strict, typed responses |
| Component size | `StorePage.tsx` is ~750 lines (large) |
| DRY | Some duplication between home/module hooks |
| Naming | Consistent file/folder conventions |

### UX / UI (weight: 10%)

| Criterion | What to look for |
|-----------|------------------|
| RTL support | Native `dir="rtl"` |
| Mobile-first | Bottom nav, responsive grids |
| Loading states | Per-hook `isLoading` |
| Error states | Per-hook `error` (display varies by component) |

### Completeness (weight: 15%)

| Criterion | What to look for |
|-----------|------------------|
| Core shopping flow | Home → Module → Store → Item works |
| Auth flow | Guest + OTP complete |
| Stub pages | 4 of 13 pages are placeholders |
| README accuracy | README overstates implemented features |

---

## 16. Known Gaps & Technical Debt

### High priority

1. **Stub pages** — Cart, Profile, My Orders, Discounts need implementation.
2. **No live search** — SearchBar has no API integration.
3. **README mismatch** — Root README describes features not in codebase; use this doc instead.

### Medium priority

4. **SWR unused** — Either adopt it or remove from dependencies.
5. **i18n unused** — Either wire i18next or remove; metadata references `/en` that doesn't exist.
6. **No middleware** — Auth guard only in `(main)/layout.tsx`; API routes handle auth per-endpoint.
7. **Large components** — `StorePage.tsx` could be split into sub-components.
8. **Duplicate hook names** — `useCategories` and `useCurrentOffers` exist in both `home` and `module` features.

### Low priority

9. **No global error toast** — Errors stored in hook state; inconsistent UI feedback.
10. **No tests** — No test files found in the repo.
11. **No `public/` images** — Metadata references `/images/og-image.png` but folder may be missing.
12. **Dark mode** — `next-themes` and `darkMode: "class"` configured but not used.

---

## Quick Reference: User Journey Data Flow

```
/onboarding → /auth (guest or OTP)
    → /home
        useBanners, useModules, useDiscountedStores, useCurrentOffers, useRecentOrders
    → /modules/[id]
        useCategories, useOffers, useCurrentOffers, usePopularBrands, useStores
    → /stores/[id]
        useStoreDetails, useStoreCategories
    → /stores/[id]/categories?categoryId=
        useCategories, useCategoryDetail (cached)
    → /items/[id]
        useItemDetails → useRelatedItems
    → /search?module_id=
        usePopularSearch, usePopularBrands, useRecentSearches (localStorage)
```

---

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npm run clean    # Remove .next cache
```

---

*This document should be updated whenever routes, hooks, or architecture change.*
