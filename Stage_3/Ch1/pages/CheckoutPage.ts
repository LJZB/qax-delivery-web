import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/** Contrato de los datos que se completan en el primer paso del checkout. */
export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  department: string;
  postalCode: string;
}

/**
 * Modela el checkout dinamico de Haguazon.
 *
 * Los cuatro pasos se renderizan dentro del mismo documento. Por eso se
 * mantienen localizadores permanentes hacia `#stepContent` y se consultan las
 * opciones dinamicas justo cuando cada paso esta disponible.
 */
export class CheckoutPage extends BasePage {
  /*
   * Localizadores permanentes del progreso y del contenido dinamico.
   * Aunque algunos inputs desaparecen al avanzar, los Locator de Playwright
   * son evaluados bajo demanda y pueden declararse desde el constructor.
   */
  readonly progressSteps: Locator;
  readonly stepContent: Locator;
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly departmentInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueToShippingButton: Locator;
  readonly continueToPaymentButton: Locator;
  readonly continueToReviewButton: Locator;
  readonly confirmOrderButton: Locator;
  readonly orderId: Locator;

  constructor(page: Page) {
    super(page);
    this.progressSteps = page.locator("#progressBar .step");
    this.stepContent = page.locator("#stepContent");
    this.fullNameInput = page.locator("#cNombre");
    this.phoneInput = page.locator("#cTelefono");
    this.streetInput = page.locator("#cCalle");
    this.cityInput = page.locator("#cCiudad");
    this.departmentInput = page.locator("#cDepartamento");
    this.postalCodeInput = page.locator("#cCP");
    this.continueToShippingButton = page.getByRole("button", {
      name: /continuar a envio/i,
    });
    this.continueToPaymentButton = page.getByRole("button", {
      name: /continuar a pago/i,
    });
    this.continueToReviewButton = page.getByRole("button", {
      name: /continuar a revision/i,
    });
    this.confirmOrderButton = page.getByRole("button", {
      name: /confirmar pedido/i,
    });
    this.orderId = page.locator(".success-box strong");
  }

  /**
   * Completa todos los campos de Direccion y continua a Envio.
   * Se incluyen campos opcionales para comprobar posteriormente que el paso de
   * Revision conserva todos los datos introducidos por el cliente.
   */
  async completeAddress(address: ShippingAddress): Promise<void> {
    await this.fullNameInput.fill(address.fullName);
    await this.phoneInput.fill(address.phone);
    await this.streetInput.fill(address.street);
    await this.cityInput.fill(address.city);
    await this.departmentInput.fill(address.department);
    await this.postalCodeInput.fill(address.postalCode);
    await this.continueToShippingButton.click();
  }

  /** Selecciona una opcion de envio mediante su valor interno estable. */
  async selectShippingMethod(method: "estandar" | "express"): Promise<void> {
    await this.shippingOption(method).click();
  }

  /** Avanza desde Envio hasta Pago. */
  async continueToPayment(): Promise<void> {
    await this.continueToPaymentButton.click();
  }

  /** Selecciona tarjeta, PSE o efectivo mediante el radio correspondiente. */
  async selectPaymentMethod(
    method: "tarjeta" | "pse" | "efectivo",
  ): Promise<void> {
    await this.paymentOption(method).click();
  }

  /** Avanza desde Pago hasta el resumen final de Revision. */
  async continueToReview(): Promise<void> {
    await this.continueToReviewButton.click();
  }

  /** Confirma la orden una vez revisados los datos del escenario. */
  async confirmOrder(): Promise<void> {
    await this.confirmOrderButton.click();
  }

  /*
   * Localizadores parametrizados para las opciones elegidas por el test.
   * `:has()` identifica el contenedor visual que incluye el radio con el valor
   * solicitado; asi se puede validar tanto `checked` como la clase `selected`.
   */
  shippingOption(method: "estandar" | "express"): Locator {
    return this.page.locator(`.shipping-option:has(input[value="${method}"])`);
  }

  paymentOption(method: "tarjeta" | "pse" | "efectivo"): Locator {
    return this.page.locator(`.payment-option:has(input[value="${method}"])`);
  }

  /**
   * Valida cantidad y nombre de los cuatro pasos. La expresion regular tolera
   * los espacios generados entre el numero circular y la etiqueta visible.
   */
  async verifyFourCheckoutSteps(): Promise<void> {
    await expect(this.progressSteps).toHaveCount(4);
    await expect(this.progressSteps).toHaveText([
      /1\s+Direccion/,
      /2\s+Envio/,
      /3\s+Pago/,
      /4\s+Revision/,
    ]);
  }

  /** Comprueba que el paso indicado sea el estado activo del progreso. */
  async verifyStepIsActive(step: number): Promise<void> {
    await expect(this.progressSteps.nth(step - 1)).toHaveClass(/active/);
  }

  /**
   * Verifica las dos representaciones de seleccion del envio: la clase visual
   * `selected` en el contenedor y el estado `checked` del radio nativo.
   */
  async verifyShippingSelected(method: "estandar" | "express"): Promise<void> {
    const option = this.shippingOption(method);
    await expect(option).toHaveClass(/selected/);
    await expect(option.locator('input[type="radio"]')).toBeChecked();
  }

  /** Verifica el estado visual y nativo de la opcion de pago seleccionada. */
  async verifyPaymentSelected(
    method: "tarjeta" | "pse" | "efectivo",
  ): Promise<void> {
    const option = this.paymentOption(method);
    await expect(option).toHaveClass(/selected/);
    await expect(option.locator('input[type="radio"]')).toBeChecked();
  }

  /**
   * Comprueba que Revision conserve la direccion completa, las decisiones de
   * envio y pago, el producto agregado y la cantidad modificada a dos.
   */
  async verifyReviewData(
    address: ShippingAddress,
    productName: string,
  ): Promise<void> {
    await expect(this.stepContent).toContainText(address.fullName);
    await expect(this.stepContent).toContainText(address.phone);
    await expect(this.stepContent).toContainText(address.street);
    await expect(this.stepContent).toContainText(address.city);
    await expect(this.stepContent).toContainText(address.department);
    await expect(this.stepContent).toContainText(address.postalCode);
    await expect(this.stepContent).toContainText("Express (2-3 dias)");
    await expect(this.stepContent).toContainText("PSE");
    await expect(this.stepContent).toContainText(productName);
    await expect(this.stepContent).toContainText("x 2");
  }

  /**
   * Valida el mensaje final y el formato realmente generado por Haguazon:
   * prefijo `HGZ-` seguido de un sufijo alfanumerico dinamico.
   */
  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.stepContent.getByText(/pedido confirmado/i)).toBeVisible();
    await expect(this.orderId).toHaveText(/^HGZ-[A-Z0-9]+$/);
  }
}
