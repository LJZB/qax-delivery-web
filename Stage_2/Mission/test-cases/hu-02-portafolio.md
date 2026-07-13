# HU-02: Portafolio de inversion

## Historia de usuario

Como inversionista de QAX Crypto, quiero ver mi portafolio actualizado despues de una compra, para confirmar que mis activos se registraron correctamente.

## Criterios de aceptacion cubiertos

- La tabla de holdings muestra la criptomoneda comprada con cantidad e invertido.
- El balance COP, total invertido y numero de criptos son correctos.
- El grafico dona SVG muestra segmentos de colores y porcentajes.
- Si el portafolio esta vacio, se muestra el estado correspondiente.

## Casos de prueba en Gherkin

```gherkin
Feature: Portafolio de inversion

  Scenario: Mostrar el estado de portafolio vacio
    Given el inversionista tiene un saldo de COP 10,000,000
    And no tiene criptomonedas en su portafolio
    When abre la pagina de portafolio
    Then el balance COP muestra COP 10,000,000
    And el total invertido muestra COP 0
    And el numero de criptos muestra 0
    And la tabla informa que no tiene criptomonedas
    And el grafico informa que no hay datos para mostrar

  Scenario: Mostrar el portafolio actualizado despues de comprar BTC
    Given el inversionista compra COP 500,000 en Bitcoin
    When abre la pagina de portafolio
    Then la tabla muestra Bitcoin BTC
    And muestra la cantidad 0.00178253
    And muestra COP 500,000 como valor invertido
    And el balance COP muestra COP 9,497,500
    And el total invertido muestra COP 500,000
    And el numero de criptos muestra 1
    And el grafico dona SVG muestra un segmento de color para BTC
    And la leyenda muestra BTC con el 100.0 por ciento
```
