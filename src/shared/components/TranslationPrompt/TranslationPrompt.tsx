// src/shared/components/TranslationPrompt.tsx
"use client";

import React from 'react';
import { X, Languages, Loader2 } from 'lucide-react';

const LANG_INFO: Record<string, { name: string; flag: string }> = {
  en: { name: 'English',   flag: '🇬🇧' },
  fr: { name: 'Français',  flag: '🇫🇷' },
  es: { name: 'Español',   flag: '🇪🇸' },
  de: { name: 'Deutsch',   flag: '🇩🇪' },
  it: { name: 'Italiano',  flag: '🇮🇹' },
  pt: { name: 'Português', flag: '🇵🇹' },
  ru: { name: 'Русский',   flag: '🇷🇺' },
  zh: { name: '中文',      flag: '🇨🇳' },
  ja: { name: '日本語',    flag: '🇯🇵' },
  ko: { name: '한국어',    flag: '🇰🇷' },
  hi: { name: 'हिन्दी',   flag: '🇮🇳' },
  ur: { name: 'اردو',      flag: '🇵🇰' },
};

interface Props {
  isVisible: boolean;
  userLanguage: string;
  isTranslating?: boolean;
  onAccept: (lang: string) => void;
  onDismiss: () => void;
}

export function TranslationPrompt({ isVisible, userLanguage, isTranslating, onAccept, onDismiss }: Props) {
  if (!isVisible) return null;

  const lang = LANG_INFO[userLanguage] ?? LANG_INFO['en'];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4" dir="rtl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Languages className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">ترجمة الصفحة؟</span>
          </div>
          <button
            onClick={onDismiss}
            disabled={isTranslating}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 p-2.5 bg-gray-50 rounded-xl">
          <span className="text-xl">🇸🇦</span>
          <span className="text-gray-400 text-sm">→</span>
          <span className="text-xl">{lang.flag}</span>
          <span className="text-sm text-gray-600 font-medium">{lang.name}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAccept(userLanguage)}
            disabled={isTranslating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            {isTranslating
              ? <><Loader2 className="w-4 h-4 animate-spin" />جاري...</>
              : 'ترجمة'
            }
          </button>
          <button
            onClick={onDismiss}
            disabled={isTranslating}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            لا شكراً
          </button>
        </div>
      </div>
    </div>
  );
}