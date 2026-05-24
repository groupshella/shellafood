// src/shared/components/LanguageSelector.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, Loader2 } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

const LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { currentLanguage, isTranslating, translateTo, resetTranslation } = useTranslation();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const current = LANGUAGES.find(l => l.code === currentLanguage) ?? LANGUAGES[0];

  const handleSelect = async (code: string) => {
    setIsOpen(false);
    if (code === 'ar') await resetTranslation();
    else await translateTo(code);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        disabled={isTranslating}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium text-gray-700"
      >
        {isTranslating
          ? <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          : <Globe className="w-4 h-4 text-gray-500" />
        }
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 z-50 w-44 bg-white rounded-xl border border-gray-200 shadow-lg py-1 max-h-80 overflow-y-auto">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              disabled={isTranslating}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 disabled:opacity-50"
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 text-right">{lang.name}</span>
              {currentLanguage === lang.code && (
                <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}