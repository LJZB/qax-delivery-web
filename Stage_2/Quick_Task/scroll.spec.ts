import { test, expect } from "@playwright/test";

test("debe cargar más contenido al hacer scroll infinito", async ({ page }) => {
  await page.goto("https://bonigarcia.dev/selenium-webdriver-java/infinite-scroll.html");

  const paragraphs = page.locator("#content p.lead");

  await expect(paragraphs.first()).toBeVisible();

  const initialCount = await paragraphs.count();

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await expect.poll(async () => await paragraphs.count()).toBeGreaterThan(initialCount);
});
