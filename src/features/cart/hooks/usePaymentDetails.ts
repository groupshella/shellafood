'use client';

/**
 * usePaymentDetails — fetches the right data for the selected payment method
 *
 * wallet     → GET /api/cart/payment/wallet-balance   (standard wallet)
 * kaidha     → GET /api/cart/payment/qidha-balance    (Qidha wallet)
 * offline    → GET /api/cart/payment/offline-methods  (list of methods + fields)
 * cash / myfatoorah → nothing to fetch
 *
 * All fetches go through Next.js proxy routes (no token in client headers).
 * Uses AbortController so switching methods cancels the in-flight request.
 *
 * Computes:
 *   hasInsufficientBalance — true when wallet < orderTotal
 *   isPaymentReady         — true when the selected method has all required data
 */
import { useState, useEffect, useMemo } from 'react';
import { OfflineMethod, OfflineMethodField, PaymentMethod, QidhaWallet, UsePaymentDetailsReturn } from '../types/cart.types';

interface MethodConfig {
  fetchesWallet: boolean;
  fetchesQidha: boolean;
  fetchesOffline: boolean;
}

const METHOD_CONFIG: Record<PaymentMethod, MethodConfig> = {
  cash: { fetchesWallet: false, fetchesQidha: false, fetchesOffline: false },
  myfatoorah: { fetchesWallet: false, fetchesQidha: false, fetchesOffline: false },
  wallet: { fetchesWallet: true, fetchesQidha: false, fetchesOffline: false },
  kaidha: { fetchesWallet: false, fetchesQidha: true, fetchesOffline: false },
  offline: { fetchesWallet: false, fetchesQidha: false, fetchesOffline: true },
};

// ─── Fetch helpers (all through Next.js proxy — no auth header needed client-side) ──

async function fetchWalletBalance(signal: AbortSignal): Promise<number> {
  const res = await fetch('/api/cart/payment/wallet-balance', { signal, cache: 'no-store' });
  const data = await res.json().catch(() => ({})) as Record<string, unknown>;
  if (!res.ok) throw new Error((data.error as string) ?? 'Failed to load wallet balance');
  return Number(data.wallet_balance) || 0;
}

async function fetchQidhaWallet(signal: AbortSignal): Promise<QidhaWallet> {
  const res = await fetch('/api/cart/payment/qidha-balance', { signal, cache: 'no-store' });
  const data = await res.json().catch(() => ({})) as Record<string, unknown>;
  if (!res.ok) throw new Error((data.error as string) ?? 'Failed to load Qidha wallet');

  const w = (data.data ?? data) as Record<string, unknown>;
  return {
    availableBalance: Number(w.available_balance) || 0,
    creditLimit: Number(w.credit_limit) || 0,
    purchaseLimit: Number(w.purchase_limit) || 0,
    status: String(w.status ?? 'unknown'),
  };
}

async function fetchOfflineMethods(signal: AbortSignal): Promise<OfflineMethod[]> {
  const res = await fetch('/api/cart/payment/offline-methods', { signal, cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error('Failed to load offline payment methods');
  // return normalizeOfflineMethods(data);
  return data;
}

// ─── Normalize raw API response into typed OfflineMethod[] ────────────────────

// function normalizeOfflineMethods(payload: unknown): OfflineMethod[] {
//   const root = payload as Record<string, unknown>;
//   const list: unknown[] =
//     Array.isArray(payload) ? payload :
//       Array.isArray(root?.methods) ? root.methods :
//         Array.isArray(root?.data) ? root.data : [];

//    list
//     .map((item) => {
//       const row = item as Record<string, unknown>;
//       const id = Number(row.id);
//       if (!id) return null;

//       const rawFields = row.method_fields;
//       const method_fields: OfflineMethodField[] | undefined = Array.isArray(rawFields)
//         ? rawFields.map((f) => {
//           const field = f as Record<string, unknown>;
//           return {
//             input_name: String(field.input_name ?? ''),
//             placeholder: String(field.placeholder ?? field.input_name ?? ''),
//             is_required: field.is_required === true || field.is_required === '1' || field.is_required === 1,
//           };
//         })
//         : undefined;

//       return {
//         id,
//         method_name: String(row.method_name ?? row.name ?? ''),
//         method_fields,
//       };
//     })
//     .filter((m): m is OfflineMethod => m !== null && !!m.method_name);
// }

// ─── Empty state helper ────────────────────────────────────────────────────────

function emptyState() {
  return {
    walletBalance: null as number | null,
    qidhaWallet: null as QidhaWallet | null,
    offlineMethods: [] as OfflineMethod[],
    error: null as string | null,
    isLoading: false,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePaymentDetails(
  selectedMethod: PaymentMethod | null,
  /** Token is only used to decide whether to fetch — not sent client-side */
  hasToken: boolean,
  orderTotal: number = 0,
  selectedOfflineMethodId?: string | null,
): UsePaymentDetailsReturn {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [qidhaWallet, setQidhaWallet] = useState<QidhaWallet | null>(null);
  const [offlineMethods, setOfflineMethods] = useState<OfflineMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch when method changes ────────────────────────────────────────────────
  useEffect(() => {
    const config = selectedMethod ? METHOD_CONFIG[selectedMethod] : null;
    const needsFetch = config && (config.fetchesWallet || config.fetchesQidha || config.fetchesOffline);

    // Nothing to fetch for cash / myfatoorah / no selection / not logged in
    if (!selectedMethod || !config || !needsFetch || !hasToken) {
      const s = emptyState();
      setWalletBalance(s.walletBalance);
      setQidhaWallet(s.qidhaWallet);
      setOfflineMethods(s.offlineMethods);
      setError(s.error);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        if (config!.fetchesWallet) {
          setQidhaWallet(null);
          setOfflineMethods([]);
          const balance = await fetchWalletBalance(controller.signal);
          setWalletBalance(balance);

        } else if (config!.fetchesQidha) {
          setWalletBalance(null);
          setOfflineMethods([]);
          const wallet = await fetchQidhaWallet(controller.signal);
          setQidhaWallet(wallet);

        } else if (config!.fetchesOffline) {
          setWalletBalance(null);
          setQidhaWallet(null);
          const methods = await fetchOfflineMethods(controller.signal);
          setOfflineMethods(methods);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return; // method switched mid-flight
        const s = emptyState();
        setWalletBalance(s.walletBalance);
        setQidhaWallet(s.qidhaWallet);
        setOfflineMethods(s.offlineMethods);
        setError((err as Error).message || 'Failed to load payment details');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [selectedMethod, hasToken]); // only re-fetch when method or auth changes

  // ── Derived values ────────────────────────────────────────────────────────────

  const hasInsufficientBalance = useMemo(() => {
    if (orderTotal <= 0) return false;
    if (selectedMethod === 'wallet' && walletBalance !== null) return walletBalance < orderTotal;
    if (selectedMethod === 'kaidha' && qidhaWallet) return qidhaWallet.availableBalance < orderTotal;
    return false;
  }, [selectedMethod, walletBalance, qidhaWallet, orderTotal]);

  const isPaymentReady = useMemo(() => {
    if (!selectedMethod) return false;
    if (!hasToken) return false;
    if (hasInsufficientBalance) return false;
    if (isLoading) return false;

    switch (selectedMethod) {
      case 'cash':
      case 'myfatoorah':
        return true;

      case 'wallet':
        return walletBalance !== null;

      case 'kaidha':
        return qidhaWallet !== null;

      case 'offline':
        return (
          offlineMethods.length > 0 &&
          !!selectedOfflineMethodId &&
          offlineMethods.some((m) => String(m.id) === selectedOfflineMethodId)
        );
    }
  }, [
    selectedMethod,
    hasToken,
    hasInsufficientBalance,
    isLoading,
    walletBalance,
    qidhaWallet,
    offlineMethods,
    selectedOfflineMethodId,
  ]);

  return {
    walletBalance,
    qidhaWallet,
    offlineMethods,
    isLoading,
    error,
    hasInsufficientBalance,
    isPaymentReady,
  };
}
