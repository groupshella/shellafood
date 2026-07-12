# i18n Bilingual Conversion Prompt

> Paste this prompt into Cursor chat (with the target file attached via @) to convert any component to support Arabic + English.

---

## PROMPT (copy everything below this line)

---

You are a senior React/Next.js engineer expert in internationalization. Your task is to convert the attached component file to support **Arabic and English** inline — no separate translation files, no i18n libraries.

### The language hook

The project uses a single hook located at `@/features/language/useLanguage`:

```typescript
import { useLanguage } from "@/features/language/useLanguage";

// Inside any "use client" component:
const { isArabic, locale, setLanguage, toggleLanguage } = useLanguage();
// isArabic: true  → user selected Arabic (RTL)
// isArabic: false → user selected English (LTR)
```

The hook:
- Reads `localStorage["shellafood-lang"]` on mount
- Updates `html[lang]` and `html[dir]` automatically
- Syncs across all components on the same page via a custom event
- Requires **no Context provider** — just import and call

---

### Conversion rules — follow ALL of them strictly

#### 1. Add the hook
At the top of the component function body add:
```tsx
const { isArabic } = useLanguage();
```

#### 2. Every visible string becomes an inline ternary
**Never** create a separate strings object or a translation file.
Replace every Arabic string with a ternary directly inside the JSX tag:

```tsx
// ✅ CORRECT
<h1>{isArabic ? "كل احتياجاتك في تطبيق واحد" : "All your needs in one app"}</h1>
<p>{isArabic ? "تسوّق الآن" : "Shop now"}</p>
<button>{isArabic ? "التالي" : "Next"}</button>

// ❌ WRONG — do not do this
const t = isArabic ? ARABIC : ENGLISH;
<h1>{t.title}</h1>
```

#### 3. Attribute strings — same ternary pattern
Apply to every string attribute that is visible or affects UX:

```tsx
aria-label={isArabic ? "إغلاق" : "Close"}
placeholder={isArabic ? "ابحث هنا..." : "Search here..."}
title={isArabic ? "صورة الملف الشخصي" : "Profile photo"}
alt={isArabic ? "حقيبة تسوق" : "Shopping bag"}
```

#### 4. Layout direction
If the component sets `dir` or `lang` on a container, make them reactive:

```tsx
// Before
<div dir="rtl" lang="ar">

// After
<div dir={isArabic ? "rtl" : "ltr"} lang={locale}>
```

If the component uses `text-start`, `text-end`, `start-*`, `end-*` Tailwind classes they are already RTL-aware — **do not change them**.  
Only flip `text-right` ↔ `text-left` if they are hardcoded and the meaning depends on direction.

#### 5. Module-level string constants
If the file has top-level `const` objects with Arabic strings (e.g. `const STEPS = [{ title: "..." }]`), refactor them to carry both languages:

```tsx
// Before
const STEPS = [{ id: "a", title: "خطوة أولى" }];

// After
const STEPS = [
  {
    id: "a",
    ar: { title: "خطوة أولى" },
    en: { title: "First step" },
  },
];

// Usage inside the component:
const content = isArabic ? step.ar : step.en;
<h2>{content.title}</h2>
```

#### 6. Do NOT touch
- Tailwind class names — do not translate or modify
- Import paths
- Logic, state, hooks other than adding `useLanguage`
- Dark mode classes
- Numbers, icons, SVG paths, image `src` values
- Comments
- Type definitions (unless you're adding bilingual content types)

#### 7. English translation quality
Translate naturally — not word-for-word. The app is a Saudi food delivery / e-commerce platform called **Shellafood** (شيلة فود). Keep brand names unchanged: **شيلة**, **قيدها (Qidha)**.

#### 8. "use client" requirement
`useLanguage` is a client hook. If the file does not already have `"use client"` at the top, add it as the very first line.

---

### Output requirements

1. Return the **complete file** — not a diff, not partial snippets.
2. Preserve the exact file structure, component names, and export names.
3. Do not add explanatory comments about the changes you made.
4. Do not wrap the output in any markdown — just the raw `.tsx` / `.ts` file content.
5. After the file, output a one-line summary: `// Converted: <N> strings translated, <M> attributes updated`

---

### Example before → after

**Before:**
```tsx
export function WelcomeBanner() {
  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold">مرحباً بك</h1>
      <p>اكتشف أفضل العروض اليومية</p>
      <button aria-label="ابدأ الآن">ابدأ الآن</button>
    </div>
  );
}
```

**After:**
```tsx
"use client";
import { useLanguage } from "@/features/language/useLanguage";

export function WelcomeBanner() {
  const { isArabic, locale } = useLanguage();

  return (
    <div dir={isArabic ? "rtl" : "ltr"} lang={locale}>
      <h1 className="text-2xl font-bold">
        {isArabic ? "مرحباً بك" : "Welcome"}
      </h1>
      <p>{isArabic ? "اكتشف أفضل العروض اليومية" : "Discover the best daily deals"}</p>
      <button aria-label={isArabic ? "ابدأ الآن" : "Get started"}>
        {isArabic ? "ابدأ الآن" : "Get started"}
      </button>
    </div>
  );
}
```

---

Now convert the attached file following all rules above.
