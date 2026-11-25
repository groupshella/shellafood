import { describe, expect, it } from "vitest";
import { sanitizeStaticHtml } from "../features/profile/components/shared/StaticContentBody";
import { REFERRAL_LINK_FALLBACK } from "../features/profile/constants/referral.constants";
import { toSecureMediaUrl } from "../shared/lib/media-url";

describe("R20.1 Security Regression Tests", () => {
  it("strips script tags, event handlers, iframes, and javascript: URIs from static HTML", () => {
    const dirty =
      '<p>Hello <strong>Shella</strong></p><script>alert(1)</script><img src=x onerror=alert(2)><iframe src="https://evil.com"></iframe><a href="javascript:alert(3)">click</a>';
    const clean = sanitizeStaticHtml(dirty);

    expect(clean).toContain("<p>Hello <strong>Shella</strong></p>");
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onerror");
    expect(clean).not.toContain("<iframe");
    expect(clean).not.toContain("javascript:");
  });

  it("preserves safe HTTPS links and adds rel=noopener noreferrer", () => {
    const safe = '<p><a href="https://shellafood.com">Shella</a></p>';
    const clean = sanitizeStaticHtml(safe);

    expect(clean).toContain('href="https://shellafood.com"');
    expect(clean).toContain('rel="noopener noreferrer"');
  });

  it("enforces HTTPS on referral fallback URL", () => {
    expect(REFERRAL_LINK_FALLBACK.startsWith("https://")).toBe(true);
  });

  it("upgrades external HTTP media URLs to HTTPS and keeps local paths intact", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.shellafood.com";
    expect(toSecureMediaUrl("/home/banner.png")).toBe("/home/banner.png");
    expect(toSecureMediaUrl("http://cdn.example.com/img.png")).toBe(
      "https://cdn.example.com/img.png",
    );
    expect(toSecureMediaUrl("https://api.shellafood.com/storage/app/1.png")).toBe(
      "/backend-media/storage/app/1.png",
    );
  });
});
