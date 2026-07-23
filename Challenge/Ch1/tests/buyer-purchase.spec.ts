import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { BuyerCatalogPage } from '../pages/buyer/BuyerCatalogPage.js';
import { ProductDetailPage } from '../pages/buyer/ProductDetailPage.js';
import { CartPage } from '../pages/buyer/CartPage.js';
import { CheckoutPage } from '../pages/buyer/CheckoutPage.js';
import { OrdersPage } from '../pages/buyer/OrdersPage.js';

test.describe('HU-01 Compra de producto', () => {
  test('comprador busca un producto, lo agrega al carrito y completa la compra', async ({ page }) => {
    // Bloque de Page Objects: centraliza acciones y validaciones de cada pantalla del flujo comprador.
    const homePage = new HomePage(page);
    const catalogPage = new BuyerCatalogPage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const ordersPage = new OrdersPage(page);

    // Bloque de datos de prueba: define el producto buscado y la informacion de envio del comprador.
    const productName = 'Silla Gamer Corsair T3';
    const shippingData = {
      fullName: 'Luis Zuluaga',
      address: 'Calle Falsa 123',
      phone: '111111111',
      city: 'Cali',
    };

    await test.step('Seleccionar el rol comprador', async () => {
      // Criterio: al seleccionar comprador, la aplicacion debe navegar al catalogo de productos.
      await homePage.goto();
      await homePage.expectLoaded();
      await homePage.selectBuyerRole();
      await catalogPage.expectLoaded();
    });

    await test.step('Buscar y abrir el producto desde el catalogo', async () => {
      // Criterio: el catalogo muestra productos y permite abrir el detalle de un producto filtrado.
      await catalogPage.expectProductVisible('iPhone 14 Pro 128GB');
      await catalogPage.search('silla');
      await catalogPage.expectProductVisible(productName);
      await catalogPage.openProduct(productName);
      await productDetailPage.expectLoaded(productName);
    });

    await test.step('Agregar el producto al carrito', async () => {
      // Criterio: al agregar el producto, el badge del carrito se actualiza a una unidad.
      await productDetailPage.addToCart();
      await catalogPage.expectCartCount(1);
    });

    await test.step('Validar carrito y continuar al checkout', async () => {
      // Criterio: el carrito presenta producto, precio, cantidad y subtotal antes de pagar.
      await catalogPage.openCart();
      await cartPage.expectLoaded();
      await cartPage.updateQuantity(1);
      await cartPage.goToCheckout();
    });

    await test.step('Completar envio y metodo de pago', async () => {
      // Criterio: el checkout solicita datos de envio y metodo de pago en dos pasos.
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
      // Criterio: al confirmar el pedido, se muestra la orden creada con estado confirmado.
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
