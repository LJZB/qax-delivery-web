import {
  expect,
  type FrameLocator,
  type Locator,
  type Page,
} from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface BuyerData {
  name: string;
  email: string;
  phone: string;
}

export interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  holderName: string;
}

export class CheckoutPage extends BasePage {
  // Bloque de localizadores del checkout:
  // Centraliza los datos del comprador y el resumen de la orden que se
  // encuentran en el documento principal.
  readonly checkoutHeading: Locator;
  readonly buyerForm: Locator;
  readonly buyerName: Locator;
  readonly buyerEmail: Locator;
  readonly buyerPhone: Locator;
  readonly orderTotal: Locator;
  readonly paymentIframe: Locator;

  // Bloque de localizadores del iframe:
  // Usa frameLocator para interactuar con la pasarela de pago sin mezclar sus
  // elementos con los localizadores del documento principal.
  readonly paymentFrame: FrameLocator;
  readonly paymentAmount: Locator;
  readonly cardNumber: Locator;
  readonly expiry: Locator;
  readonly cvv: Locator;
  readonly cardName: Locator;
  readonly payButton: Locator;
  readonly paymentStatus: Locator;
  readonly cardError: Locator;
  readonly expiryError: Locator;
  readonly cvvError: Locator;

  constructor(page: Page) {
    super(page);

    this.checkoutHeading = page.getByRole('heading', {
      name: 'Checkout - Finalizar Compra',
      exact: true,
    });
    this.buyerForm = page.locator('#buyerForm');
    this.buyerName = page.getByLabel('Nombre Completo *');
    this.buyerEmail = page.getByLabel('Correo Electronico *');
    this.buyerPhone = page.getByLabel('Telefono *');
    this.orderTotal = page.locator('.summary-total');
    this.paymentIframe = page.locator('#paymentIframe');

    this.paymentFrame = page.frameLocator('#paymentIframe');
    this.paymentAmount = this.paymentFrame.locator('#payAmount');
    this.cardNumber = this.paymentFrame.getByLabel('Numero de Tarjeta');
    this.expiry = this.paymentFrame.getByLabel('Vencimiento');
    this.cvv = this.paymentFrame.getByLabel('CVV');
    this.cardName = this.paymentFrame.getByLabel('Nombre del Titular');
    this.payButton = this.paymentFrame.getByRole('button', { name: /Pagar/ });
    this.paymentStatus = this.paymentFrame.locator('#statusMsg');
    this.cardError = this.paymentFrame.locator('#errCard');
    this.expiryError = this.paymentFrame.locator('#errExpiry');
    this.cvvError = this.paymentFrame.locator('#errCvv');
  }

  // Bloque de preparacion:
  // Espera la URL, el formulario y la carga del iframe antes de ejecutar las
  // acciones o verificaciones de cada escenario.
  async waitUntilLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout\.html$/);
    await expect(this.checkoutHeading).toBeVisible();
    await expect(this.paymentIframe).toBeVisible();
    await expect(this.paymentFrame.getByRole('heading', {
      name: 'Pasarela de Pago Segura',
    })).toBeVisible();
  }

  // Bloque de acciones del comprador:
  // Completa los datos requeridos sin modificar directamente el estado del SUT.
  async fillBuyerData(buyer: BuyerData): Promise<void> {
    await this.buyerName.fill(buyer.name);
    await this.buyerEmail.fill(buyer.email);
    await this.buyerPhone.fill(buyer.phone);
  }

  async submitBuyerDataAsUser(buyer: BuyerData): Promise<void> {
    await this.fillBuyerData(buyer);
    await this.buyerPhone.press('Enter');
  }

  // Bloque de preparacion tecnica:
  // El SUT no ofrece un control visible para enviar los datos. Este metodo
  // dispara el evento submit exclusivamente para desbloquear las validaciones
  // posteriores del iframe sin llamar directamente a validateForm().
  async activatePaymentForTest(buyer: BuyerData): Promise<void> {
    await this.fillBuyerData(buyer);
    await this.buyerForm.evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });
  }

  // Bloque de acciones del iframe:
  // Completa la tarjeta y procesa el pago dentro de la pasarela embebida.
  async fillCard(card: CardData): Promise<void> {
    await this.cardNumber.fill(card.number);
    await this.expiry.fill(card.expiry);
    await this.cvv.fill(card.cvv);
    await this.cardName.fill(card.holderName);
  }

  async processPayment(): Promise<void> {
    await this.payButton.click();
  }

  // Bloque de verificaciones del checkout:
  // Valida la presencia y obligatoriedad de los datos solicitados al comprador.
  async verifyRequiredBuyerFields(): Promise<void> {
    for (const field of [this.buyerName, this.buyerEmail, this.buyerPhone]) {
      await expect(field).toBeVisible();
      await expect(field).toHaveAttribute('required', '');
    }
  }

  async verifyPaymentActivatedWithTotal(expectedTotal: number): Promise<void> {
    const formattedTotal = `$${expectedTotal.toLocaleString('es-CO')}`;
    await expect(this.orderTotal).toContainText(formattedTotal);
    await expect(this.paymentAmount).toHaveText(formattedTotal);
    await expect(this.payButton).toContainText(`COP ${formattedTotal}`);
  }

  // Bloque de verificaciones del iframe:
  // Comprueba restricciones de longitud y mensajes de validacion para numero
  // de tarjeta, vencimiento y CVV.
  async verifyCardFieldRequirements(): Promise<void> {
    await expect(this.cardNumber).toBeVisible();
    await expect(this.cardNumber).toHaveAttribute('maxlength', '19');
    await expect(this.expiry).toBeVisible();
    await expect(this.expiry).toHaveAttribute('maxlength', '5');
    await expect(this.cvv).toBeVisible();
    await expect(this.cvv).toHaveAttribute('maxlength', '4');

    await this.fillCard({
      number: '411111111111111',
      expiry: '12/3',
      cvv: '12',
      holderName: 'Laura Martinez',
    });
    await this.processPayment();

    await expect(this.cardError).toBeVisible();
    await expect(this.expiryError).toBeVisible();
    await expect(this.cvvError).toBeVisible();
  }

  async verifySuccessfulPaymentMessage(): Promise<void> {
    await expect(this.paymentStatus).toBeVisible({ timeout: 5_000 });
    await expect(this.paymentStatus).toContainText('Pago exitoso', {
      timeout: 5_000,
    });
    await expect(this.paymentStatus).toHaveClass(/\bsuccess\b/);
  }
}
