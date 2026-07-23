import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { BuyerCatalogPage } from '../pages/buyer/BuyerCatalogPage.js';
import { ProductDetailPage } from '../pages/buyer/ProductDetailPage.js';
import { CartPage } from '../pages/buyer/CartPage.js';
import { CheckoutPage } from '../pages/buyer/CheckoutPage.js';
import { OrdersPage } from '../pages/buyer/OrdersPage.js';

test.describe('HU-01 Compra de producto', () => {
  test('comprador busca un producto, lo agrega al carrito y completa la compra', async ({ page }) => {
    // Page Objects keep locators and page-specific actions outside the test body.
    const homePage = new HomePage(page);
    const catalogPage = new BuyerCatalogPage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const ordersPage = new OrdersPage(page);

    // Test data mirrors the buyer purchase scenario from the user story.
    const productName = 'Silla Gamer Corsair T3';
    const shippingData = {
      fullName: 'Luis Zuluaga',
      address: 'Calle Falsa 123',
      phone: '111111111',
      city: 'Cali',
    };

    await test.step('Seleccionar el rol comprador', async () => {
      // Acceptance criterion: selecting buyer navigates to the product catalog.
      await homePage.goto();
      await homePage.expectLoaded();
      await homePage.selectBuyerRole();
      await catalogPage.expectLoaded();
    });

    await test.step('Buscar y abrir el producto desde el catalogo', async () => {
      // Acceptance criterion: catalog shows products and allows opening product detail.
      await catalogPage.expectProductVisible('iPhone 14 Pro 128GB');
      await catalogPage.search('silla');
      await catalogPage.expectProductVisible(productName);
      await catalogPage.openProduct(productName);
      await productDetailPage.expectLoaded(productName);
    });

    await test.step('Agregar el producto al carrito', async () => {
      // Acceptance criterion: adding a product updates the cart badge.
      await productDetailPage.addToCart();
      await catalogPage.expectCartCount(1);
    });

    await test.step('Validar carrito y continuar al checkout', async () => {
      // Acceptance criterion: the cart summarizes product, price, quantity and subtotal.
      await catalogPage.openCart();
      await cartPage.expectLoaded();
      await cartPage.updateQuantity(1);
      await cartPage.goToCheckout();
    });

    await test.step('Completar envio y metodo de pago', async () => {
      // Acceptance criterion: checkout requests shipping and payment in two steps.
      await checkoutPage.expectShippingStep();
      await checkoutPage.fillShipping(shippingData);
      await checkoutPage.continueToPayment();
      await checkoutPage.expectPaymentStep();
      await checkoutPage.fillCardPayment({
        cardNumber: '1111111111111111',
        expiration: '09/30',
      });
    });

    await test.step('Confirmar pedido y validar la orden creada', async () => {
      // Acceptance criterion: confirming the order shows the created purchase as confirmed.
      await checkoutPage.confirmOrder();
      await ordersPage.expectLoaded();
      await ordersPage.expectLatestOrderForCustomer(
        shippingData.fullName,
        shippingData.address,
        productName,
      );
    });
  });
});
