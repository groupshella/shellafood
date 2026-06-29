# Shellafood — Project Architecture

A reference for how this codebase is structured and how to work within it.  
Next.js App Router · TypeScript · Tailwind CSS · Arabic RTL.

---

## 1. Philosophy

This project separates **routing** from **business logic**:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Routes | `app/` | URL mapping, metadata, auth guards, composition only |
| Domains | `features/` | All UI, data fetching, types, and domain logic |
| Shared | `shared/` | Utilities used across multiple features |
| Static | `public/` | Images and assets |

**Core idea:** A developer should know what a file does from its name and folder — without opening it.

Every screen is built from the same pieces:

```
page.tsx  →  Shell  →  Suspense  →  Section(s)
```

Routes stay thin. Features own everything else.

---

## 2. Repository Layout

```
shellafood/
├── app/                    # Next.js App Router — routes & BFF API
│   ├── layout.tsx          # Root HTML, RTL, global metadata
│   ├── (main)/             # Authenticated app (home, cart, profile, …)
│   │   └── (modules)/      # Module-specific experiences (markets, hyper-market)
│   ├── auth/               # Auth entry
│   ├── onboarding/         # First-run screens
│   └── api/                # BFF proxy routes (client-side fetch targets)
│
├── features/               # Domain modules — where all logic lives
│   ├── home/
│   ├── markets/
│   ├── hyper-market/       # Nested sub-features (StoreDetails, Categories, Brands)
│   ├── item/
│   ├── search/
│   ├── cart/
│   ├── addresses/
│   ├── my-orders/
│   ├── notifications/
│   ├── auth/
│   ├── onboarding/
│   └── layout/             # Shared layout pieces (e.g. Navbar)
│
├── shared/                 # Cross-feature utilities
│   └── lib/
│
└── public/                 # Static assets grouped by feature
```

**Path alias:** `@/*` maps to the project root (`tsconfig.json`).

---

## 3. Feature Module Anatomy

Each domain under `features/<name>/` follows a consistent internal structure. Not every folder is required — use only what the feature needs.

```
features/<domain>/
├── api/                    # Server-side fetch functions (called from sections or layouts)
├── types/                  # TypeScript interfaces for API responses & domain models
├── actions/                # Server Actions ("use server") — mutations
├── hooks/                  # Client hooks — state, BFF fetch, localStorage, etc.
├── lib/                    # Pure helpers (no React)
├── context/                # React context providers (feature-scoped global state)
├── constants/              # Static data, mock data, config
├── components/
│   ├── <Domain>Shell.tsx   # Page wrapper — layout, topbar, providers
│   ├── Topbar.tsx          # Page header (when needed)
│   ├── <Feature>Context.tsx  # Context + hook (e.g. SearchContext)
│   ├── shared/             # Reusable pieces within this feature only
│   └── sections/<Name>/    # One folder per UI section on a page
│       ├── index.tsx       # Server entry — fetch, guard, decide what to render
│       ├── *Client.tsx     # Client UI — layout, state, events
│       ├── *Card.tsx       # Presentational unit (card, slide, row)
│       ├── *Empty.tsx      # Empty state (optional)
│       └── skeleton.tsx    # Loading placeholder
```

### When to use each data layer

| Mechanism | Location | Use when |
|-----------|----------|----------|
| **Server fetch** | `features/<domain>/api/*.ts` | Section `index.tsx` loads data on the server. Preferred for page content. |
| **BFF route** | `app/api/<domain>/*/route.ts` | Client hooks need data (auth, search, legacy hooks). Proxies external API with `apiSuccess` / `apiError` envelope. |
| **Server Action** | `features/<domain>/actions/*.ts` | Mutations from client (add to cart, save address). Uses cookies, calls backend, revalidates cache tags. |
| **Client hook** | `features/<domain>/hooks/*.ts` | Client-only state, BFF fetch via `unwrap()`, localStorage, debounced search. |
| **Context** | `features/<domain>/context/` | State shared across multiple components in one feature (cart, search). |

### Server fetch pattern

```ts
// features/home/api/banners.ts
export async function getBanners() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/banners`, {
    headers: { Accept: "application/json", zoneId: process.env.ZONE_ID! },
    next: { revalidate: 3600, tags: ["banners", "home-data"] },
  });
  if (!res.ok) throw new Error(`Failed to fetch banners: ${res.status}`);
  return res.json();
}
```

### BFF route pattern

```ts
// app/api/home/banners/route.ts
import { apiSuccess, apiError } from "@/shared/lib/api-response";

export async function GET() {
  const backendRes = await fetch(/* external API */);
  if (!backendRes.ok) return apiError("Failed to get banners", backendRes.status);
  return apiSuccess(await backendRes.json());
}
```

Client hooks consume BFF routes through `unwrap()` from `shared/lib/api-response.ts`, which unwraps the `{ success, data }` envelope.

### Server Action pattern

```ts
// features/cart/actions/add-to-cart.ts
"use server";

export async function addToCart(payload) {
  // read cookies, call external API, updateTag("cart")
  return { success: true, items };
}
```

---

## 4. Section Architecture (Core Pattern)

A **section** is one independent block of UI on a page (banners, modules, cart list, order history). Each section is a folder under `components/sections/`.

### Section `index.tsx` — server entry

- Runs on the server (`async` when fetching).
- Calls `features/<domain>/api/` functions.
- Returns `null` when there is nothing to show (empty guard).
- Passes data as props to `*Client.tsx`.
- Exports a `skeleton` for `Suspense` fallback.
- Never has `"use client"`, never owns layout `className` on the outer wrapper.

**Two export styles (both valid):**

```tsx
// Style A — Object.assign (preferred for skeleton co-location)
export const Banners = Object.assign(
  async function Banners() {
    const { banners } = await getBanners();
    if (banners.length === 0) return null;
    return <BannersClient banners={banners} />;
  },
  { skeleton: BannerSkeleton }
);

// Style B — named export + separate skeleton import
export { default as skeleton } from "./skeleton";
export async function Orders() { /* … */ }
```

### `*Client.tsx` — interactive UI

- `"use client"` at the top.
- Receives data via props (from server section).
- Owns layout (`className`), local state, events, Swiper, animations.
- Never fetches on mount for initial page data — that belongs in `index.tsx`.
- May call Server Actions or context methods for mutations.

### `*Card.tsx` / `*Slide.tsx` — presentational

- Props in, JSX out.
- No fetch, no global state, no side effects.

### `skeleton.tsx` — loading state

- Matches real layout dimensions (`animate-pulse`).
- Used as `<Section.skeleton />` or `<SectionSkeleton />` inside `Suspense`.

---

## 5. Page Composition (`app/`)

`page.tsx` files do **composition only**. No business logic, no direct `fetch`, no layout `className` soup.

```tsx
// app/(main)/home/page.tsx
import { Suspense } from "react";
import { HomeShell } from "@/features/home/components/HomeShell";
import { Banners } from "@/features/home/components/sections/Banners";

export default async function HomePage() {
  return (
    <HomeShell>
      <Suspense fallback={<Banners.skeleton />}>
        <Banners />
      </Suspense>
      {/* more sections… */}
    </HomeShell>
  );
}
```

### What `page.tsx` may contain

- `metadata` export
- Reading cookies for simple flags (e.g. `isAuthenticated`) passed to Shell
- `Suspense` boundaries per section
- Shell + section imports

### What `page.tsx` must not contain

- Direct API calls
- Complex conditional rendering logic
- Inline layout/styling beyond page-level structure

---

## 6. Shell Components

Every route has a **Shell** — a client wrapper that defines the page frame.

| Responsibility | Owner |
|----------------|-------|
| Page layout (`flex`, `gap`, `min-h-screen`) | Shell |
| Topbar / back button | Shell or `Topbar.tsx` |
| Bottom navbar | Shell (imports `features/layout/Navbar`) |
| Feature context providers | Shell (e.g. `SearchProvider`, `CartProvider` is in layout) |
| Section content | Passed as `children` |

```tsx
// features/home/components/HomeShell.tsx
"use client";

export function HomeShell({ isAuthenticated, children }) {
  return (
    <div className="flex flex-col min-h-screen gap-4 mb-16">
      <Topbar />
      {children}
      <Navbar />
    </div>
  );
}
```

---

## 7. Routing & Layouts

### Route groups

| Group | Path prefix | Purpose |
|-------|-------------|---------|
| `(main)` | `/home`, `/cart`, `/profile`, … | Main authenticated app |
| `(main)/(modules)` | `/markets`, `/hyper-market`, `/modules/[id]` | Module-specific store experiences |
| `auth` | `/auth` | Login / OTP / registration flow |
| `onboarding` | `/onboarding` | First-run screens |

Parentheses in folder names are **route groups** — they organize layouts without affecting the URL.

### Layout responsibilities

| Layout | Guards | Provides |
|--------|--------|----------|
| `app/layout.tsx` | — | `<html lang="ar" dir="rtl">`, global CSS |
| `app/(main)/layout.tsx` | Redirect to `/auth` if no token or guest cookie | `CartProvider` with server-fetched initial cart |
| `app/(main)/(modules)/layout.tsx` | Same auth guard | Module route wrapper |

### Route → feature map

| URL | Feature module |
|-----|----------------|
| `/home` | `features/home` |
| `/markets` | `features/markets` |
| `/modules/[id]` | `features/markets` |
| `/hyper-market` | `features/hyper-market/StoreDetails` |
| `/hyper-market/categories` | `features/hyper-market/Categories` |
| `/hyper-market/brands` | `features/hyper-market/Brands` |
| `/items/[id]` | `features/item` |
| `/search` | `features/search` |
| `/notifications` | `features/notifications` |
| `/cart` | `features/cart` |
| `/addresses`, `/addresses/[id]`, `/addresses/add` | `features/addresses` |
| `/my-orders`, `/my-orders/[id]` | `features/my-orders` |
| `/profile` | `features/profile` (or inline in route) |
| `/discounts` | TBD / discounts feature |
| `/auth` | `features/auth` |
| `/onboarding` | `features/onboarding` |

---

## 8. Feature Types

Not every feature looks the same. There are three common shapes:

### A. Section-based page (most features)

Used for: `home`, `markets`, `item`, `search`, `notifications`, `cart`, `addresses`, `my-orders`.

- One `*Shell.tsx` per route.
- Multiple `sections/<Name>/` folders composed in `page.tsx`.
- Data loaded in section `index.tsx` (server) or via context/hooks (client-driven sections).

### B. Screen flow (multi-step UI)

Used for: `auth`, `onboarding`.

- No sections folder — sequential screens as top-level components.
- `useAuth` hook orchestrates steps and talks to `app/api/auth/*` BFF routes.
- Single `page.tsx` renders the flow component.

### C. Nested sub-features

Used for: `hyper-market`.

When one domain has multiple distinct routes with different data needs, split into sub-folders — each with its own `api/`, `types/`, `components/`:

```
features/hyper-market/
├── StoreDetails/     # /hyper-market
├── Categories/       # /hyper-market/categories
└── Brands/           # /hyper-market/brands
```

Each sub-feature is a mini feature module. Routes in `app/(main)/(modules)/hyper-market/` map to the matching sub-folder.

---

## 9. Cross-Cutting Concerns

### Cart (`features/cart/`)

- `CartProvider` wraps the entire `(main)` layout — cart state is available everywhere.
- Initial items fetched server-side in `app/(main)/layout.tsx`.
- Mutations via Server Actions (`add-to-cart`, `update-cart`, `remove-cart-item`, `clear-cart`).
- `useProductCart` hook for product pages to read/increment/decrement without prop drilling.

### Addresses (`features/addresses/`)

- `AddressTopbarBanner` section reused on home (delivery address picker).
- Server Actions for add/delete/zone check.
- `useSelectedAddress` for client-side selected address state.

### Layout (`features/layout/`)

- `Navbar` — bottom navigation shared across main app shells.

### Auth (`features/auth/`)

- Cookie-based session: `ACCESS_TOKEN` (logged in) or `GUEST_ID` (guest).
- `COOKIE_KEYS` defined in `features/auth/types/auth.types.ts`.
- Client auth flow uses BFF routes under `app/api/auth/`.
- `auth.lib.ts` — cookie/localStorage helpers.

---

## 10. Naming Contract

| File / suffix | Server or client | Contains | Never contains |
|---------------|------------------|----------|----------------|
| `page.tsx` | Server (route) | `Suspense`, Shell, section imports, metadata | `fetch`, business logic, layout classes |
| `index.tsx` (section) | Server | `async` fetch, empty guard, pass props to Client | `"use client"`, state, effects |
| `*Client.tsx` | Client | `"use client"`, layout, state, events | Initial data `fetch` |
| `*Card.tsx` / `*Slide.tsx` | Either | Props + JSX | Fetch, global state |
| `skeleton.tsx` | Either | `animate-pulse`, matching dimensions | Logic |
| `*Shell.tsx` | Client | Page frame, providers, children slot | Section data fetching |
| `api/*.ts` | Server | `fetch` to external API, cache tags | React, `"use client"` |
| `actions/*.ts` | Server | `"use server"`, mutations | React components |
| `hooks/*.ts` | Client | `"use client"`, BFF fetch, local state | Server-only imports |
| `route.ts` | Server | BFF proxy, `apiSuccess`/`apiError` | Business UI logic |

---

## 11. Data Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                        │
│    page.tsx (composition)                                       │
│      └── Shell (layout, providers)                              │
│            └── Suspense                                         │
│                  └── Section/index.tsx (server fetch)           │
│                        └── *Client.tsx (interactive UI)         │
│                              └── *Card.tsx (presentational)     │
└─────────────────────────────────────────────────────────────────┘

Server fetch (sections):     features/<domain>/api/  →  External Shellafood API
BFF (client hooks):          app/api/*/route.ts      →  External API
Server Actions (mutations):  features/<domain>/actions/  →  External API  →  revalidateTag
```

**Prefer server fetch in section `index.tsx`** for page content. Use BFF routes when the client must drive the request (auth, live search, SWR). Use Server Actions for writes.

---

## 12. Styling & UI Conventions

- **RTL:** Root layout sets `lang="ar"` and `dir="rtl"`.
- **Tailwind CSS v4** via `app/global.css`.
- **Swiper** for carousels (banners, offers) — overrides in global CSS.
- **Radix UI** for dialogs, popovers, scroll areas.
- **Framer Motion** for animations where needed.
- **Lucide / React Icons** for iconography.
- Feature-level `shared/` for repeated UI within a domain (e.g. `PriceTag`, `ProductCard`).
- Project-level `shared/` only for non-UI utilities.

---

## 13. Environment Variables

Used across `api/`, `actions/`, and BFF routes:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | External Shellafood API base URL |
| `ZONE_ID` | Delivery zone header |
| `MODULE_ID` | Module context for cart/items |
| `REVALIDATE_TIME` | Default ISR revalidate seconds for BFF routes |

---

## 14. How to Add a New Feature

1. **Create the feature folder:** `features/<name>/` with `types/`, `api/`, `components/`.
2. **Add the Shell:** `components/<Name>Shell.tsx` — layout frame, topbar, navbar if needed.
3. **Add sections:** One folder per UI block under `components/sections/<SectionName>/`.
   - `index.tsx` — server fetch + guard
   - `<Section>Client.tsx` — client UI
   - `skeleton.tsx` — loading state
4. **Add the route:** `app/(main)/<route>/page.tsx` — Shell + Suspense + sections only.
5. **Add API layer:** `features/<name>/api/` for server fetch; `app/api/<name>/` only if client hooks need it.
6. **Add mutations:** `features/<name>/actions/` for Server Actions if the feature writes data.
7. **Wire auth:** Ensure the route lives under a layout that applies the correct guard.

### Checklist before merging

- [ ] `page.tsx` has no `fetch` or business logic
- [ ] Each section has `index.tsx` + `*Client.tsx` + `skeleton.tsx`
- [ ] Empty data returns `null` from section `index.tsx`
- [ ] Types live in `features/<name>/types/`, not inline in components
- [ ] File names match the naming contract above

---

## 15. Examples

### Minimal section `index.tsx`

```tsx
import { getBanners } from "@/features/home/api/banners";
import { BannersClient } from "./BannersClient";
import BannerSkeleton from "./skeleton";

export const Banners = Object.assign(
  async function Banners() {
    const { banners } = await getBanners();
    if (banners.length === 0) return null;
    return <BannersClient banners={banners} />;
  },
  { skeleton: BannerSkeleton }
);
```

### Client-only section (no server fetch yet)

```tsx
import { OrdersClient } from "./OrdersClient";
import OrdersSkeleton from "./skeleton";

export const Orders = Object.assign(
  function Orders() {
    return <OrdersClient />;
  },
  { skeleton: OrdersSkeleton }
);
```

### Minimal `page.tsx`

```tsx
import { Suspense } from "react";
import { MyOrdersShell } from "@/features/my-orders/components/MyOrdersShell";
import { Orders } from "@/features/my-orders/components/sections/Orders";

export default function MyOrdersPage() {
  return (
    <MyOrdersShell>
      <Suspense fallback={<Orders.skeleton />}>
        <Orders />
      </Suspense>
    </MyOrdersShell>
  );
}
```

---

## 16. The Rule (Quick Reference)

```
Route composes → Shell frames → Section fetches → Client interacts → Card displays
```

Keep each layer doing one job. When in doubt, put logic in the feature folder, not in `app/`.
