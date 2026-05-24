// src/shared/hooks/useTranslation.ts
import { useState, useEffect, useCallback } from 'react';
import { translationService } from '@/shared/services/translationService';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    translationService.getSavedLanguage()
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const userLanguage = translationService.detectBrowserLanguage();

  useEffect(() => {
    setShouldShowPrompt(translationService.shouldShowPrompt());

    // Auto-apply saved language on mount
    const saved = translationService.getSavedLanguage();
    if (saved && saved !== 'ar') {
      translationService.translateTo(saved);
    }
  }, []);

  const translateTo = useCallback(async (code: string) => {
    if (code === currentLanguage) return;
    setIsTranslating(true);
    try {
      await translationService.translateTo(code);
      setCurrentLanguage(code);
      setShouldShowPrompt(false);
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const resetTranslation = useCallback(async () => {
    setIsTranslating(true);
    try {
      await translationService.resetTranslation();
      setCurrentLanguage('ar');
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const dismissPrompt = useCallback(() => {
    translationService.markPromptSeen();
    setShouldShowPrompt(false);
  }, []);

  return {
    currentLanguage,
    isTranslating,
    shouldShowPrompt,
    userLanguage,
    translateTo,
    resetTranslation,
    dismissPrompt,
  };
}