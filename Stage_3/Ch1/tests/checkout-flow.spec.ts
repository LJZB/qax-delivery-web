import { expect, test } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage, ShippingAddress } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";

test.describe("Feature: Completar una compra en Haguazon", () => {
  test.beforeEach(async ({ page }) => {
    /*
     * Cada prueba inicia sin datos previos. La limpieza se hace desde la pagina
     * para respetar las reglas de seguridad del navegador sobre localStorage.
     */
    await page.goto("index.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("Completar el flujo desde el carrito hasta la confirmacion", async ({ page }) => {
    /*
     * Los Page Objects encapsulan la interfaz. El test solo conserva los datos
     * del negocio y coordina el recorrido completo solicitado por la historia.
     */
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const address: ShippingAddress = {
      fullName: "Laura Martinez",
      phone: "3001234567",
      street: "Carrera 10 # 20-30",
      city: "Bogota",
      department: "Cundinamarca",
      postalCode: "110111",
    };

    /*
     * Estos valores se capturan desde la UI para comparar el estado antes y
     * despues de modificar el carrito, sin duplicar precios o nombres fijos.
     */
    let productName = "";
    let initialSubtotal = "";

    /* Preparacion: el producto se agrega usando la interfaz de Haguazon. */
    await test.step("Given que el cliente agrega un producto al carrito", async () => {
      await homePage.addFirstProductToCart();
      await homePage.verifyFloatingCartIsOpen();
      await homePage.goToCart();
      await expect(page).toHaveURL(/cart\.html$/);
    });

    /* Criterios del carrito: contenido, cantidad y recalculo del subtotal. */
    await test.step("Then el carrito muestra nombre, precio y cantidad", async () => {
      await cartPage.verifyFirstProductDetails();
      productName = (await cartPage.firstItemName.innerText()).trim();
      initialSubtotal = await cartPage.getSummarySubtotal();
    });

    await test.step("When modifica la cantidad, el subtotal se recalcula", async () => {
      await cartPage.changeFirstProductQuantity(2);
      await cartPage.verifyQuantityAndSubtotal(2, initialSubtotal);
    });

    /* Transicion: se comprueba tanto la accion como la URL de destino. */
    await test.step('And hace clic en "Proceder al Pago"', async () => {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/checkout\.html$/);
    });

    /*
     * Checkout: cada step documenta una decision del cliente y valida el estado
     * inmediatamente antes de avanzar para localizar fallos con precision.
     */
    await test.step("Then el checkout muestra sus cuatro pasos", async () => {
      await checkoutPage.verifyFourCheckoutSteps();
      await checkoutPage.verifyStepIsActive(1);
    });

    await test.step("When completa la direccion, se habilita el paso de envio", async () => {
      await checkoutPage.completeAddress(address);
      await checkoutPage.verifyStepIsActive(2);
    });

    await test.step("And selecciona un metodo de envio", async () => {
      await checkoutPage.selectShippingMethod("express");
      await checkoutPage.verifyShippingSelected("express");
      await checkoutPage.continueToPayment();
      await checkoutPage.verifyStepIsActive(3);
    });

    await test.step("And selecciona un metodo de pago", async () => {
      await checkoutPage.selectPaymentMethod("pse");
      await checkoutPage.verifyPaymentSelected("pse");
      await checkoutPage.continueToReview();
      await checkoutPage.verifyStepIsActive(4);
    });

    /* Cierre: Revision debe conservar la informacion antes de confirmar. */
    await test.step("Then la revision muestra todos los datos ingresados", async () => {
      await checkoutPage.verifyReviewData(address, productName);
    });

    await test.step("And al confirmar se muestra el ID de la orden", async () => {
      await checkoutPage.confirmOrder();
      await checkoutPage.verifyOrderConfirmation();
    });
  });
});
