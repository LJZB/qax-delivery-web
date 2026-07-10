# Stage 3 - Quick Task: Aserciones y anotaciones en formularios

## Objetivo

Disenar los casos de prueba en formato Gherkin para el formulario de `QAX PayLater`, aplicando el uso correcto de aserciones y anotaciones en Playwright.

## Sitio de practica

- Aplicacion: `QAX PayLater`
- Flujo objetivo: simulador / formulario de credito

## Criterios de la consigna

- Disenar los casos de prueba en Gherkin en `TestCase.md`.
- Usar aserciones auto-retrying en las validaciones de campos.
- Usar aserciones non-retrying para validar el titulo de la pagina.
- Usar soft assertions para validar atributos de varios campos despues de enviar el formulario.

## Feature: Aserciones y anotaciones en formularios

### Background

Given que el usuario navega al formulario de QAX PayLater

### Scenario 1: Validar que el titulo de la pagina contenga QAX PayLater

When el usuario consulta el titulo actual de la pagina
Then el titulo debe contener el texto `QAX PayLater`

### Scenario 2: Validar que la seccion del simulador de credito este visible

When el usuario selecciona un producto y un plazo de financiamiento
Then la seccion del simulador de credito debe estar visible

### Scenario 3: Validar que el boton de accion este deshabilitado inicialmente

Given que el formulario aun no ha sido diligenciado
When el usuario inspecciona el boton principal de envio o simulacion
Then el boton debe estar deshabilitado

### Scenario 4: Validar que al llenar los campos obligatorios, el boton se habilite

Given que el usuario esta en el formulario de credito
When diligencia todos los campos obligatorios con datos validos
Then el boton principal debe habilitarse

### Scenario 5: Validar que al enviar el formulario aparezca un mensaje de confirmacion

Given que el usuario completo correctamente los campos obligatorios
When envia el formulario
Then debe mostrarse un mensaje de confirmacion

### Scenario 6: Validar que el mensaje de confirmacion contenga el texto esperado

Given que el mensaje de confirmacion ya fue mostrado
When el usuario lee el contenido del mensaje
Then el mensaje debe contener el texto esperado por negocio

### Scenario 7: Validar que un campo de entrada mantenga el valor ingresado

Given que el usuario escribe un valor en un campo del formulario
When finaliza la interaccion con ese campo
Then el campo debe conservar el valor ingresado

### Scenario 8: Validar que un campo sea editable

Given que el usuario se encuentra en el formulario
When intenta escribir sobre un campo habilitado
Then el campo debe permitir edicion

### Scenario 9: Validar que un campo acepte un formato numerico valido

Given que existe un campo configurado para recibir datos numericos
When el usuario ingresa un valor numerico valido
Then el campo debe aceptar el formato sin mostrar error

### Scenario 10: Validar que al enviar sin llenar campos obligatorios aparezca un borde rojo en los campos vacios

Given que el usuario deja vacios uno o varios campos obligatorios
When intenta enviar el formulario
Then los campos vacios deben mostrar un borde rojo de validacion

## Notas tecnicas para la automatizacion

### Aserciones sugeridas por tipo

- Non-retrying assertion para el titulo:
  `const title = await page.title(); expect(title).toContain('QAX PayLater');`
- Auto-retrying assertions para estados dinamicos del formulario:
  `toBeVisible()`, `toBeEnabled()`, `toBeDisabled()`, `toHaveValue()`, `toContainText()`.
- Soft assertions para validar varios atributos despues del submit:
  `expect.soft(locator).toHaveAttribute(...)`.

### Anotaciones de Playwright recomendadas

- `test.describe()` para agrupar la suite del formulario.
- `test.beforeEach()` para abrir la pagina antes de cada caso.
- `test.afterEach()` solo si hace falta limpieza o captura adicional.
- `test.use()` si la suite necesita configuracion especifica.
- `test.only()` y `test.skip()` solo para depuracion local, no como entrega final.

## Cobertura esperada

Este documento cubre los 10 casos visibles en la consigna del Quick Task y deja lista la base para automatizarlos en Playwright cuando se tenga la URL activa del sandbox y los locators reales del formulario.
