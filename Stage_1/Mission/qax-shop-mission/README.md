# QAX Shop Mission 1

Automatizacion web con Playwright para validar el flujo principal de compra en QAX Shop, una tienda de productos latinoamericanos.

## Objetivo

Construir una suite base que valide riesgos reales del flujo de compra:

- catalogo con productos disponibles
- busqueda de producto
- producto agregado al carrito
- persistencia del carrito
- navegacion al checkout
- formulario de compra
- generacion de numero de orden

## Sitio bajo prueba

```text
https://qaxpert.com/lab/sites/stage-1/shop/index.html
```

## Caso automatizado

```gherkin
Feature: Compra en QAX Shop

  Scenario: Buscar producto, agregar al carrito y comprar
    Given que el usuario abre el catalogo de QAX Shop
    When busca "cafe" en el buscador
    And agrega el primer resultado al carrito
    And navega al checkout
    And completa el formulario con datos validos
    And confirma la compra
    Then el sistema muestra un numero de orden QAX-ORDER-XXXXX
```

## Criterios de aceptacion cubiertos

| Criterio | Validacion automatizada |
| --- | --- |
| El catalogo muestra 12 productos | `toHaveCount(12)` sobre `.product-card` |
| Al buscar "cafe", solo se muestran productos relacionados | Busqueda del producto esperado desde el input del catalogo |
| Al hacer clic en "Agregar al Carrito", el badge se actualiza | Validacion del badge `#cartBadge` con valor `1` |
| El carrito muestra nombre y precio | Validacion del nombre del producto y precio en carrito |
| El boton "Ir a Checkout" navega al formulario de compra | Click en el enlace real "Ir a Pagar" |
| El formulario solicita nombre, email, telefono y direccion | Validacion de placeholders esperados |
| Al completar checkout, se muestra orden `QAX-ORDER-XXXXX` | Validacion con expresion regular `QAX-ORDER-\d{5}` |

## Estructura del test

El test esta dividido con `test.step` para que el reporte indique con claridad en que parte del flujo ocurre cada validacion:

- Abrir catalogo y limpiar carrito
- Validar catalogo con 12 productos
- Buscar producto por cafe
- Agregar producto al carrito
- Validar producto agregado en carrito
- Navegar al checkout
- Validar formulario de checkout
- Completar formulario con datos validos
- Confirmar compra y validar numero de orden

## Comandos

Instalar dependencias:

```bash
pnpm install
```

Ejecutar pruebas:

```bash
pnpm test
```

## Resultado actual

La prueba llega correctamente hasta el carrito y hace clic en el enlace real **Ir a Pagar**.

Actualmente el sitio navega a:

```text
https://qaxpert.com/lab/sites/stage-1/shop/checkout.html
```

Esa ruta devuelve **404 Page Not Found**, por lo que el test falla en el step:

```text
Validar formulario de checkout
```

Este fallo evidencia una regresion del flujo de negocio: el usuario no puede completar el checkout ni obtener el numero de orden `QAX-ORDER-XXXXX`.

## Tecnologias

- Playwright
- TypeScript
- pnpm
- Chromium
