# Challenge 2: Comportamientos avanzados - Cobertura total

Automatizacion del Challenge 2 de Stage 2 sobre QAX Forms.

## Sitio de practica

https://qaxpert.com/lab/sites/stage-2/forms/index.html

## HU-01: Cobertura total de alertas nativas

### Historia de usuario

Como QA de QAX Forms, quiero probar todas las variantes de alertas del navegador, para garantizar que el sistema responde correctamente en cada situacion.

### Criterios de aceptacion

- Alerta simple: se muestra y se cierra al aceptar.
- Confirmar (Aceptar): muestra mensaje "You pressed Ok".
- Confirmar (Cancelar): muestra mensaje "You Pressed Cancel".
- Prompt con texto: el mensaje incluye el texto ingresado.
- Prompt cancelado: no ingresa texto, el resultado se maneja como null.

### Caso de prueba en Gherkin

```gherkin
Feature: Cobertura total de alertas nativas

  Scenario: Validar todas las variantes de alertas del navegador
    Given que el QA esta en la seccion "Alertas y Modales"
    When acepta una alerta simple
    Then se muestra el resultado de aceptacion
    When acepta un dialogo de confirmacion
    Then se muestra el mensaje "You pressed Ok"
    When cancela un dialogo de confirmacion
    Then se muestra el mensaje "You Pressed Cancel"
    When ingresa texto en el prompt
    Then el resultado incluye el texto ingresado
    When cancela el prompt
    Then no se ingresa texto y no se muestra resultado
```

### Cobertura automatizada

- Navega a QAX Forms y abre la pestaña "2. Alertas y Modales".
- Usa `page.once('dialog')` antes de cada accion que dispara un dialogo nativo.
- Valida tipo y mensaje del dialogo nativo (`alert`, `confirm`, `prompt`).
- Acepta la alerta simple y verifica `#alertResult`.
- Acepta y cancela variantes de confirmacion.
- Acepta prompt con texto personalizado y valida que el resultado lo incluya.
- Cancela prompt desde estado limpio y valida que el resultado quede oculto/vacio.

## HU-02: Modales personalizados - todos los estados

### Historia de usuario

Como QA de QAX Forms, quiero validar que los modales se abren, muestran contenido correcto y se cierran por cualquier mecanismo, para asegurar que la experiencia de usuario con modales es consistente.

### Criterios de aceptacion

- Modal se abre y el contenido es visible.
- Titulo y cuerpo del modal contienen los textos esperados.
- Boton Cancelar cierra el modal y no ejecuta la accion.
- Boton Confirmar cierra el modal y ejecuta la accion.
- Modal no esta visible en pantalla despues de cerrarse.

### Caso de prueba en Gherkin

```gherkin
Feature: Modales personalizados - todos los estados

  Scenario: Validar apertura, contenido y cierres de modales personalizados
    Given que el QA esta en la seccion "Alertas y Modales"
    When abre el modal de confirmacion
    Then el contenido esperado es visible
    And el titulo y cuerpo contienen los textos esperados
    When hace clic en "Cancelar"
    Then el modal cierra sin ejecutar la accion
    When abre nuevamente el modal de confirmacion
    And hace clic en "Confirmar"
    Then el modal cierra y ejecuta la accion
    When abre y cierra el modal informativo
    Then el modal no queda visible en pantalla
```

### Cobertura automatizada

- Abre el modal de confirmacion usando el boton visible.
- Valida titulo "¿Confirmar acción?" y texto del cuerpo.
- Hace clic en "Cancelar" y verifica que `#alertResult` siga oculto/vacio.
- Reabre el modal y confirma la accion.
- Verifica el mensaje "Operación confirmada exitosamente.".
- Abre el modal informativo, valida su contenido y lo cierra con "Cerrar".
- Verifica que los overlays `#confirmModal` y `#infoModal` no queden visibles despues de cerrarse.

## HU-03: Iframes - simple y anidados

### Historia de usuario

Como QA de QAX Forms, quiero validar la interaccion con iframes de distintos niveles de anidamiento, para garantizar que el sistema mantiene el contexto correcto en cada nivel.

### Criterios de aceptacion

- Iframe simple: el contenido del iframe es visible y accesible.
- Iframe anidado: se puede navegar al iframe hijo y escribir en su input.
- Cambio de contexto: despues del iframe, se vuelve al contexto principal sin errores.
- Validacion de texto: el mensaje generado dentro del iframe es correcto.

### Caso de prueba en Gherkin

```gherkin
Feature: Iframes - simple y anidados

  Scenario: Interactuar con iframe simple, iframe padre e iframe hijo
    Given que el QA esta en la seccion "Frames"
    When inspecciona el iframe simple
    Then su contenido es visible y accesible
    When carga el iframe hijo desde el iframe padre
    And escribe texto en el input del iframe hijo
    Then el mensaje generado dentro del iframe hijo es correcto
    And despues del iframe vuelve al contexto principal sin errores
```

### Cobertura automatizada

- Abre la pestaña "3. Frames".
- Usa `frameLocator('#singleIframe')` para validar el iframe simple.
- Verifica titulo, fecha de actualizacion y correo legal dentro del iframe simple.
- Usa `frameLocator('#parentIframe')` para entrar al iframe padre.
- Carga el iframe hijo con el boton "Cargar Iframe Hijo".
- Usa `frameLocator('#childFrame')` desde el padre para escribir texto en el input hijo.
- Verifica el resultado `Texto ingresado: Texto desde Playwright`.
- Vuelve al contexto principal haciendo clic en la pestaña "Inicio" y valida contenido principal.

### Defecto encontrado

La validacion de iframe anidado queda en rojo porque el sitio no expone la funcion `loadChildFrame` que usa el boton `Cargar Iframe Hijo`.
Durante la ejecucion el navegador reporta `Invalid or unexpected token` y luego `loadChildFrame is not defined`, por eso el iframe hijo no se carga.

## HU-04: Flujo combinado - cambios de contexto

### Historia de usuario

Como QA de QAX Forms, quiero probar una secuencia real que combine alertas, modales e iframes, para detectar regresiones en el manejo de contexto al alternar entre componentes.

### Criterios de aceptacion

- Abrir una alerta, luego un modal, luego un iframe en secuencia.
- Volver al contexto principal despues de cada interaccion.
- El estado de la pagina no se corrompe al alternar contextos.
- Todas las validaciones pasan en cada paso de la secuencia.

### Caso de prueba en Gherkin

```gherkin
Feature: Flujo combinado - cambios de contexto

  Scenario: Alternar entre alerta, modal e iframe sin corromper el estado
    Given que el QA esta en la seccion "Alertas y Modales"
    When acepta una alerta nativa
    Then vuelve al contexto principal de la pagina
    When abre y confirma un modal personalizado
    Then el modal se cierra y el contexto principal sigue disponible
    When navega a la seccion "Frames"
    And valida el contenido de un iframe simple
    Then puede volver al contexto principal sin errores
    And la pagina conserva sus controles principales disponibles
```

### Cobertura automatizada

- Ejecuta una alerta nativa y valida el resultado visual.
- Abre un modal personalizado, confirma la accion y valida que el overlay cierre.
- Cambia a la pestana "3. Frames" y valida contenido dentro de `#singleIframe`.
- Vuelve a "Inicio" y confirma que el contexto principal sigue operativo.
- Regresa a "2. Alertas y Modales" y valida que los controles y modales no quedaron corruptos.

## Notas de ejecucion

- HU-01, HU-02 y HU-04 pasan de forma independiente.
- HU-03 queda automatizada, pero falla por un defecto del sitio en el iframe anidado.
- El boton `Cargar Iframe Hijo` invoca `loadChildFrame()`, pero durante la prueba esa funcion no existe en el contexto del iframe padre.
- El navegador reporta `Invalid or unexpected token` y despues `loadChildFrame is not defined`; por eso `pnpm test` queda en rojo hasta que se corrija el sitio.
- Para validar las HU que no dependen de ese defecto, ejecutar los scripts individuales.

## Ejecucion

```bash
pnpm test
```

### Ejecutar por HU

```bash
pnpm run test:hu01
pnpm run test:hu01:headed
pnpm run test:hu02
pnpm run test:hu02:headed
pnpm run test:hu03
pnpm run test:hu03:headed
pnpm run test:hu04
pnpm run test:hu04:headed
```
