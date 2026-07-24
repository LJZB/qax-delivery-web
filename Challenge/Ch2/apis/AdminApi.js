const { expect } = require('@playwright/test');

class AdminApi {
  constructor(request) {
    // Bloque de cliente REST: reutiliza el fixture request de Playwright con el baseURL configurado.
    this.request = request;
  }

  async expectHealthy() {
    // Bloque health check: confirma que webServer levantó QAXadmin antes de preparar datos.
    const response = await this.request.get('/api/health');
    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    return response.json();
  }

  async createUser(user) {
    // Bloque usuarios: crea datos por API para no depender de registros semilla.
    const response = await this.request.post('/api/users', { data: user });
    expect(response.status()).toBe(201);
    return response.json();
  }

  async getUser(userId) {
    // Bloque usuarios: valida en backend que el usuario creado quedó disponible.
    const response = await this.request.get(`/api/users/${userId}`);
    expect(response.status()).toBe(200);
    return response.json();
  }

  async createOrder(order) {
    // Bloque órdenes: prepara una orden independiente para validarla en UI y API.
    const response = await this.request.post('/api/orders', { data: order });
    expect(response.status()).toBe(201);
    return response.json();
  }

  async updateOrderStatus(orderId, status) {
    // Bloque órdenes: actualiza estado desde API cuando se requiere validar el endpoint directamente.
    const response = await this.request.put(`/api/orders/${orderId}`, { data: { estado: status } });
    expect(response.status()).toBe(200);
    return response.json();
  }

  async getOrder(orderId) {
    // Bloque órdenes: consulta una orden individual para verificar consistencia posterior.
    const response = await this.request.get(`/api/orders/${orderId}`);
    expect(response.status()).toBe(200);
    return response.json();
  }

  async getOrderStats() {
    // Bloque estadísticas: valida agregados del backend antes y después de crear órdenes.
    const response = await this.request.get('/api/orders/stats');
    expect(response.status()).toBe(200);
    return response.json();
  }
}

module.exports = { AdminApi };
