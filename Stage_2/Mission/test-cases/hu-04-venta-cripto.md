# HU-04: Venta de criptomoneda con validaciones

## Historia de usuario

Como inversionista de QAX Crypto, quiero vender parte de mis criptomonedas, para convertir mis activos a COP cuando lo necesite.

## Criterios de aceptacion cubiertos

- Al cambiar al modo Vender, el boton cambia a rojo con el texto Vender.
- Si el monto a vender supera la tenencia disponible, el boton esta deshabilitado.
- Al vender exitosamente, el saldo COP aumenta y la tenencia de cripto se reduce.
- La transaccion aparece en el historial con tipo Venta.

## Caso de prueba en Gherkin

```gherkin
Feature: Venta de criptomoneda con validaciones

  Scenario: Vender parcialmente una tenencia de Bitcoin
    Given el inversionista tiene Bitcoin disponible en su portafolio
    When cambia al modo Vender
    Then el boton de accion muestra Vender en color rojo
    When ingresa un monto superior a la tenencia disponible
    Then el boton Vender esta deshabilitado
    When ingresa COP 200,000 como monto valido de venta
    Then se calculan BTC 0.00071301
    And se calcula una comision de COP 1,000
    And el inversionista confirma la venta
    Then el saldo aumenta a COP 9,696,500
    And la tenencia se reduce a BTC 0.00106952
    And el historial muestra la transaccion con tipo Venta
```
