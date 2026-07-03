# Stage 2 - Quick Task: Acciones Avanzadas con Playwright

## ¿Qué es?

Entrega práctica del **Stage_2 / Quick Task** enfocada en automatización Web con Playwright y TypeScript.

El objetivo es practicar acciones avanzadas de interacción en navegador usando locators recomendados por Playwright y validaciones con `expect`.

## Objetivo / Historia de usuario

Como QA Automation en formación,  
quiero automatizar diferentes interacciones avanzadas en páginas de práctica,  
para validar que puedo manejar acciones reales del navegador como clicks especiales, mouse over, drag and drop, teclado, scroll, alertas, pestañas e iframes.

## Criterios de aceptación

- Crear un archivo `.spec.ts` por cada item del Quick Task.
- Usar Playwright con TypeScript.
- Priorizar locators en este orden:
  1. `getByRole()`
  2. `getByLabel()`
  3. `getByText()`
  4. `getByPlaceholder()`
  5. `getByAltText()`
  6. `getByTitle()`
  7. `getByTestId()`
  8. `locator()` con CSS
  9. XPath solo como último recurso
- Cada prueba debe navegar a la página indicada.
- Cada prueba debe ejecutar la acción solicitada.
- Cada prueba debe tener una validación clara.
- Los scripts deben poder ejecutarse desde `package.json`.

## Archivos implementados

| Item                                 | Archivo                   |
| ------------------------------------ | ------------------------- |
| Click forzado                        | `click-forzado.spec.ts`   |
| Mouse over                           | `mouse-over.spec.ts`      |
| Doble clic, click derecho y dropdown | `dropdown-clicks.spec.ts` |
| Drag and drop                        | `drag-and-drop.spec.ts`   |
| Subir / descargar archivo            | `subir-archivo.spec.ts`   |
| Simular teclas                       | `simular-teclas.spec.ts`  |
| Scroll infinito                      | `scroll.spec.ts`          |
| Popup / Alert                        | `popup-alert.spec.ts`     |
| Manejo de pestañas                   | `pestanas.spec.ts`        |
| Iframe                               | `iframe.spec.ts`          |

## Estrategia de prueba

Se creó una prueba independiente por cada interacción para mantener los casos aislados y fáciles de ejecutar.

Las pruebas cubren:

- Interacción con botones visibles.
- Manejo de diálogos nativos del navegador.
- Validación de cambios visibles en pantalla.
- Captura de nuevas pestañas con `waitForEvent('page')`.
- Escritura dentro de iframes usando `frameLocator()`.
- Scroll dinámico validando carga adicional de contenido.
- Uso de teclado con `page.keyboard`.

## Precondiciones

Tener instaladas las dependencias del proyecto:

```bash
npm install
```

Tener instalados los navegadores de Playwright:

```bash
npx playwright install
```

## Ejecución

Ejecutar una prueba específica:

```bash
npm run test:click-forzado
npm run test:mouse-over
npm run test:dropdown-clicks
npm run test:drag-and-drop
npm run test:subir-archivo
npm run test:simular-teclas
npm run test:scroll
npm run test:popup-alert
npm run test:pestanas
npm run test:iframe
```

Ejecutar una prueba viendo el navegador:

```bash
npm run test:scroll -- --headed
```

El `--` permite pasar argumentos extra al script interno de Playwright.

## Resultados

Las pruebas fueron ejecutadas individualmente usando los scripts definidos en `package.json`.

Se validaron correctamente las acciones principales del Quick Task:

- Click forzado.
- Mouse over.
- Dropdown y clicks especiales.
- Drag and drop.
- Descarga de archivo.
- Simulación de teclas.
- Scroll infinito.
- Alert, confirm, prompt y modal.
- Apertura y validación de nueva pestaña.
- Escritura dentro de iframe.

## Evidencias

Cuando aplique, las evidencias pueden guardarse en:

```txt
evidencias/
```

También puede revisarse el reporte HTML de Playwright con:

```bash
npx playwright show-report
```

## Notas técnicas

El proyecto usa una configuración dedicada:

```txt
playwright.quick-task.config.cjs
```

Los tests se ejecutan principalmente en Chromium usando:

```bash
--project=chromium
```

Se evita subir archivos temporales o pesados mediante `.gitignore`, incluyendo:

```txt
node_modules/
test-results/
playwright-report/
```
