// src/shared/services/translationService.ts

const PAGE_LANGUAGE = 'ar';
const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh-CN', 'ja', 'ko', 'hi', 'ur'];
const STORAGE_KEY = 'preferred_language';
const PROMPT_KEY  = 'translate_prompt_seen';

const isClient = typeof window !== 'undefined';

const storage = {
  get:    (key: string)          => isClient ? localStorage.getItem(key) : null,
  set:    (key: string, val: string) => { if (isClient) localStorage.setItem(key, val); },
  remove: (key: string)          => { if (isClient) localStorage.removeItem(key); },
};

function setGoogCookie(value: string) {
  if (!isClient) return;
  document.cookie = `googtrans=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

function clearGoogCookie() {
  if (!isClient) return;
  document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// ── Singleton loader ───────────────────────────────────────────────────────
let loadPromise: Promise<void> | null = null;

function loadGoogleTranslate(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    if (!isClient) { reject('SSR'); return; }

    // Ensure hidden container exists
    if (!document.getElementById('google_translate_element')) {
      const el = document.createElement('div');
      el.id = 'google_translate_element';
      el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
      document.body.appendChild(el);
    }

    (window as any).googleTranslateElementInit = () => {
      try {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: PAGE_LANGUAGE,
            includedLanguages: SUPPORTED_LANGUAGES.join(','),
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
        resolve();
      } catch (e) {
        reject(e);
      }
    };

    // Don't add script twice
    if (document.getElementById('google-translate-script')) return;

    const script = document.createElement('script');
    script.id    = 'google-translate-script';
    script.src   = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => { loadPromise = null; reject('Script load failed'); };
    document.head.appendChild(script);
  });

  return loadPromise;
}

// ── Wait for .goog-te-combo (up to 10s) ───────────────────────────────────
async function waitForSelector(): Promise<HTMLSelectElement | null> {
  for (let i = 0; i < 100; i++) {
    const el = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (el) return el;
    await new Promise(r => setTimeout(r, 100));
  }
  return null;
}

// ── Apply language via selector ────────────────────────────────────────────
async function applyLanguage(code: string): Promise<boolean> {
  await loadGoogleTranslate();
  const select = await waitForSelector();
  if (!select) return false;
  select.value = code;
  select.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

// ── Public service ─────────────────────────────────────────────────────────
export const translationService = {
  getSavedLanguage: (): string =>
    storage.get(STORAGE_KEY) ?? PAGE_LANGUAGE,

  saveLanguage:  (code: string) => storage.set(STORAGE_KEY, code),
  clearLanguage: ()             => storage.remove(STORAGE_KEY),
  markPromptSeen:()             => storage.set(PROMPT_KEY, '1'),

  detectBrowserLanguage(): string {
    if (!isClient) return PAGE_LANGUAGE;
    const lang = navigator.language.split('-')[0].toLowerCase();
    return SUPPORTED_LANGUAGES.some(l => l.startsWith(lang)) ? lang : PAGE_LANGUAGE;
  },

  shouldShowPrompt(): boolean {
    if (!isClient) return false;
    if (storage.get(PROMPT_KEY) || storage.get(STORAGE_KEY)) return false;
    return this.detectBrowserLanguage() !== PAGE_LANGUAGE;
  },

  async translateTo(code: string): Promise<void> {
    if (!isClient) return;
    const normalized = code === 'zh' ? 'zh-CN' : code;
    this.saveLanguage(normalized);
    setGoogCookie(`/${PAGE_LANGUAGE}/${normalized}`);
    // Try instant DOM approach — no reload ever
    await applyLanguage(normalized);
  },

  async resetTranslation(): Promise<void> {
    if (!isClient) return;
    this.clearLanguage();
    clearGoogCookie();
    await applyLanguage(PAGE_LANGUAGE);
  },
};