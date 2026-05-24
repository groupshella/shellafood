"use client";

import { useTranslation } from '@/shared/hooks/useTranslation';
import { TranslationPrompt } from '@/shared/components/TranslationPrompt';

export function TranslationProvider() {
  const {
    shouldShowPrompt,
    userLanguage,
    isTranslating,
    translateTo,
    dismissPrompt
  } = useTranslation();

  return (
    <>
      {/* Translation Prompt */}
      <TranslationPrompt
        isVisible={shouldShowPrompt}
        userLanguage={userLanguage}
        onAccept={translateTo}
        onDismiss={dismissPrompt}
        isTranslating={isTranslating}
      />
    </>
  );
}

