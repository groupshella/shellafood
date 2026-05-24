'use client';

/**
 * usePayment — payment selection state only
 *
 * Owns:
 *   selectedPaymentMethod   — which method tab is active
 *   selectedOfflineMethodId — which sub-method inside "offline"
 *   offlineCustomerNote     — optional free-text note for offline
 *   offlineFieldValues      — dynamic fields for the chosen offline method
 *
 * Knows nothing about: balances, API, validation, checkout
 */
import { useState, useCallback } from 'react';
import { PaymentMethod, UsePaymentReturn } from '../types/cart.types';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePayment(): UsePaymentReturn {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedOfflineMethodId, setSelectedOfflineMethodId] = useState<string | null>(null);
  const [offlineCustomerNote, setOfflineCustomerNote] = useState('');
  const [offlineFieldValues, setOfflineFieldValues] = useState<Record<string, string>>({});

  /**
   * Switching away from 'offline' resets all offline sub-state
   * so stale data never bleeds into another method's checkout payload.
   */
  const selectPaymentMethod = useCallback((method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    if (method !== 'offline') {
      setSelectedOfflineMethodId(null);
      setOfflineCustomerNote('');
      setOfflineFieldValues({});
    }
  }, []);

  /**
   * Switching offline sub-method resets its field values
   * because a different method may have different required fields.
   */
  const selectOfflineMethod = useCallback((methodId: string) => {
    setSelectedOfflineMethodId(methodId);
    setOfflineFieldValues({});
  }, []);

  /** Update a single dynamic field by name. */
  const setOfflineFieldValue = useCallback((fieldName: string, value: string) => {
    setOfflineFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  return {
    selectedPaymentMethod,
    selectedOfflineMethodId,
    offlineCustomerNote,
    offlineFieldValues,
    selectPaymentMethod,
    selectOfflineMethod,
    setOfflineCustomerNote,
    setOfflineFieldValue,
  };
}
