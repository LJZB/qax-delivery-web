# Stage 4 - Challenge 2: Escalando con ejecución en paralelo

## Alcance

Este challenge automatiza QAXadmin, un SUT local con UI administrativa y Mock API REST. La solución integra pruebas API + UI, ejecución paralela, projects multi-dispositivo y scripts por configuración.

Sistema bajo prueba:

```bash
http://localhost:4001
```

Swagger del SUT:

```bash
http://localhost:4001/api-docs
```

Credenciales de la UI:

```text
admin@qaxpert.com / admin123
```

## Historias y criterios cubiertos

Se cubren los criterios principales del reto:

- Ejecución paralela configurada con mínimo `workers: 3` y validada localmente con `--workers=8`.
- Uso de `request.get`, `request.post` y `request.put` para preparar y validar datos.
- Projects de Playwright para Desktop, Mobile y Tablet.
- Pruebas independientes con datos únicos por project y worker.
- Servidor local levantado automáticamente antes de ejecutar las pruebas mediante `webServer`.

## Estructura

```text
Challenge/Ch2
├── apis/
│   └── AdminApi.js
├── pages/
│   ├── LoginPage.js
│   ├── OrdersPage.js
│   └── UsersPage.js
├── server/
│   ├── package.json
│   ├── README.md
│   ├── server.js
│   └── ui/
├── tests/
│   ├── orders-api-ui.spec.js
│   └── users-api-ui.spec.js
├── .gitignore
├── package.json
├── playwright.config.js
├── pnpm-lock.yaml
└── README.md
```

## Instalación

Desde la carpeta del challenge:

```bash
cd Challenge/Ch2
```

Partes del comando:

- `cd`: cambia de carpeta.
- `Challenge/Ch2`: ruta del proyecto del Challenge 2.

Instalar dependencias de Playwright:

```bash
pnpm install
```

Partes del comando:

- `pnpm`: gestor de paquetes usado para el proyecto de automatización.
- `install`: instala las dependencias definidas en `package.json` y respeta `pnpm-lock.yaml`.

Instalar dependencias del SUT local:

```bash
pnpm run server:install
```

Partes del comando:

- `pnpm run`: ejecuta un script definido en `package.json`.
- `server:install`: ejecuta `npm install --prefix server` para instalar dependencias dentro de `server`.

Instalar navegadores de Playwright si no existen:

```bash
pnpm exec playwright install
```

Partes del comando:

- `pnpm exec`: ejecuta un binario local del proyecto.
- `playwright`: CLI de Playwright.
- `install`: instala los navegadores requeridos.

## Servidor local

El servidor se puede levantar manualmente con:

```bash
pnpm run server:start
```

Partes del comando:

- `pnpm run`: ejecuta un script de `package.json`.
- `server:start`: ejecuta `npm start --prefix server`.

Durante las pruebas no es obligatorio levantarlo manualmente, porque `playwright.config.js` usa `webServer` para iniciarlo antes de correr la suite.

## Ejecución automática del servidor

El servidor local de QAXadmin se levanta automáticamente desde `playwright.config.js` mediante la opción `webServer`:

```js
webServer: {
  command: 'npm start --prefix server',
  url: `${BASE_URL}/api/health`,
  reuseExistingServer: !process.env.CI,
  timeout: 30 * 1000,
}
```

Cuando se ejecuta `pnpm test`, Playwright inicia el SUT, espera a que responda el endpoint `/api/health` y después corre las pruebas. Por eso la suite puede ejecutarse desde cero sin abrir una terminal separada para el servidor.

## Ejecución

Ejecutar toda la suite en paralelo:

```bash
pnpm test
```

Partes del comando:

- `pnpm`: usa los scripts del proyecto.
- `test`: ejecuta `playwright test`.

Ejecutar toda la suite forzando 8 workers:

```bash
pnpm exec playwright test --workers=8
```

Partes del comando:

- `pnpm exec`: ejecuta el binario local de Playwright.
- `playwright test`: corre todos los tests de la suite.
- `--workers=8`: fuerza hasta 8 workers en paralelo para validar escalabilidad por encima del mínimo requerido.

Ejecutar solo projects Desktop:

```bash
pnpm run test:desktop
```

Partes del comando:

- `pnpm run`: ejecuta un script del proyecto.
- `test:desktop`: ejecuta `desktop-chromium` y `desktop-firefox`.

Ejecutar solo projects Mobile:

```bash
pnpm run test:mobile
```

Partes del comando:

- `pnpm run`: ejecuta un script del proyecto.
- `test:mobile`: ejecuta `mobile-chrome` y `mobile-safari`.

Ejecutar solo Tablet:

```bash
pnpm run test:tablet
```

Partes del comando:

- `pnpm run`: ejecuta un script del proyecto.
- `test:tablet`: ejecuta `tablet-chromium`.

Ejecutar con navegador visible para revisión manual:

```bash
pnpm run test:headed
```

Partes del comando:

- `pnpm run`: ejecuta un script de `package.json`.
- `test:headed`: corre Playwright con navegador visible y `--workers=1` para facilitar la revisión.

Ejecutar con UI Mode:

```bash
pnpm run test:ui
```

Partes del comando:

- `pnpm run`: ejecuta un script del proyecto.
- `test:ui`: abre Playwright UI Mode para depuración visual.

Ejecutar en modo debug:

```bash
pnpm run test:debug
```

Partes del comando:

- `pnpm run`: ejecuta un script del proyecto.
- `test:debug`: abre Playwright Inspector para depuración paso a paso.

Abrir reporte HTML:

```bash
pnpm run test:report
```

Partes del comando:

- `pnpm run`: ejecuta un script del proyecto.
- `test:report`: abre el reporte HTML generado por Playwright.

## Projects configurados

Los projects están definidos en `playwright.config.js`:

- `desktop-chromium`: Desktop Chrome.
- `desktop-firefox`: Desktop Firefox.
- `mobile-chrome`: Pixel 5.
- `mobile-safari`: iPhone 13.
- `tablet-chromium`: viewport tipo tablet con touch.

La suite completa ejecuta los mismos tests sobre todos los projects para validar comportamiento multi-dispositivo.

## Pruebas implementadas

### Usuarios API + UI

Archivo:

```text
tests/users-api-ui.spec.js
```

Cubre:

- Health check del SUT con `request.get`.
- Creación de usuario con `request.post`.
- Consulta del usuario creado con `request.get`.
- Login en UI.
- Validación del usuario creado en la tabla de Usuarios.

### Órdenes API + UI

Archivo:

```text
tests/orders-api-ui.spec.js
```

Cubre:

- Health check del SUT con `request.get`.
- Consulta de estadísticas de órdenes con `request.get`.
- Creación de orden con `request.post`.
- Validación tolerante del incremento en `totalOrdenes` para soportar ejecución paralela.
- Login en UI.
- Validación de la orden creada en la tabla de Órdenes.
- Cambio de estado desde la UI.
- Validación del estado actualizado en backend.

## Problemas encontrados

- El SUT del reto es QAXadmin, pero el bloque de casos de prueba del enunciado menciona una apertura de cuenta bancaria. La automatización se enfocó en los criterios de aceptación reales del reto: API + UI, parallel workers y projects multi-dispositivo sobre QAXadmin.
- La UI sincroniza datos desde API hacia `localStorage`; por eso los Page Objects fuerzan sincronización antes de validar tablas con datos recién creados.
- Las pruebas agregan datos al servidor en memoria. Para soportar ejecución paralela, cada test genera identificadores únicos usando project, timestamp y worker.
- Se evitó una race condition en estadísticas globales: con varios workers, otro test puede crear órdenes entre `statsBefore` y `statsAfter`. Por eso se valida que `totalOrdenes` sea mayor o igual al incremento esperado, mientras la orden propia se valida exactamente por `id`. Esta corrección permitió ejecutar la suite completa con `--workers=8` sin fallos.
- En Windows PowerShell, `npm.ps1` puede bloquearse por política de ejecución. Si ocurre, ejecutar desde Git Bash o usar `npm.cmd` directamente para instalar dependencias del server.

## Verificación realizada

Comandos ejecutados durante el desarrollo:

```bash
pnpm exec playwright test --project=desktop-chromium
pnpm exec playwright test
pnpm exec playwright test --workers=8
```

Resultado de la suite completa:

```text
10 passed
```

La ejecución completa fue validada con 8 workers:

```text
Running 10 tests using 8 workers
10 passed
```
