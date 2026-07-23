import { test } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { HomePage } from '../pages/HomePage.js';
import { BuyerCatalogPage } from '../pages/buyer/BuyerCatalogPage.js';
import { ProductDetailPage } from '../pages/buyer/ProductDetailPage.js';
import { CartPage } from '../pages/buyer/CartPage.js';
import { CheckoutPage } from '../pages/buyer/CheckoutPage.js';
import { SellerProductsPage } from '../pages/seller/SellerProductsPage.js';
import { PublishProductPage } from '../pages/seller/PublishProductPage.js';
import { SellerOrdersPage } from '../pages/seller/SellerOrdersPage.js';

test.describe('HU-02 Gestion de productos como vendedor', () => {
  test('vendedor publica un producto y marca una orden como enviada', async ({ page }) => {
    // Bloque de Page Objects: reutiliza pantallas de vendedor y comprador para cubrir la historia completa.
    const homePage = new HomePage(page);
    const catalogPage = new BuyerCatalogPage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const sellerProductsPage = new SellerProductsPage(page);
    const publishProductPage = new PublishProductPage(page);
    const sellerOrdersPage = new SellerOrdersPage(page);

    // Bloque de producto: datos capturados desde Codegen y usados para publicar en la tienda del vendedor.
    const product = {
      name: 'Nintendo Switch OLED',
      description: 'Nintendo Switch OLED con motivo de Tears of the Kingdom',
      category: 'Juguetes y Juegos',
      price: '1800000',
      stock: '5',
      imagePath: fileURLToPath(new URL('../fixtures/product-image.png', import.meta.url)),
    };

    // Bloque de comprador: genera una orden nueva porque las ordenes semilla del SUT ya estan entregadas.
    const buyerShippingData = {
      fullName: 'Luis QA',
      address: 'Calle Falsa 123',
      phone: '4441414141',
      city: 'Cali',
    };

    await test.step('Seleccionar el rol vendedor', async () => {
      // Criterio: al seleccionar vendedor, la aplicacion navega a la tabla de mis productos.
      await homePage.goto();
      await homePage.expectLoaded();
      await homePage.selectSellerRole();
      await sellerProductsPage.expectLoaded();
    });

    await test.step('Publicar un nuevo producto', async () => {
      // Criterio: el formulario permite ingresar nombre, descripcion, categoria y precio.
      await sellerProductsPage.openPublishProductForm();
      await publishProductPage.expectLoaded();
      await publishProductPage.publishProduct(product);
    });

    await test.step('Validar que el producto aparece en la tabla del vendedor', async () => {
      // Criterio: al guardar, el producto aparece en la tabla de productos del vendedor.
      await sellerProductsPage.expectLoaded();
      await sellerProductsPage.expectProductInTable(product.name);
    });

    await test.step('Crear una orden pendiente para el producto publicado', async () => {
      // Preparacion: compra el producto publicado para que exista una orden accionable del vendedor.
      await sellerProductsPage.switchToBuyerCatalog();
      await homePage.expectLoaded();
      await homePage.selectBuyerRole();
      await catalogPage.expectLoaded();
      await catalogPage.search(product.name);
      await catalogPage.expectProductVisible(product.name);
      await catalogPage.openProduct(product.name);
      await productDetailPage.expectLoaded(product.name);
      await productDetailPage.addToCart();
      await catalogPage.expectCartCount(1);
      await catalogPage.openCart();
      await cartPage.expectLoaded();
      await cartPage.goToCheckout();
      await checkoutPage.expectShippingStep();
      await checkoutPage.fillShipping(buyerShippingData);
      await checkoutPage.continueToPayment();
      await checkoutPage.expectPaymentStep();
      await checkoutPage.fillCardPayment({
        cardNumber: '1111111111111111',
        expiration: '12/30',
      });
      await checkoutPage.confirmOrder();
    });

    await test.step('Validar ordenes recibidas con estado', async () => {
      // Criterio: en ordenes recibidas se muestran pedidos con su estado actual.
      await sellerOrdersPage.goto();
      await sellerOrdersPage.expectLoaded();
      await sellerOrdersPage.expectOrdersWithStatus();
      await sellerOrdersPage.expectOrderForProduct(product.name);
    });

    await test.step('Marcar una orden como enviada', async () => {
      // Criterio: al hacer clic en Marcar como Enviado, el estado del pedido cambia.
      await sellerOrdersPage.markFirstPendingOrderAsSent();
      await sellerOrdersPage.expectSentStatusVisible();
    });
  });
});
