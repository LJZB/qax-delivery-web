import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly buyerRole: Locator;
  readonly sellerRole: Locator;

  constructor(private readonly page: Page) {
    // Role cards available on the marketplace landing page.
    this.buyerRole = page.getByRole('heading', { name: 'Soy Comprador' });
    this.sellerRole = page.getByRole('heading', { name: 'Soy Vendedor' });
  }

  async goto() {
    // Navigate through baseURL so QA/PROD environments are controlled from playwright.config.ts.
    await this.page.goto('index.html');
  }

  async expectLoaded() {
    // The landing page is ready when both user roles are visible.
    await expect(this.buyerRole).toBeVisible();
    await expect(this.sellerRole).toBeVisible();
  }

  async selectBuyerRole() {
    // Buyer role starts the catalog and purchase journey.
    await this.buyerRole.click();
  }
}
