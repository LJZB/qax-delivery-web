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
    // Acciones que mueven al comprador entre envío, pago y confirmación.
    this.continueToPaymentButton = page.getByRole('button', { name: 'Continuar al Pago' });
    this.confirmOrderButton = page.getByRole('button', { name: 'Confirmar Pedido' });
  }

  async expectShippingStep() {
    // El primer paso debe pedir datos de envío antes de mostrar los campos de pago.
    await expect(this.page.getByText(/1\. Env.o/)).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /Informaci.n de Env.o/ })).toBeVisible();
    await expect(this.continueToPaymentButton).toBeVisible();
  }

  async fillShipping(data: ShippingData) {
    // Los campos de envío validan el primer paso del checkout.
    await this.page.getByRole('textbox', { name: 'Nombre Completo' }).fill(data.fullName);
    await this.page.getByRole('textbox', { name: /Direcci.n/ }).fill(data.address);
    await this.page.getByRole('textbox', { name: /Tel.fono/ }).fill(data.phone);
    await this.page.getByLabel('Ciudad').selectOption(data.city);
  }

  async continueToPayment() {
    // Continúa al pago únicamente después de completar los datos de envío.
    await this.continueToPaymentButton.click();
  }

  async expectPaymentStep() {
    // El segundo paso debe mostrar métodos de pago y la acción final de confirmación.
    await expect(this.page.getByText('2. Pago')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /M.todo de Pago/ })).toBeVisible();
    await expect(this.page.getByText(/Tarjeta de D.bito/)).toBeVisible();
    await expect(this.page.getByText('PSE')).toBeVisible();
    await expect(this.confirmOrderButton).toBeVisible();
  }

  async fillCardPayment(data: CardPaymentData) {
    // Los datos de tarjeta completan el método de pago usado por este escenario.
    await this.page.getByRole('textbox', { name: /N.mero de Tarjeta/ }).fill(data.cardNumber);
    await this.page.getByRole('textbox', { name: 'Vencimiento' }).fill(data.expiration);
  }

  async confirmOrder() {
    // La app muestra un diálogo al confirmar; se descarta para validar la página de órdenes.
    this.page.once('dialog', (dialog) => dialog.dismiss().catch(() => {}));
    await this.confirmOrderButton.click();
  }
}
