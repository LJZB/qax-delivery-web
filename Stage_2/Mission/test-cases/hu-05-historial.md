# HU-05: Historial de transacciones

## Historia de usuario

Como inversionista de QAX Crypto, quiero filtrar y ordenar mi historial de transacciones, para encontrar operaciones especificas.

## Criterios de aceptacion cubiertos

- Al filtrar por tipo Compras, solo se muestran compras.
- Al buscar por simbolo BTC, solo se muestran transacciones de Bitcoin.
- Al ordenar por Mayor monto, la transaccion mas cara aparece primero.
- Al combinar filtro de tipo y busqueda, ambos criterios se aplican simultaneamente.

## Casos de prueba en Gherkin

```gherkin
Feature: Historial de transacciones

  Background:
    Given existen compras y ventas de BTC y ETH en el historial

  Scenario: Filtrar solamente las compras
    When el inversionista filtra por tipo Compras
    Then solo se muestran transacciones con tipo Compra

  Scenario: Buscar transacciones de Bitcoin
    When el inversionista busca por el simbolo BTC
    Then solo se muestran transacciones de Bitcoin

  Scenario: Ordenar las transacciones por mayor monto
    When el inversionista ordena por Mayor monto
    Then la compra de ETH por COP 1,200,000 aparece primero

  Scenario: Combinar el filtro Compras con la busqueda BTC
    When el inversionista filtra por tipo Compras
    And busca por el simbolo BTC
    Then solo se muestra la compra de Bitcoin por COP 500,000
```
