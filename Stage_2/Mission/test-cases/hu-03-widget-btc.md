# HU-03: Widget BTC en iframe

## Historia de usuario

Como inversionista de QAX Crypto, quiero ver el widget de Bitcoin en tiempo real en la pagina de mercado, para monitorear el precio sin cambiar de pagina.

## Criterios de aceptacion cubiertos

- El iframe del widget BTC carga correctamente.
- Dentro del iframe se muestra el precio actual de BTC.
- El grafico de barras tiene 20 barras renderizadas.
- Las estadisticas 24h de cambio, volumen, maximo y minimo estan visibles.
- El indicador "En vivo" esta presente.

## Caso de prueba en Gherkin

```gherkin
Feature: Widget BTC en iframe

  Scenario: Consultar la informacion en vivo de Bitcoin desde el mercado
    Given el inversionista abre la pagina de mercado
    Then el iframe del widget BTC carga correctamente
    And dentro del iframe se muestra el precio actual de BTC en COP
    And el grafico muestra exactamente 20 barras
    And la estadistica de cambio de las ultimas 24 horas esta visible
    And la estadistica de volumen de las ultimas 24 horas esta visible
    And la estadistica de precio maximo de las ultimas 24 horas esta visible
    And la estadistica de precio minimo de las ultimas 24 horas esta visible
    And el indicador En vivo esta presente
```
