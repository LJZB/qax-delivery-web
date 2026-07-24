const { test, expect } = require('@playwright/test');
const { AdminApi } = require('../apis/AdminApi');
const { LoginPage } = require('../pages/LoginPage');
const { UsersPage } = require('../pages/UsersPage');

test.describe('QAXadmin usuarios API + UI', () => {
  test('crea un usuario por API y lo valida en backend y UI', async ({ page, request }, testInfo) => {
    // Bloque de objetos de apoyo: API prepara datos y Page Objects validan la UI administrativa.
    const adminApi = new AdminApi(request);
    const loginPage = new LoginPage(page);
    const usersPage = new UsersPage(page);

    // Bloque de datos únicos: evita choques cuando el mismo test corre en paralelo y por project.
    const uniqueId = `${testInfo.project.name}-${Date.now()}-${testInfo.workerIndex}`.replace(/[^a-zA-Z0-9-]/g, '-');
    const user = {
      nombre: `QA Paralelo ${uniqueId}`,
      email: `qa-paralelo-${uniqueId}@example.com`.toLowerCase(),
      rol: 'Comprador',
      estado: 'active',
    };

    await test.step('Preparar usuario desde API REST', async () => {
      // Criterio: la prueba integra request.get y request.post para preparar y validar datos.
      await adminApi.expectHealthy();
      const createdUser = await adminApi.createUser(user);
      const backendUser = await adminApi.getUser(createdUser.id);

      // Validación backend: el usuario consultado debe conservar los datos enviados en el POST.
      expect(backendUser).toMatchObject(user);
      Object.assign(user, { id: createdUser.id });
    });

    await test.step('Validar usuario creado desde la UI', async () => {
      // Criterio: la UI debe reflejar el dato preparado desde el backend.
      await loginPage.goto();
      await loginPage.loginAsAdmin();
      await usersPage.goto();
      await usersPage.expectLoaded();
      await usersPage.searchByEmail(user.email);
      await usersPage.expectUserVisible(user);
    });
  });
});
