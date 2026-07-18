# Stage 3 Mission - QAXTickets

Proyecto de automatizacion de la plataforma de venta de entradas QAXTickets con Playwright, TypeScript, pnpm y Page Object Model.

## Aviso sobre esta entrega

Esta entrega corresponde a un **avance parcial de la Mission del Stage 3**, realizado con el proposito de **desbloquear el acceso al Stage 4** en la plataforma.

No representa la implementacion completa de la Mission. En esta etapa se trabajara unicamente la **HU-01: Explorar eventos**. Las demas historias de usuario y el flujo completo de QAXTickets quedan fuera del alcance de este avance.

## Alcance actual

Por ahora, el proyecto cubrira unicamente la HU-01: Explorar eventos como evidencia de avance para desbloquear el Stage 4.

## Sitio de practica

[QAXTickets](https://qaxpert.com/lab/sites/stage-3/tickets/index.html)

La aplicacion no requiere login y persiste sus datos en `localStorage`.

## Estructura

```text
Mission/
|-- pages/
|   |-- BasePage.ts
|   `-- EventsPage.ts
|-- test-cases/
|   `-- hu-01-explorar-eventos.md
|-- tests/
|   `-- hu-01-explorar-eventos.spec.ts
|-- .gitignore
|-- package.json
|-- playwright.config.ts
|-- pnpm-lock.yaml
|-- README.md
`-- tsconfig.json
```

## Video

La grabacion esta configurada con `video: 'on'` en `playwright.config.ts`.

## Estado

La HU-01 esta implementada con Page Object Model y tres escenarios automatizados:

- visualizacion de 6 eventos con nombre, fecha, lugar y precio;
- filtro de la categoria Futbol y validacion visual del boton activo;
- navegacion desde Comprar Entradas hasta la seleccion de asientos.

### Ejecucion de la HU-01

```bash
pnpm run test:hu01
```

### Ejecucion con navegador visible

```bash
pnpm run test:hu01:headed
```

### Validacion de TypeScript

```bash
pnpm run typecheck
```

Este repositorio debe evaluarse como un **avance parcial para desbloqueo del Stage 4**, no como la entrega final de la Mission del Stage 3.
