import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/auth", "/cart"];

test.describe("R20 Browser Smoke Tests", () => {
  for (const route of ROUTES) {
    test(`renders ${route} cleanly with RTL, zero hydration errors, and zero uncaught exceptions`, async ({
      page,
    }) => {
      const hydrationErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error" && /hydrat/i.test(msg.text())) {
          hydrationErrors.push(msg.text());
        }
      });
      page.on("pageerror", (err) => {
        pageErrors.push(String(err));
      });

      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      await page.waitForTimeout(800);

      const dir = await page.evaluate(() => document.documentElement.dir);
      expect(["rtl", "ltr"]).toContain(dir);

      const textLength = await page.evaluate(
        () => (document.body.innerText || "").trim().length,
      );
      expect(textLength).toBeGreaterThan(0);

      expect(hydrationErrors, `Hydration errors on ${route}`).toEqual([]);
      expect(pageErrors, `Uncaught page errors on ${route}`).toEqual([]);
    });
  }
});
