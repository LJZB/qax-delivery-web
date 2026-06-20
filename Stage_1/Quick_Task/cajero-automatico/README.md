# Cajero Automático QAX

## Título de la entrega

Quick Task - Cajero Automático usando TypeScript y consola

## Objetivo / Historia de usuario

Como usuario de un cajero automático, quiero registrar cuentas bancarias y realizar operaciones básicas, para consultar saldo, depositar y retirar dinero respetando las reglas de negocio.

## Criterios de aceptación

- El sistema permite registrar hasta 10 cuentas bancarias.
- Cada cuenta tiene número de cuenta de 4 dígitos, titular y saldo inicial.
- El usuario puede consultar el saldo de una cuenta registrada.
- El usuario puede depositar dinero en una cuenta.
- El usuario puede retirar dinero validando saldo disponible.
- No se permite retirar más dinero del saldo disponible.
- No se permite retirar más de $10,000 por transacción.
- El saldo de una cuenta no puede quedar negativo.
- El programa finaliza cuando el usuario ingresa `000`.
- Al finalizar, se muestra un resumen de cuentas y transacciones realizadas.

## Estrategia de prueba

### Casos principales

1. Registrar cuenta válida con número de 4 dígitos.
2. Rechazar cuenta con número diferente a 4 dígitos.
3. Rechazar saldo inicial negativo.
4. Consultar saldo de una cuenta existente.
5. Depositar un monto válido.
6. Retirar un monto válido.
7. Rechazar retiro mayor al saldo disponible.
8. Rechazar retiro mayor a $10,000.
9. Registrar más de una cuenta.
10. Finalizar con `000` y validar resumen final.

### Datos de prueba

| Caso | Cuenta | Titular | Saldo inicial | Operación | Resultado esperado |
|---|---|---|---:|---|---|
| Registro válido | 1234 | Luis | 20000 | Crear cuenta | Cuenta registrada |
| Cuenta inválida | 12345 | Luis | 1000 | Crear cuenta | Cuenta rechazada |
| Saldo inválido | 5678 | Ana | -100 | Crear cuenta | Saldo rechazado |
| Depósito | 1234 | Luis | 20000 | Depositar 500 | Saldo 20500 |
| Retiro válido | 1234 | Luis | 20500 | Retirar 300 | Saldo 20200 |
| Retiro excedido | 1234 | Luis | 20200 | Retirar 10001 | Límite excedido |
| Fondos insuficientes | 1234 | Luis | 500 | Retirar 600 | Fondos insuficientes |

### Precondiciones

- Tener Node.js instalado.
- Tener pnpm instalado o habilitado con Corepack.
- Ejecutar los comandos desde la carpeta `cajero-automatico`.

## Ejecución

Instalar dependencias:

```bash
pnpm install
```

Ejecutar el programa:

```bash
pnpm start
```

Validar TypeScript sin generar archivos JavaScript:

```bash
pnpm exec tsc --noEmit
```

## Resultados

El programa permite operar desde consola usando un menú interactivo.

Flujo validado:

1. Registro de cuenta bancaria.
2. Consulta de saldo.
3. Depósito.
4. Retiro con validaciones.
5. Finalización con `000`.
6. Visualización de resumen de cuentas y transacciones.

## Archivos principales

- `cajero.ts`: lógica principal del cajero automático.
- `package.json`: scripts y dependencias del proyecto.
- `tsconfig.json`: configuración de TypeScript.
- `pnpm-lock.yaml`: control de versiones de dependencias.
