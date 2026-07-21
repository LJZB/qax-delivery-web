import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const authFile = fileURLToPath(
  new URL('./.auth/mercadolibre.json', import.meta.url),
);

export default defineConfig({
  // Bloque de descubrimiento:
  // Limita esta configuración a los archivos de prueba del Quick Task.
  testDir: '.',
  testMatch: 'mercado-libre.spec.ts',

  // Bloque de ejecución:
  // Usa un solo worker porque el flujo depende de una sesión personal y un carrito compartido.
  workers: 1,
  retries: 0,

  use: {
    // Bloque de sesión:
    // Reutiliza el estado autenticado local sin guardar credenciales dentro del test.
    storageState: authFile,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
