# Exercise 1: Login en QAX Bank

Automatización del flujo de login para QAX Bank usando Playwright con TypeScript.

## Objetivo

Validar que un usuario pueda iniciar sesión correctamente con credenciales válidas y que, después del login, sea redirigido al dashboard donde se muestra el saludo del usuario.

## Caso automatizado

**Feature:** Login en QAX Bank

**Scenario:** Iniciar sesión con credenciales válidas

- Given que el usuario abre la página de login
- When ingresa email y contraseña válidos
- And hace clic en Ingresar
- Then el sistema redirige al dashboard
- And muestra el saludo del usuario

## Datos utilizados

- URL: https://qaxpert.com/lab/sites/stage-1/bank/index.html
- Email: cliente@qaxbank.com
- Password: Test1234
- Título esperado: QAX Bank — Banca Digital
- URL esperada: dashboard.html
- Saludo esperado: Hola, Carlos Andrés López

## Archivo principal

El test se encuentra en:

```bash
tests/login.spec.ts
```

## Estructura del test

El escenario fue organizado usando `test.step`, separando el flujo en pasos claros:

- Abrir la página de login
- Verificar el título de la página
- Ingresar el correo
- Ingresar la contraseña
- Hacer clic en el botón de ingreso
- Validar la redirección al dashboard
- Validar el mensaje de bienvenida

## Instalación

Este proyecto usa `pnpm`.

Para instalar las dependencias:

```bash
pnpm install
```

## Ejecución del test

Para ejecutar únicamente el test de login:

```bash
pnpm run test:login
```

Para ejecutar todos los tests del proyecto:

```bash
pnpm run test
```

## Otros comandos disponibles

Ejecutar los tests en modo headed:

```bash
pnpm run test:headed
```

Abrir Playwright UI:

```bash
pnpm run test:ui
```

Ejecutar en modo debug:

```bash
pnpm run test:debug
```

Abrir el reporte de Playwright:

```bash
pnpm run report
```

## Resultado esperado

El test debe ejecutarse correctamente en los navegadores configurados por Playwright y finalizar con estado exitoso.

---

# Challenge 1: Login en QAX Clinic

Automatización del login de QAX Clinic y validación del acceso al formulario de reserva de citas médicas.

## Objetivo

Validar que un paciente registrado pueda iniciar sesión con documento y contraseña, y que el sistema lo redirija correctamente a la página de reserva de cita.

## Datos utilizados

- URL: https://qaxpert.com/lab/sites/stage-1/clinic/index.html
- Documento: 1234567890
- Password: paciente123
- Título esperado: QAX Clinic - Login
- URL esperada: appointment.html
- Encabezado esperado: Reservar Cita Médica

## Archivo principal

```bash
tests/clinic-login.spec.ts
```

## Validaciones principales

- La página de login carga correctamente.
- El campo documento solo acepta caracteres numéricos.
- El login redirige a `appointment.html`.
- El encabezado `Reservar Cita Médica` es visible.
- Los campos del formulario de cita están visibles.

## Ejecución

Para ejecutar solo el challenge en Chromium:

```bash
pnpm test:chromium tests/clinic-login.spec.ts
```
