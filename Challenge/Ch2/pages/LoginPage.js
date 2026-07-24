const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    // Bloque de localizadores: campos y acción principal del login administrativo.
    this.page = page;
    this.emailInput = page.locator('#loginEmail');
    this.passwordInput = page.locator('#loginPass');
    this.submitButton = page.getByRole('button', { name: 'Iniciar Sesión' });
  }

  async goto() {
    // Bloque de navegación: abre la pantalla inicial servida por el SUT local.
    await this.page.goto('/index.html');
  }

  async loginAsAdmin() {
    // Bloque de autenticación: usa credenciales demo y valida redirección al dashboard.
    await this.emailInput.fill('admin@qaxpert.com');
    await this.passwordInput.fill('admin123');
    await this.submitButton.click();
    await expect(this.page).toHaveURL(/dashboard\.html/);
  }
}

module.exports = { LoginPage };
