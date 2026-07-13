# Challenge 3: QAX Crypto Exchange

Automatizacion del Challenge 3 de Stage 2 sobre QAX Crypto Exchange.

## Sitio de practica

https://qaxpert.com/lab/sites/stage-2/crypto/index.html

## Alcance actual

Este corte automatiza las HU-01 a HU-04 de QAX Crypto Exchange.

La HU-05 queda fuera de este corte y se podra agregar en una iteracion posterior.

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

## HU-02: Portafolio de inversion

### Cobertura automatizada

- Valida las tarjetas de balance COP, total invertido y numero de criptos.
- Valida que BTC aparece en holdings con cantidad e invertido correctos.
- Valida que el grafico dona SVG tiene un segmento de color y porcentaje para BTC.
- Valida los mensajes de tabla y grafico cuando el portafolio esta vacio.

### Caso de prueba en Gherkin

El caso documentado esta en:

```text
test-cases/hu-02-portafolio.md
```

## HU-03: Widget BTC en iframe

### Cobertura automatizada

- Valida que el iframe BTC carga su contenido interno.
- Valida el precio actual de BTC en COP por su formato dinamico.
- Valida que el grafico renderiza exactamente 20 barras.
- Valida cambio, volumen, maximo y minimo de las ultimas 24 horas.
- Valida que el indicador En vivo esta presente.

### Caso de prueba en Gherkin

El caso documentado esta en:

```text
test-cases/hu-03-widget-btc.md
```

## HU-04: Venta de criptomoneda con validaciones

### Cobertura automatizada

- Valida que el modo Vender cambia el texto y el color del boton de accion.
- Valida que una venta superior a la tenencia disponible queda deshabilitada.
- Valida que una venta parcial aumenta el saldo COP y reduce la tenencia BTC.
- Valida que el historial registra la operacion con tipo Venta.

### Caso de prueba en Gherkin

El caso documentado esta en:

```text
test-cases/hu-04-venta-cripto.md
```

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

Ejecutar solo HU-02:

```bash
pnpm run test:hu02
```

Ejecutar HU-02 en modo headed:

```bash
pnpm run test:hu02:headed
```

Ejecutar solo HU-03:

```bash
pnpm run test:hu03
```

Ejecutar HU-03 en modo headed:

```bash
pnpm run test:hu03:headed
```

Ejecutar solo HU-04:

```bash
pnpm run test:hu04
```

Ejecutar HU-04 en modo headed:

```bash
pnpm run test:hu04:headed
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
