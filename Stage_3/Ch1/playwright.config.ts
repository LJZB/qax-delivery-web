import { defineConfig, devices } from "@playwright/test";

/*
 * Configuracion central del challenge.
 *
 * - `testDir` separa los casos de prueba del codigo de los Page Objects.
 * - `baseURL` termina en `/` para resolver correctamente rutas como index.html.
 * - screenshots y traces conservan evidencia solo cuando aporta al diagnostico.
 * - se limita la ejecucion a Chromium porque el challenge solicita un flujo
 *   funcional y no una matriz de compatibilidad entre navegadores.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "https://qaxpert.com/lab/sites/stage-3/haguazon/",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
