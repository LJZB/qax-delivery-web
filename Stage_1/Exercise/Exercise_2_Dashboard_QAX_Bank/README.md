# Exercise 2 - Dashboard QAX Bank

## Descripción

Este ejercicio valida el dashboard de QAX Bank después de iniciar sesión correctamente.

El objetivo principal es mejorar las validaciones usando un array y un ciclo, evitando repetir código para cada cuenta bancaria mostrada en pantalla.

## Historia de Usuario

Como usuario autenticado de QAX Bank, quiero ver un resumen de mis cuentas en el dashboard para conocer el saldo disponible en cada una de ellas.

## Criterios de Aceptación

- El dashboard debe mostrar ambas cuentas.
- La cuenta Savings debe mostrar el saldo `$5,230,000`.
- La cuenta Checking debe mostrar el saldo `$1,845,000`.
- Debe existir el botón `Cerrar Sesión`.
- Debe existir el enlace `Ver Historial Completo`.

## Tecnologías utilizadas

- Playwright
- TypeScript
- pnpm
- Git Bash

## Estructura principal

```text
Exercise_2_Dashboard_QAX_Bank
├── tests
│   └── dashboard.spec.ts
├── package.json
├── playwright.config.ts
└── pnpm-lock.yaml
```

## Escenario automatizado

```gherkin
Feature: Dashboard de QAX Bank

  Scenario Outline: Validar cuentas en el dashboard
    Given que el usuario ha iniciado sesión en QAX Bank
    When navega al dashboard
    Then la cuenta "<cuenta>" debe mostrar el saldo "<saldo>"

    Examples:
      | cuenta   | saldo       |
      | Savings  | $5,230,000  |
      | Checking | $1,845,000  |
```

## Comandos útiles

Instalar dependencias:

```bash
pnpm install
```

Ejecutar todas las pruebas:

```bash
pnpm test
```

Ejecutar solo en Chromium:

```bash
pnpm test -- --project=chromium
```

Ejecutar en modo visible:

```bash
pnpm test -- --project=chromium --headed
```

Abrir el reporte HTML:

```bash
pnpm report
```

## Aprendizaje principal

En este ejercicio se reemplazaron validaciones repetidas por una estructura más mantenible usando:

- un array con los datos esperados
- un ciclo para recorrer las cuentas
- validaciones dinámicas con Playwright

Esto permite agregar nuevas cuentas en el futuro modificando únicamente el array de datos esperados.
