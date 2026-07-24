const { expect } = require('@playwright/test');

class UsersPage {
  constructor(page) {
    // Bloque de localizadores: encabezado, buscador y tabla principal de usuarios.
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Usuarios' });
    this.searchInput = page.locator('#searchUser');
    this.tableBody = page.locator('#usersTableBody');
  }

  async goto() {
    // Bloque de navegación: entra directo porque el login ya dejó sesión activa en sessionStorage.
    await this.page.goto('/users.html');
    await this.syncApiData();
  }

  async syncApiData() {
    // Bloque de sincronización: refresca API -> localStorage -> tabla para ver datos recién creados.
    await this.page.evaluate(async () => {
      await window.syncFromApi();
      window.users = window.getAdminData('qaxadmin_users');
      window.renderUsers();
    });
  }

  async expectLoaded() {
    // Bloque de carga: confirma que la vista de usuarios está lista para buscar en la tabla.
    await expect(this.heading).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async searchByEmail(email) {
    // Bloque de búsqueda: filtra por email único para ubicar el registro preparado por API.
    await this.searchInput.fill(email);
  }

  async expectUserVisible(user) {
    // Bloque de validación UI: compara nombre, email, rol y estado contra el dato del backend.
    const row = this.tableBody.getByRole('row').filter({ hasText: user.email });
    await expect(row).toContainText(user.nombre);
    await expect(row).toContainText(user.email);
    await expect(row).toContainText(user.rol);
    await expect(row).toContainText(user.estado === 'active' ? 'Activo' : 'Inactivo');
  }
}

module.exports = { UsersPage };
