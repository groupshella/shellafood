// app/api/auth/session/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Session cookie manager.
// POST  → set token and/or guest_id cookies
// DELETE → clear all auth cookies (logout)
//
// The access_token is set as httpOnly so JavaScript on the page can never
// read it, protecting against XSS. guest_id is NOT httpOnly because the
// client needs to read it to pass it in API calls.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

const IS_PROD     = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
  httpOnly: false,
  secure:   IS_PROD,
  sameSite: "lax" as const,
  path:     "/",
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = NextResponse.json({ success: true });

  // ── Access token (httpOnly – JS cannot read this) ─────────────────────────
  if (body.token) {
    response.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, body.token, {
      ...COOKIE_OPTS,
      httpOnly: true,                         // ← token is httpOnly
      maxAge:   60 * 60 * 24 * 30,           // 30 days
    });
  }

  // ── User object (readable by JS for UI rendering) ─────────────────────────
  if (body.user) {
    response.cookies.set(COOKIE_KEYS.USER, JSON.stringify(body.user), {
      ...COOKIE_OPTS,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // ── Guest ID (readable by JS so it can be passed in API call bodies) ──────
  if (body.guest_id) {
    response.cookies.set(COOKIE_KEYS.GUEST_ID, String(body.guest_id), {
      ...COOKIE_OPTS,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.delete(COOKIE_KEYS.ACCESS_TOKEN);
  response.cookies.delete(COOKIE_KEYS.USER);
  response.cookies.delete(COOKIE_KEYS.GUEST_ID);

  return response;
}