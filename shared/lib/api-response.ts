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
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Route helpers ─────────────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, status = 200): NextResponse {
    return NextResponse.json({ success: true, data } satisfies ApiSuccess<T>, { status });
}

export function apiError(message: string, status = 400): NextResponse {
    return NextResponse.json({ success: false, message } satisfies ApiError, { status });
}

// ── Client helper: unwrap or throw ────────────────────────────────────────────
// Call this in every hook after fetch() so you never write .data.data again.

export function unwrap<T>(response: ApiResponse<T>): T {
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}