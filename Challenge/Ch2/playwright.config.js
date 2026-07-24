const { defineConfig, devices } = require("@playwright/test");

// Bloque de ambiente: centraliza el puerto y la URL base del SUT local QAXadmin.
const PORT = process.env.PORT || 4001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

module.exports = defineConfig({
  // Bloque de suite: habilita ejecución paralela con al menos 3 workers, como pide el reto.
  testDir: "./tests",
  timeout: 30 * 1000,
  fullyParallel: true,
  workers: 8,
  reporter: [["list"], ["html", { open: "never" }]],

  // Bloque común: aplica URL base, trazas, capturas y video a todos los projects.
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // Bloque webServer: levanta el SUT antes de ejecutar pruebas y espera el endpoint de health.
  webServer: {
    command: "npm start --prefix server",
    url: `${BASE_URL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },

  // Bloque de projects: ejecuta la misma suite en Desktop, Mobile y Tablet.
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
      retries: 0,
    },
    {
      name: "desktop-firefox",
      use: { ...devices["Desktop Firefox"] },
      retries: 1,
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      retries: 1,
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
      retries: 1,
    },
    {
      name: "tablet-chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 820, height: 1180 },
        isMobile: true,
        hasTouch: true,
      },
      retries: 1,
    },
  ],
});
