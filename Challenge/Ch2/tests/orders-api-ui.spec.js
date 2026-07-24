const { test, expect } = require('@playwright/test');
const { AdminApi } = require('../apis/AdminApi');
const { LoginPage } = require('../pages/LoginPage');
const { OrdersPage } = require('../pages/OrdersPage');

test.describe('QAXadmin órdenes API + UI', () => {
  test('crea una orden por API, valida estadísticas y cambia estado desde UI', async ({ page, request }, testInfo) => {
    // Bloque de objetos de apoyo: combina endpoints REST con validaciones visuales de la tabla.
    const adminApi = new AdminApi(request);
    const loginPage = new LoginPage(page);
    const ordersPage = new OrdersPage(page);

    // Bloque de datos únicos: mantiene independencia entre projects y workers paralelos.
    const uniqueId = `${testInfo.project.name}-${Date.now()}-${testInfo.workerIndex}`.replace(/[^a-zA-Z0-9-]/g, '-');
    const order = {
      cliente: `Cliente Paralelo ${uniqueId}`,
      producto: `Producto API ${uniqueId}`,
      total: 150000,
    };

    await test.step('Preparar orden y validar estadísticas desde API REST', async () => {
      // Criterio: la prueba usa request.post para crear datos y request.get para validar backend.
      await adminApi.expectHealthy();
      const statsBefore = await adminApi.getOrderStats();
      const createdOrder = await adminApi.createOrder(order);
      const backendOrder = await adminApi.getOrder(createdOrder.id);
      const statsAfter = await adminApi.getOrderStats();

      // Validación backend: la orden queda pendiente y las estadísticas aumentan en una unidad.
      expect(backendOrder).toMatchObject({ ...order, estado: 'Pendiente' });
      expect(statsAfter.totalOrdenes).toBe(statsBefore.totalOrdenes + 1);
      Object.assign(order, { id: createdOrder.id, estado: createdOrder.estado });
    });

    await test.step('Validar orden creada desde la UI', async () => {
      // Criterio: la UI debe mostrar pedidos con su estado actual.
      await loginPage.goto();
      await loginPage.loginAsAdmin();
      await ordersPage.goto();
      await ordersPage.expectLoaded();
      await ordersPage.searchByClient(order.cliente);
      await ordersPage.expectOrderVisible(order);
    });

    await test.step('Cambiar estado en UI y validarlo en API', async () => {
      // Criterio: las pruebas validan consistencia entre UI y backend después de modificar el estado.
      await ordersPage.changeStatus(order.id, 'Enviado');
      await ordersPage.expectStatus(order.id, 'Enviado');

      // Validación backend: espera la sincronización generada por la UI antes de afirmar el estado.
      await expect.poll(async () => {
        const updatedOrder = await adminApi.getOrder(order.id);
        return updatedOrder.estado;
      }, {
        message: 'Esperar sincronización del estado actualizado en API',
      }).toBe('Enviado');
    });
  });
});
