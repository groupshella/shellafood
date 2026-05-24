import { useCallback, useRef } from 'react';
import { ValidationRule } from '../../shared/types/validation.types';
import { validateForm } from '../../shared/lib/utils';
import { ValidationResult } from '../../shared/types/validation.types';

interface UseFormValidationOptions {
  onValidationError?: (field: string, message: string) => void;
  scrollBehavior?: ScrollBehavior;
  scrollOffset?: number;
}

export function useFormValidation(options: UseFormValidationOptions = {}) {
  const {
    scrollBehavior = 'smooth',
    scrollOffset = 80, // Offset for fixed headers
  } = options;

  // Store refs mapping without causing re-renders
  const refsMap = useRef<Map<string, HTMLElement | null>>(new Map());

  /**
   * Register a field ref
   * Efficient: doesn't cause re-renders
   */
  const registerField = useCallback((field: string, element: HTMLElement | null) => {
    if (element) {
      refsMap.current.set(field, element);
    } else {
      refsMap.current.delete(field);
    }
  }, []);

  /**
   * Scroll to field with optimal performance
   * Uses requestAnimationFrame for smooth scrolling
   */
  const scrollToField = useCallback((field: string) => {
    const element = refsMap.current.get(field);
    if (!element) return;

    // Use requestAnimationFrame for optimal performance
    requestAnimationFrame(() => {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - scrollOffset;

      window.scrollTo({
        top: middle,
        behavior: scrollBehavior,
      });

      // Add highlight effect
      element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'rounded-lg');

      // Remove highlight after animation - use single timeout
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'rounded-lg');
      }, 2000);

      // Focus on the element if it's focusable
      if (element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement) {
        element.focus();
      }
    });
  }, [scrollBehavior, scrollOffset]);

  /**
   * Validate and scroll to first error
   * Returns validation result for further processing
   */
  const validateAndScroll = useCallback((
    data: Record<string, any>,
    rules: ValidationRule[]
  ): ValidationResult => {
    const result = validateForm(data, rules);

    if (!result.isValid && result.firstInvalidField) {
      scrollToField(result.firstInvalidField);

      if (options.onValidationError) {
        const errorMessage = result.errors[result.firstInvalidField];
        options.onValidationError(result.firstInvalidField, errorMessage);
      }
    }

    return result;
  }, [scrollToField, options]);

  return {
    registerField,
    scrollToField,
    validateAndScroll,
  };
}
