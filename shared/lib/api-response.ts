// shared/lib/api-response.ts

import { NextResponse } from "next/server";

// ── Envelope types (export these so hooks can use them) ───────────────────────

export interface ApiSuccess<T> {
    success: true;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isBackendFailure(
    value: unknown,
): value is { success: false; message?: unknown; errors?: unknown } {
    return (
        value != null &&
        typeof value === "object" &&
        "success" in value &&
        (value as { success: unknown }).success === false
    );
}

// ── Route helpers ─────────────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, status = 200): NextResponse {
    return NextResponse.json({ success: true, data } satisfies ApiSuccess<T>, { status });
}

export function apiError(
    message: string,
    status = 400,
    errors?: unknown,
): NextResponse {
    return NextResponse.json(
        { success: false, message, ...(errors == null ? {} : { errors }) } satisfies ApiError,
        { status },
    );
}

// ── Client helper: unwrap or throw ────────────────────────────────────────────
// Call this in every hook after fetch() so you never write .data.data again.

export function unwrap<T>(response: ApiResponse<T>): T {
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

// ── Backend error extraction ──────────────────────────────────────────────────
// The Shella backend uses two failure shapes:
//   { success: false, message: "…" }
//   { success: false, errors: { message: "…" } }
// Pass the raw parsed JSON and a fallback; get a human-readable string back.

function readableErrorPart(value: unknown): string | undefined {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed || undefined;
    }
    if (Array.isArray(value)) {
        for (const item of value) {
            const part = readableErrorPart(item);
            if (part) return part;
        }
        return undefined;
    }
    if (value && typeof value === "object") {
        const record = value as Record<string, unknown>;
        return (
            readableErrorPart(record.message) ??
            readableErrorPart(record.error) ??
            readableErrorPart(Object.values(record)[0])
        );
    }
    return undefined;
}

export function extractBackendError(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: any,
    fallback: string
): string {
    return (
        readableErrorPart(json?.message) ??
        readableErrorPart(json?.errors?.message) ??
        readableErrorPart(json?.errors) ??
        readableErrorPart(json?.error) ??
        fallback
    );
}