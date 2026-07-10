# Challenge 3: QAX Crypto Exchange

Automatizacion del Challenge 3 de Stage 2 sobre QAX Crypto Exchange.

## Sitio de practica

https://qaxpert.com/lab/sites/stage-2/crypto/index.html

## Alcance actual

Este primer corte automatiza solo la HU-01: compra de Bitcoin con saldo suficiente.

Las HU-02 a HU-05 quedan fuera de este corte por decision de alcance y se podran agregar en iteraciones posteriores.

## HU-01: Compra de criptomoneda

### Historia de usuario

Como inversionista de QAX Crypto, quiero comprar Bitcoin (BTC) con COP, para agregarlo a mi portafolio de inversion.

### Criterios de aceptacion

- Al seleccionar BTC, se muestra su precio actual en COP.
- Al ingresar un monto en COP, el sistema calcula cripto a recibir, comision 0.5% y total.
- El boton "Comprar" esta habilitado solo si el total no supera el saldo.
- Al hacer clic en "Comprar", se abre un modal de confirmacion con los detalles de la operacion.
- Al confirmar, el saldo se descuenta, BTC se agrega al portafolio y se muestra el modal de exito.
- La transaccion aparece en el historial con todos sus datos.

### Caso de prueba en Gherkin

El caso documentado esta en:

```text
test-cases/hu-01-compra-btc.md
```

### Cobertura automatizada

- Inicializa el estado de la app con saldo COP 10,000,000, portafolio vacio e historial vacio.
- Selecciona Bitcoin (BTC) en la pagina de compra y venta.
- Valida el precio actual de BTC en COP.
- Valida que el boton Comprar se deshabilita cuando el total supera el saldo disponible.
- Ingresa COP 500,000 y valida:
  - BTC a recibir: 0.00178253.
  - Comision: COP 2,500.
  - Total: COP 502,500.
- Abre el modal de confirmacion y valida los detalles de la compra.
- Confirma la operacion y valida el modal de exito.
- Valida saldo final COP 9,497,500.
- Valida que BTC aparece en el portafolio.
- Valida que la transaccion aparece en el historial como Compra de BTC.

## Instalacion

```bash
pnpm install
```

## Ejecucion

Ejecutar toda la suite:

```bash
pnpm test
```

Ejecutar solo HU-01:

```bash
pnpm run test:hu01
```

Ejecutar HU-01 en modo headed:

```bash
pnpm run test:hu01:headed
```

Abrir reporte HTML:

```bash
pnpm run report
```

## Evidencia de video

La configuracion de Playwright usa:

```ts
video: 'on'
```

Los videos se generan en `test-results/` durante la ejecucion.
