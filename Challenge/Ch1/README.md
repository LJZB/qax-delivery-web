# Stage 4 - Challenge 1: Flujo completo sobre QAXmarket

## Alcance

Este challenge automatiza los flujos principales de QAXmarket, un marketplace con rol comprador y rol vendedor.

Sitio bajo prueba:

```bash
https://qaxpert.com/lab/sites/stage-4/marketplace/index.html
```

Historias cubiertas:

- HU-01 Compra de producto como comprador.
- HU-02 Gestión de productos como vendedor.

La solución usa Playwright Test, TypeScript, variables de entorno, Page Object Model, UI Mode y Codegen como apoyo para descubrir los flujos principales.

## Estructura

```text
Challenge/Ch1
├── fixtures/
│   └── product-image.png
├── pages/
│   ├── HomePage.ts
│   ├── buyer/
│   │   ├── BuyerCatalogPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── OrdersPage.ts
│   │   └── ProductDetailPage.ts
│   └── seller/
│       ├── PublishProductPage.ts
│       ├── SellerOrdersPage.ts
│       └── SellerProductsPage.ts
├── tests/
│   ├── buyer-purchase.spec.ts
│   └── seller-management.spec.ts
├── .gitignore
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
└── tsconfig.json
```

## Instalación

Desde esta carpeta:

```bash
cd Challenge/Ch1
```

Partes del comando:

- `cd`: cambia de carpeta.
- `Challenge/Ch1`: ruta del proyecto Playwright del challenge.

Instalar dependencias:

```bash
pnpm install
```

Partes del comando:

- `pnpm`: gestor de paquetes usado en el proyecto.
- `install`: instala las dependencias definidas en `package.json` y respeta `pnpm-lock.yaml`.

Instalar navegadores de Playwright:

```bash
pnpm exec playwright install
```

Partes del comando:

- `pnpm`: ejecuta el comando dentro del contexto del proyecto.
- `exec`: busca el binario instalado localmente.
- `playwright`: CLI de Playwright.
- `install`: descarga los navegadores requeridos por Playwright.

## Variables de entorno

El proyecto lee la variable `ENV` desde `.env` usando `dotenv`.

Ejemplo local:

```bash
ENV=qa
```

Ambientes configurados:

- `qa`: `https://qaxpert.com/lab/sites/stage-4/marketplace/`
- `prod`: `https://qaxpert.com/lab/sites/stage-4/marketplace/`

Nota: `.env` está ignorado por Git para evitar subir configuración local.

## Ejecución

Ejecutar toda la suite en modo headless:

```bash
pnpm test
```

Partes del comando:

- `pnpm`: usa los scripts del proyecto.
- `test`: ejecuta el script `playwright test` definido en `package.json`.

Ejecutar con navegador visible:

```bash
pnpm run test:headed
```

Partes del comando:

- `pnpm run`: ejecuta un script de `package.json`.
- `test:headed`: corre Playwright con `--headed` para ver el navegador.

Ejecutar con UI Mode:

```bash
pnpm run test:ui
```

Partes del comando:

- `pnpm run`: ejecuta un script de `package.json`.
- `test:ui`: abre Playwright UI Mode para inspeccionar, depurar y ejecutar pasos visualmente.

Ejecutar en modo debug:

```bash
pnpm run test:debug
```

Partes del comando:

- `pnpm run`: ejecuta un script de `package.json`.
- `test:debug`: corre Playwright con inspector/debugger.

Abrir reporte HTML:

```bash
pnpm run test:report
```

Partes del comando:

- `pnpm run`: ejecuta un script de `package.json`.
- `test:report`: abre el reporte HTML generado por Playwright.

Validar TypeScript:

```bash
pnpm run typecheck
```

Partes del comando:

- `pnpm run`: ejecuta un script de `package.json`.
- `typecheck`: ejecuta `tsc --noEmit` para validar tipos sin generar archivos.

Ejecutar solo HU-01:

```bash
pnpm exec playwright test tests/buyer-purchase.spec.ts --project=chromium
```

Partes del comando:

- `pnpm exec`: ejecuta el binario local de Playwright.
- `playwright test`: corre pruebas automatizadas.
- `tests/buyer-purchase.spec.ts`: limita la ejecución a HU-01.
- `--project=chromium`: usa el proyecto Chromium definido en la configuración.

Ejecutar solo HU-02:

```bash
pnpm exec playwright test tests/seller-management.spec.ts --project=chromium
```

Partes del comando:

- `pnpm exec`: ejecuta el binario local de Playwright.
- `playwright test`: corre pruebas automatizadas.
- `tests/seller-management.spec.ts`: limita la ejecución a HU-02.
- `--project=chromium`: usa el proyecto Chromium definido en la configuración.

Ejecutar en QA:

```bash
ENV=qa pnpm test
```

Partes del comando:

- `ENV=qa`: selecciona el ambiente QA.
- `pnpm test`: ejecuta la suite headless.

Ejecutar en PROD:

```bash
ENV=prod pnpm test
```

Partes del comando:

- `ENV=prod`: selecciona el ambiente PROD.
- `pnpm test`: ejecuta la suite headless.

## Uso de Codegen

Codegen se usó como punto de partida para descubrir los flujos principales, nombres accesibles, campos y botones del SUT.

Comando usado:

```bash
pnpm run test:record
```

Partes del comando:

- `pnpm run`: ejecuta un script del proyecto.
- `test:record`: abre `playwright codegen` contra QAXmarket.

El código generado no se dejó como prueba final porque contenía pasos exploratorios, selectores frágiles, texto con problemas de encoding y dependencias a archivos temporales. La versión final se refactorizó a POM.

## Uso de UI Mode

UI Mode se usa para ejecutar y depurar visualmente los escenarios:

```bash
pnpm run test:ui
```

Durante el desarrollo se usa para:

- Ejecutar una historia de usuario de forma aislada.
- Revisar cada `test.step`.
- Inspeccionar selectores.
- Ver el navegador y el timeline de acciones.
- Ajustar localizadores cuando el DOM no coincide con el Codegen inicial.

## HU-01 Compra de producto

Archivo:

```text
tests/buyer-purchase.spec.ts
```

Cubre:

- Selección de rol comprador.
- Navegación al catálogo.
- Búsqueda de producto.
- Apertura de detalle con URL `buyer-product.html?id=`.
- Agregado al carrito.
- Validación del badge del carrito.
- Validación del carrito con producto, precio, cantidad y subtotal.
- Checkout en dos pasos: envío y pago.
- Confirmación del pedido.
- Validación de orden creada con estado confirmado y detalle del producto.

## HU-02 Gestión de productos como vendedor

Archivo:

```text
tests/seller-management.spec.ts
```

Cubre:

- Selección de rol vendedor.
- Navegación a la tabla `Mis Productos`.
- Publicación de producto con nombre, descripción, categoría, precio, stock e imagen simulada.
- Validación del producto creado en la tabla del vendedor.
- Creación de una orden comprando el producto publicado.
- Validación de órdenes recibidas con estado.
- Cambio de estado usando `Marcar como Enviado`.
- Validación de estado `Enviado`.

## Problemas encontrados

- `baseURL` necesitaba terminar en `/marketplace/`. Sin el slash final, las rutas relativas podían resolver fuera del sitio esperado y caer en una página 404.
- El texto pegado desde Codegen presentó mojibake en caracteres como tildes y emojis. Por eso se evitaron assertions dependientes de esos textos corruptos.
- Algunas assertions generadas por Codegen eran frágiles, por ejemplo `nth()`, textos largos concatenados y clicks sobre emojis.
- En el estado inicial del SUT, las órdenes del vendedor aparecían como `Entregado`, por lo que no existía botón `Marcar como Enviado`. Para validar ese criterio, HU-02 publica un producto y crea una compra real como preparación del escenario.
- El flujo de publicación requiere una imagen. Se agregó `fixtures/product-image.png` para reemplazar el archivo temporal usado durante Codegen.

## Verificación realizada

Comandos ejecutados durante el desarrollo:

```bash
pnpm exec tsc --noEmit
pnpm exec playwright test --project=chromium
```

Resultado esperado:

```text
2 passed
```
