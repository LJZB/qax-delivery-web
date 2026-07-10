module.exports = {
  // Bloque de configuracion base:
  // Los tests del quick task viven dentro de la carpeta tests para mantener
  // una estructura clara y consistente con Playwright.
  testDir: './tests',
  use: {
    // Bloque de entorno:
    // Se define la URL base oficial del quick task para evitar repetirla
    // innecesariamente en todos los casos.
    baseURL: 'https://qaxpert.com/lab/sites/stage-3/paylater/index.html',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        // Bloque de navegador:
        // El quick task se ejecuta en Chromium como proyecto inicial.
        browserName: 'chromium',
      },
    },
  ],
};
