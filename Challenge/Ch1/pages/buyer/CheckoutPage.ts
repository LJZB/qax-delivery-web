import { expect, type Locator, type Page } from '@playwright/test';

type ShippingData = {
  fullName: string;
  address: string;
  phone: string;
  city: string;
};

type CardPaymentData = {
  cardNumber: string;
  expiration: string;
};

export class CheckoutPage {
  readonly continueToPaymentButton: Locator;
  readonly confirmOrderButton: Locator;

  constructor(private readonly page: Page) {
    // Checkout actions that move the buyer through shipping and payment.
    this.continueToPaymentButton = page.getByRole('button', { name: 'Continuar al Pago' });
    this.confirmOrderButton = page.getByRole('button', { name: 'Confirmar Pedido' });
  }

  async expectShippingStep() {
    // Step one must request shipping data before payment fields are available.
    await expect(this.page.getByText(/1\. Env.o/)).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /Informaci.n de Env.o/ })).toBeVisible();
    await expect(this.continueToPaymentButton).toBeVisible();
  }

  async fillShipping(data: ShippingData) {
    // Shipping fields validate the first checkout step acceptance criteria.
    await this.page.getByRole('textbox', { name: 'Nombre Completo' }).fill(data.fullName);
    await this.page.getByRole('textbox', { name: /Direcci.n/ }).fill(data.address);
    await this.page.getByRole('textbox', { name: /Tel.fono/ }).fill(data.phone);
    await this.page.getByLabel('Ciudad').selectOption(data.city);
  }

  async continueToPayment() {
    // Continue only after shipping data has been completed.
    await this.continueToPaymentButton.click();
  }

  async expectPaymentStep() {
    // Step two must expose payment options and the final confirmation action.
    await expect(this.page.getByText('2. Pago')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /M.todo de Pago/ })).toBeVisible();
    await expect(this.page.getByText(/Tarjeta de D.bito/)).toBeVisible();
    await expect(this.page.getByText('PSE')).toBeVisible();
    await expect(this.confirmOrderButton).toBeVisible();
  }

  async fillCardPayment(data: CardPaymentData) {
    // Card data completes the payment form used by this buyer scenario.
    await this.page.getByRole('textbox', { name: /N.mero de Tarjeta/ }).fill(data.cardNumber);
    await this.page.getByRole('textbox', { name: 'Vencimiento' }).fill(data.expiration);
  }

  async confirmOrder() {
    // The app shows a dialog on confirmation; dismiss it so the test can validate the orders page.
    this.page.once('dialog', (dialog) => dialog.dismiss().catch(() => {}));
    await this.confirmOrderButton.click();
  }
}
