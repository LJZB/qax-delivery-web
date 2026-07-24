const { expect } = require('@playwright/test');

class OrdersPage {
  constructor(page) {
    // Bloque de localizadores: encabezado, filtros y tabla de órdenes recibidas por QAXadmin.
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Órdenes' });
    this.searchInput = page.locator('#searchOrder');
    this.statusFilter = page.locator('#filterStatus');
    this.tableBody = page.locator('#ordersTableBody');
  }

  async goto() {
    // Bloque de navegación: abre la tabla de órdenes con sesión administrativa activa.
    await this.page.goto('/orders.html');
    await this.syncApiData();
  }

  async syncApiData() {
    // Bloque de sincronización: refresca API -> localStorage -> tabla para mostrar órdenes nuevas.
    await this.page.evaluate(async () => {
      await window.syncFromApi();
      window.orders = window.getAdminData('qaxadmin_orders');
      window.renderOrders();
    });
  }

  async expectLoaded() {
    // Bloque de carga: confirma que la vista permite buscar, filtrar y revisar órdenes.
    await expect(this.heading).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.statusFilter).toBeVisible();
    await expect(this.tableBody).toBeVisible();
  }

  async searchByClient(clientName) {
    // Bloque de búsqueda: filtra por cliente único creado desde API.
    await this.searchInput.fill(clientName);
  }

  async expectOrderVisible(order) {
    // Bloque de validación UI: confirma cliente, producto y estado actual de la orden.
    const row = this.tableBody.getByRole('row').filter({ hasText: order.id });
    await expect(row).toContainText(order.cliente);
    await expect(row).toContainText(order.producto);
    await expect(row).toContainText(order.estado);
  }

  async changeStatus(orderId, status) {
    // Bloque de acción UI: cambia el estado usando el select de la fila de la orden.
    const row = this.tableBody.getByRole('row').filter({ hasText: orderId });
    await row.locator('select').selectOption(status);
  }

  async expectStatus(orderId, status) {
    // Bloque de validación UI: comprueba que la tabla refleja el nuevo estado seleccionado.
    const row = this.tableBody.getByRole('row').filter({ hasText: orderId });
    await expect(row).toContainText(status);
  }
}

module.exports = { OrdersPage };
