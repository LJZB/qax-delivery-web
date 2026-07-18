import { defineConfig, devices } from "@playwright/test";

/*
 * Configuracion central del proyecto QAXTrade. La barra final de `baseURL`
 * permite navegar con rutas relativas sin perder el path de la aplicacion.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "https://qaxpert.com/lab/sites/stage-3/trade/",
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

