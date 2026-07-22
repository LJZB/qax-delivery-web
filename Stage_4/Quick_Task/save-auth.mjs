import { chromium } from '@playwright/test';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';

const authFile = fileURLToPath(
  new URL('./.auth/mercadolibre.json', import.meta.url),
);

// Bloque de preparación:
// Abre un navegador visible para que la autenticación y el 2FA se completen manualmente.
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();
const terminal = createInterface({ input, output });

await page.goto('https://www.mercadolibre.com.co/');

// Bloque de autenticación manual:
// El script espera sin solicitar ni almacenar usuario, contraseña o códigos en el código.
await terminal.question(
  'Completa manualmente el login y el 2FA en el navegador. Luego presiona Enter aquí para guardar la sesión. ',
);

// Bloque de persistencia:
// Guarda cookies, localStorage e IndexedDB para reutilizar la sesión solamente de forma local.
await context.storageState({ path: authFile, indexedDB: true });

terminal.close();
await browser.close();

console.log('Sesión guardada localmente en Stage_4/Quick_Task/.auth/mercadolibre.json');
