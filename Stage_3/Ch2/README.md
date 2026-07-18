# Challenge 2 — Automatización de QAXTrade con POM

Proyecto de automatización construido desde cero para QAXTrade con **Playwright**, **TypeScript**, **pnpm** y **Page Object Model**.

La solución cubre el dashboard en vivo, órdenes Market y Limit, compra de AAPL, portafolio con P&L, gráfico pie y administración de alertas de precio.

## Sitio de práctica

[QAXTrade](https://qaxpert.com/lab/sites/stage-3/trade/index.html)

Saldo inicial: **$25,000 USD**. La aplicación no requiere autenticación.

## Arquitectura

```text
Ch2/
├── pages/
│   ├── BasePage.ts
│   ├── DashboardPage.ts
│   ├── TradePage.ts
│   ├── PortfolioPage.ts
│   └── AlertsPage.ts
├── tests/
│   └── qaxtrade.spec.ts
├── .gitignore
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

### Responsabilidades

| Archivo | Responsabilidad |
| --- | --- |
| `BasePage.ts` | Proporciona navegación común mediante el `baseURL`. |
| `DashboardPage.ts` | Modela resumen, watchlist, colores, velas y actualización de precios. |
| `TradePage.ts` | Modela selección de activo, Market, Limit, estados del formulario y confirmación. |
| `PortfolioPage.ts` | Modela holdings, efectivo, P&L, gráfico pie y estado vacío. |
| `AlertsPage.ts` | Modela creación, toggle, estilo inactivo y eliminación de alertas. |
| `qaxtrade.spec.ts` | Agrupa las cuatro HU en una suite y contiene siete escenarios independientes. |

Los Page Objects separan localizadores, acciones y verificaciones. El archivo de pruebas conserva los datos y la orquestación del negocio mediante `test.step()`.

## HU-01: Dashboard en vivo

### Historia de usuario

> **Como** trader de QAXTrade  
> **Quiero** ver mi watchlist con precios actualizados cada cinco segundos  
> **Para** monitorear el mercado en tiempo real

### Gherkin

```gherkin
Feature: Dashboard en vivo

  Scenario: Visualizar resumen, watchlist y mini-chart
    Given que el trader abre el dashboard
    Then se muestra el valor del portafolio, P&L diario y efectivo
    And la watchlist contiene diez activos con símbolo, precio y cambio
    And los cambios positivos son verdes y los negativos rojos
    And el mini-chart contiene veinte velas

  Scenario: Actualizar precios en tiempo real
    Given que el trader observa el precio actual de AAPL
    When ocurre el siguiente ciclo de cinco segundos
    Then el precio visible de AAPL se actualiza
```

### Cobertura

- Valida los tres valores del resumen mediante formato y contenido.
- Exige exactamente diez filas en la watchlist.
- Comprueba símbolo, precio y porcentaje de cada fila.
- Valida verde `rgb(63, 185, 80)` y rojo `rgb(248, 81, 73)`.
- Exige exactamente veinte velas con cuerpos visibles.
- Usa `expect.poll()` para esperar el cambio de precio sin una pausa fija.

## HU-02: Orden de compra

### Historia de usuario

> **Como** trader de QAXTrade  
> **Quiero** comprar acciones de AAPL mediante una orden de mercado  
> **Para** agregar el activo a mi portafolio

### Gherkin

```gherkin
Feature: Orden de compra

  Scenario: Alternar entre orden Market y Limit
    Given que el trader selecciona AAPL
    Then se muestra su precio actual
    And el botón permanece deshabilitado mientras faltan campos
    When selecciona Market
    Then se muestran cantidad y lado sin precio límite
    When completa una cantidad válida
    Then el botón se habilita
    When cambia a Limit
    Then aparece el precio límite y vuelve a deshabilitarse el botón
    When completa el precio límite
    Then el botón se habilita nuevamente

  Scenario: Comprar una acción AAPL
    Given que el trader dispone de 25,000 USD y no tiene holdings
    When envía una orden Market de compra por una acción AAPL
    Then se muestra un modal con un ID ORD válido
    And el efectivo disponible disminuye
    And AAPL aparece en el portafolio
```

### Cobertura

- Comprueba el precio de AAPL con formato monetario.
- Valida estados visible, oculto, disabled y enabled.
- Verifica que Limit use la clase visual `show`.
- Valida el ID mediante `^ORD-\d{13}$`.
- Compara el efectivo antes y después de comprar.
- Verifica AAPL tanto en el estado persistido como en la tabla del portafolio.

## HU-03: Portafolio y P&L

### Historia de usuario

> **Como** trader de QAXTrade  
> **Quiero** ver mi portafolio con ganancias y pérdidas  
> **Para** evaluar el rendimiento de mis inversiones

### Gherkin

```gherkin
Feature: Portafolio y P&L

  Scenario: Visualizar holdings y rendimiento
    Given que existe una posición ganadora y una perdedora
    When el trader abre el portafolio
    Then la tabla muestra cantidad, precio promedio y valor total
    And la ganancia se muestra en verde
    And la pérdida se muestra en rojo
    And el gráfico pie contiene segmentos de colores

  Scenario: Visualizar un portafolio vacío
    Given que el trader no tiene holdings
    When abre el portafolio
    Then se muestra el estado vacío
    And la tabla y el gráfico permanecen ocultos
```

### Cobertura

- Prepara AAPL con precio promedio bajo para garantizar P&L positivo.
- Prepara GOOGL con precio promedio alto para garantizar P&L negativo.
- Valida cantidad y formatos monetarios de la tabla.
- Comprueba los colores CSS verde y rojo.
- Valida el `conic-gradient` del gráfico pie.
- Comprueba dos elementos de leyenda con colores visibles.
- Valida la visibilidad del estado vacío y el ocultamiento de tabla y gráfico.

## HU-04: Alertas de precio

### Historia de usuario

> **Como** trader de QAXTrade  
> **Quiero** crear una alerta cuando BTC supere cierto precio  
> **Para** recibir una notificación y actuar a tiempo

### Gherkin

```gherkin
Feature: Alertas de precio

  Scenario: Crear, desactivar y eliminar una alerta
    Given que el trader abre el formulario de alertas
    When crea una alerta para BTC por encima de 100,000 USD
    Then la alerta aparece activa con un botón ON
    When desactiva la alerta
    Then el botón cambia a OFF
    And la alerta reduce su opacidad
    When elimina la alerta
    Then desaparece de la lista
    And se muestra el estado vacío
```

### Cobertura

- Completa activo, condición y precio objetivo desde la interfaz.
- Verifica los datos visibles de la alerta creada.
- Comprueba las clases `on`, `off` e `inactive`.
- Valida opacidad CSS `0.5` al desactivar.
- Confirma que la lista queda vacía después de eliminar.

## Anotaciones de negocio

Cada escenario registra reglas mediante `test.info().annotations`, entre ellas:

- colores según el signo del movimiento;
- actualización cada cinco segundos;
- diferencias entre Market y Limit;
- prohibición de enviar órdenes incompletas;
- impacto de una compra sobre efectivo y portafolio;
- colores de ganancias y pérdidas;
- comportamiento visual de alertas inactivas.

Las anotaciones quedan visibles en el reporte HTML de Playwright.

## Aislamiento y estabilidad

`test.beforeEach()` restablece las claves de QAXTrade en `localStorage`:

- `qaxtrade_portfolio`;
- `qaxtrade_orders`;
- `qaxtrade_alerts`;
- `qaxtrade_cash`;
- `qaxtrade_selected_symbol`.

Esto evita dependencias entre tests. Los escenarios que requieren un estado especial reemplazan únicamente los datos necesarios antes de navegar a la página evaluada.

La prueba no usa pausas arbitrarias. La actualización de cinco segundos se comprueba con polling y las aserciones visuales esperan automáticamente el estado requerido.

## Matriz de trazabilidad

| Historia | Criterio principal | Page Object |
| --- | --- | --- |
| HU-01 | Resumen, diez activos, colores, veinte velas y actualización | `DashboardPage` |
| HU-02 | AAPL, Market/Limit, disabled, modal, efectivo y holding | `TradePage`, `PortfolioPage` |
| HU-03 | Tabla, P&L verde/rojo, pie y estado vacío | `PortfolioPage` |
| HU-04 | Crear, toggle, opacidad y eliminar alerta | `AlertsPage` |

## Prerrequisitos

- Node.js 18 o superior.
- pnpm disponible.
- Chromium instalado para Playwright.

## Instalación

```bash
pnpm install
pnpm exec playwright install chromium
```

## Ejecución

### Proyecto completo

```bash
pnpm test
```

### Una historia de usuario

```bash
pnpm run test:hu01
pnpm run test:hu02
pnpm run test:hu03
pnpm run test:hu04
```

### Validación de TypeScript

```bash
pnpm run typecheck
```

### Modos adicionales

```bash
pnpm run test:headed
pnpm run test:debug
pnpm run report
```

## Evidencias

La configuración conserva:

- reporte HTML en `playwright-report/`;
- captura de pantalla al fallar;
- traza en el primer reintento;
- resultados temporales en `test-results/`.

Estas carpetas están excluidas mediante `.gitignore`.

## Resultado de validación

```text
pnpm run typecheck
Sin errores de TypeScript

pnpm test
7 passed
```
