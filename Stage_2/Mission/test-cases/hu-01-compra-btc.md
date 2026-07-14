# HU-01: Compra de criptomoneda

## Historia de usuario

Como inversionista de QAX Crypto, quiero comprar Bitcoin (BTC) con COP, para agregarlo a mi portafolio de inversion.

## Criterios de aceptacion cubiertos

- Al seleccionar BTC, se muestra su precio actual en COP.
- Al ingresar un monto en COP, el sistema calcula cripto a recibir, comision 0.5% y total.
- El boton "Comprar" esta habilitado solo si el total no supera el saldo.
- Al hacer clic en "Comprar", se abre un modal de confirmacion con los detalles de la operacion.
- Al confirmar, el saldo se descuenta, BTC se agrega al portafolio y se muestra el modal de exito.
- La transaccion aparece en el historial con todos sus datos.

## Datos de prueba

- Saldo inicial: COP 10,000,000.
- Criptomoneda: Bitcoin (BTC).
- Precio BTC usado por la pagina de compra: COP 280,500,000.
- Monto de compra valido: COP 500,000.
- Comision esperada: COP 2,500.
- Total esperado: COP 502,500.
- BTC esperado: 0.00178253.
- Saldo final esperado: COP 9,497,500.

## Caso de prueba en Gherkin

```gherkin
Feature: Compra de criptomoneda

  Scenario: Comprar Bitcoin exitosamente con saldo suficiente
    Given el inversionista tiene un saldo inicial de COP 10,000,000
    And abre la pagina de compra y venta
    When selecciona Bitcoin BTC
    Then se muestra el precio actual de BTC en COP
    When ingresa un monto superior al saldo disponible
    Then el boton Comprar esta deshabilitado
    When ingresa COP 500,000 como monto de compra
    Then el sistema calcula la cantidad de BTC a recibir
    And calcula la comision del 0.5%
    And calcula el total de la operacion
    And el boton Comprar esta habilitado
    When abre el modal de confirmacion de compra
    Then el modal muestra los detalles de BTC, monto COP y comision
    When confirma la compra
    Then se muestra el modal de exito
    And el saldo COP se descuenta correctamente
    And BTC se agrega al portafolio
    And la compra aparece en el historial de transacciones
```

## Estrategia de automatizacion

- Se inicializa `localStorage` con saldo, portafolio e historial limpios.
- Se priorizan localizadores por label, role e id de elementos de negocio.
- Se valida el flujo completo desde compra hasta persistencia en portafolio e historial.
- Se usa `test.step` para que el reporte de Playwright refleje la narrativa de la HU.
