# Challenge 1 — Implementando POM en Haguazon

Automatización del flujo de compra de **Haguazon** con **Playwright**, **TypeScript**, **pnpm** y el patrón **Page Object Model (POM)**.

Este challenge extiende el proyecto construido en el Exercise 1. La automatización comienza agregando un producto desde la página principal y continúa por el carrito y los cuatro pasos del checkout hasta confirmar el pedido.

## Sitio de práctica

[Haguazon](https://qaxpert.com/lab/sites/stage-3/haguazon/index.html)

## Historia de usuario

> **Como** cliente de Haguazon  
> **Quiero** completar el proceso de compra desde el carrito hasta la confirmación  
> **Para** recibir mi pedido en la dirección indicada

## Criterios de aceptación

1. El carrito muestra los productos agregados con nombre, precio y cantidad.
2. Al modificar la cantidad de un producto, el subtotal se recalcula.
3. Al hacer clic en **Proceder al Pago**, navega al checkout.
4. El checkout muestra cuatro pasos: Dirección, Envío, Pago y Revisión.
5. Al completar Dirección, se habilita Envío.
6. Al seleccionar un método de envío, la opción queda seleccionada.
7. Al seleccionar un método de pago, la opción queda seleccionada.
8. En Revisión se muestran los datos ingresados, el producto y la cantidad.
9. Al confirmar el pedido, se muestra un identificador con prefijo `HGZ-`.

## Escenario automatizado

```gherkin
Feature: Completar una compra en Haguazon

  Scenario: Completar el flujo desde el carrito hasta la confirmación
    Given que el cliente agrega un producto al carrito
    Then el carrito muestra el nombre, precio y cantidad
    When modifica la cantidad del producto
    Then el subtotal se recalcula
    When hace clic en "Proceder al Pago"
    Then el checkout muestra los cuatro pasos
    When completa los datos de Dirección
    Then se habilita el paso Envío
    When selecciona Envío Express
    Then la opción queda seleccionada
    When selecciona PSE como método de pago
    Then la opción queda seleccionada
    When continúa a Revisión
    Then se muestran la dirección, envío, pago, producto y cantidad
    When confirma el pedido
    Then se muestra un identificador de orden con prefijo "HGZ-"
```

## Arquitectura Page Object Model

```text
Ch1/
├── pages/
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   └── checkout-flow.spec.ts
├── .gitignore
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

### Responsabilidad de cada archivo

| Archivo | Responsabilidad |
| --- | --- |
| `BasePage.ts` | Proporciona la navegación común que heredan los Page Objects. |
| `HomePage.ts` | Agrega el primer producto y permite abrir el carrito dedicado desde el carrito flotante. |
| `CartPage.ts` | Modela productos, cantidad, subtotales y navegación al checkout. |
| `CheckoutPage.ts` | Modela Dirección, Envío, Pago, Revisión y confirmación. |
| `checkout-flow.spec.ts` | Orquesta el caso de negocio mediante `test.step()` sin duplicar localizadores. |
| `playwright.config.ts` | Centraliza URL base, navegador, tiempos, capturas, trazas y reporte HTML. |

## Separación de responsabilidades

Cada Page Object está dividido en bloques documentados:

- **Localizadores:** describen los elementos de la interfaz pertenecientes a la página.
- **Acciones:** representan operaciones del usuario, como cambiar cantidad o continuar al siguiente paso.
- **Verificaciones:** agrupan las expectativas relacionadas con los criterios de aceptación.

El test conserva únicamente la orquestación del flujo y los datos del escenario. De esta forma, un cambio en el HTML se corrige en el Page Object correspondiente y no en cada prueba.

## Matriz de trazabilidad

| Criterio | Automatización | Page Object |
| --- | --- | --- |
| Nombre, precio y cantidad en el carrito | `verifyFirstProductDetails()` | `CartPage` |
| Recálculo del subtotal | `changeFirstProductQuantity()` y `verifyQuantityAndSubtotal()` | `CartPage` |
| Navegación al checkout | `proceedToCheckout()` y validación de URL | `CartPage` |
| Cuatro pasos visibles | `verifyFourCheckoutSteps()` | `CheckoutPage` |
| Dirección habilita Envío | `completeAddress()` y `verifyStepIsActive(2)` | `CheckoutPage` |
| Envío seleccionado | `selectShippingMethod()` y `verifyShippingSelected()` | `CheckoutPage` |
| Pago seleccionado | `selectPaymentMethod()` y `verifyPaymentSelected()` | `CheckoutPage` |
| Datos visibles en Revisión | `verifyReviewData()` | `CheckoutPage` |
| Confirmación e ID de orden | `confirmOrder()` y `verifyOrderConfirmation()` | `CheckoutPage` |

## Datos del escenario

La prueba usa datos determinísticos para facilitar la lectura del reporte:

| Campo | Valor |
| --- | --- |
| Nombre | Laura Martinez |
| Teléfono | 3001234567 |
| Dirección | Carrera 10 # 20-30 |
| Ciudad | Bogota |
| Departamento | Cundinamarca |
| Código postal | 110111 |
| Cantidad | 2 |
| Envío | Express |
| Pago | PSE |

## Aislamiento de la prueba

Antes de cada escenario se abre Haguazon, se limpia `localStorage` y se recarga la página. Esto garantiza que:

- no se reutilicen productos de una ejecución anterior;
- el carrito comience vacío;
- la prueba pueda repetirse de forma independiente;
- el producto sea agregado mediante la interfaz y no inyectado artificialmente.

## Estrategia de localizadores

Se priorizan localizadores accesibles como `getByRole()` cuando el elemento ofrece nombre y rol estables. Para componentes dinámicos sin atributos accesibles suficientes se usan selectores CSS acotados al Page Object, por ejemplo `.shipping-option` y `.payment-option`.

Los localizadores parametrizados de envío y pago identifican la opción por el `value` de su radio. Esto permite reutilizar los mismos métodos con diferentes datos sin duplicar código.

## Prerrequisitos

- Node.js 18 o superior.
- pnpm disponible en el sistema.
- Chromium instalado para Playwright.

## Instalación

Desde `Stage_3/Ch1`:

```bash
pnpm install
pnpm exec playwright install chromium
```

## Ejecución

### Validar TypeScript

```bash
pnpm run typecheck
```

### Ejecutar todas las pruebas

```bash
pnpm test
```

### Ejecutar mostrando el navegador

```bash
pnpm run test:headed
```

### Ejecutar en modo depuración

```bash
pnpm run test:debug
```

### Abrir el último reporte HTML

```bash
pnpm run report
```

## Evidencias automáticas

La configuración genera:

- reporte HTML en `playwright-report/`;
- captura de pantalla cuando una prueba falla;
- traza en el primer reintento;
- resultados temporales en `test-results/`.

Estas carpetas no se versionan porque están incluidas en `.gitignore`.

## Resultado de validación

La implementación fue verificada con:

```text
pnpm run typecheck
Sin errores de TypeScript

pnpm test
1 passed
```

## Hallazgo sobre el identificador de orden

El criterio presenta el formato `HGZ-XXXXXXXXXX`. Sin embargo, la implementación actual del sitio construye el ID mediante:

```javascript
const orderId = "HGZ-" + Date.now().toString(36).toUpperCase();
```

Durante la validación, el sufijo generado tiene ocho caracteres alfanuméricos. Por esa razón, la automatización valida el comportamiento real mediante:

```text
^HGZ-[A-Z0-9]+$
```

Esta expresión confirma el prefijo obligatorio y el sufijo dinámico sin imponer una longitud que la aplicación actualmente no produce.
