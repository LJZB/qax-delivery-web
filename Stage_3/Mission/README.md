# Stage 3 Mission - QAXTickets

Proyecto de automatizacion de la plataforma de venta de entradas QAXTickets con Playwright, TypeScript, pnpm y Page Object Model.

## Objetivo de la entrega

Este proyecto corresponde a la **Mission completa del Stage 3**. El objetivo es diseñar y automatizar todas las historias de usuario y criterios de aceptacion de QAXTickets.

La automatizacion cubrira el flujo end-to-end completo:

- exploracion y filtro de eventos;
- seleccion de asientos;
- checkout;
- pago mediante iframe;
- generacion y consulta de tickets.

## Alcance y estado actual

La Mission se encuentra **en desarrollo**. Actualmente estan implementadas la **HU-01: Explorar eventos** y la **HU-02: Seleccionar asientos**. Las siguientes historias se incorporaran progresivamente hasta completar todo el flujo.

La solucion final utilizara Playwright con TypeScript, Page Object Model, clases independientes para cada pagina, anotaciones, validaciones visuales y de estado, manejo del iframe de pago, evidencias automaticas y documentacion de ejecucion.

## Sitio de practica

[QAXTickets](https://qaxpert.com/lab/sites/stage-3/tickets/index.html)

La aplicacion no requiere login y persiste sus datos en `localStorage`.

## Estructura

```text
Mission/
|-- pages/
|   |-- BasePage.ts
|   |-- EventsPage.ts
|   `-- SeatsPage.ts
|-- test-cases/
|   `-- hu-01-explorar-eventos.md
|-- tests/
|   |-- hu-01-explorar-eventos.spec.ts
|   `-- hu-02-seleccionar-asientos.spec.ts
|-- .gitignore
|-- package.json
|-- playwright.config.ts
|-- pnpm-lock.yaml
|-- README.md
`-- tsconfig.json
```

## Video

La grabacion esta configurada con `video: 'on'` en `playwright.config.ts`.

## Historias implementadas

La HU-01 esta implementada con Page Object Model y tres escenarios automatizados:

- visualizacion de 6 eventos con nombre, fecha, lugar y precio;
- filtro de la categoria Futbol y validacion visual del boton activo;
- navegacion desde Comprar Entradas hasta la seleccion de asientos.

La HU-02 esta implementada con Page Object Model y siete escenarios automatizados:

- presencia de las zonas VIP, Platea y General;
- color verde para asientos libres;
- color rojo y bloqueo funcional para asientos ocupados;
- color dorado para asientos seleccionados;
- limite maximo de cuatro asientos y advertencia;
- resumen flotante con asientos, precios y total;
- estado del boton Continuar a Pago con y sin seleccion.

### Reporte de defecto: el mapa puede quedar vacio por datos persistidos

| Campo | Detalle |
| --- | --- |
| Modulo | QAXTickets - Seleccion de asientos |
| Ambiente | `https://qaxpert.com/lab/sites/stage-3/tickets/` |
| Fecha del hallazgo | 22 de julio de 2026 |
| Severidad | Alta |
| Prioridad sugerida | Alta |
| Estado | Reproducido con solucion temporal |

#### Descripcion

Al ingresar a la pantalla de seleccion con datos anteriores almacenados en el navegador, la pagina puede cargar la informacion del evento, el escenario y la leyenda, pero dejar vacio el mapa de asientos.

#### Precondicion

Tener datos persistidos de una sesion anterior en la caché o en `localStorage` y un evento seleccionado en QAXTickets.

#### Pasos para reproducir

1. Abrir QAXTickets en una sesion que conserve datos anteriores.
2. Seleccionar un evento disponible.
3. Hacer clic en **Comprar Entradas**.
4. Observar que el mapa puede aparecer sin asientos.
5. Limpiar la caché y los datos almacenados del sitio.
6. Repetir el flujo y comprobar que los asientos vuelven a mostrarse.

#### Resultado esperado

El mapa debe mostrar siempre las zonas VIP, Platea y General con sus respectivos asientos, independientemente de los datos conservados por una sesion anterior.

#### Resultado actual

Con datos anteriores almacenados, el area del mapa puede aparecer vacia. Despues de limpiar la caché y `localStorage`, los asientos se renderizan correctamente y es posible seleccionarlos.

#### Impacto

Mientras ocurre, el defecto bloquea temporalmente la HU-02 y el flujo posterior. El usuario necesita borrar los datos del sitio para recuperar la funcionalidad.

#### Evidencia

Se cuenta con una captura del mapa vacio y otra posterior a la limpieza de caché donde se observan las zonas, los asientos y el resumen de compra funcionando correctamente.

#### Observacion tecnica

El comportamiento esta relacionado con los datos persistidos por el navegador. Limpiar la caché y `localStorage` permite que `index.html` vuelva a inicializar `qaxtickets_events` y que el mapa se renderice. La automatizacion recorre siempre el flujo desde **Comprar Entradas** y utiliza un contexto aislado, por lo que los asientos cargan correctamente durante las pruebas. La causa definitiva debe ser confirmada por el equipo de desarrollo.

### Otros incumplimientos detectados en HU-02

- La zona VIP contiene asientos con `data-zone="VIP"`, pero no presenta un rotulo visible como Platea y General.
- Cuando no hay asientos seleccionados, el panel flotante permanece oculto, pero el boton **Continuar a Pago** esta habilitado en el DOM y no tiene inicialmente el atributo `disabled`.

### Ejecucion de la HU-01

```bash
pnpm run test:hu01
```

### Ejecucion con navegador visible

```bash
pnpm run test:hu01:headed
```

### Ejecucion de la HU-02

```bash
pnpm run test:hu02
```

### Ejecucion de la HU-02 con navegador visible

```bash
pnpm run test:hu02:headed
```

### Validacion de TypeScript

```bash
pnpm run typecheck
```

El README se actualizara a medida que se implementen las siguientes historias de usuario. La Mission se considerara terminada cuando todo el flujo end-to-end y sus criterios de aceptacion esten automatizados y verificados.
