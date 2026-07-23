# HU-04: Mis tickets

## Historia de usuario

**Como** usuario de QAXTickets  
**Quiero** ver mis entradas compradas con su QR  
**Para** presentarlas en la entrada del evento

## Feature: Mis tickets

```gherkin
Feature: Mis tickets

  Scenario: Mostrar los tickets comprados
    Given que el usuario tiene dos reservas
    When abre la pagina "Mis Entradas"
    Then se muestra una tarjeta por cada reserva

  Scenario: Mostrar la informacion de cada ticket
    Given que el usuario tiene tickets comprados
    When abre la pagina "Mis Entradas"
    Then cada ticket muestra el nombre del evento
    And muestra el ID de la reserva
    And muestra la fecha de compra

  Scenario: Renderizar el codigo QR
    Given que el usuario tiene tickets comprados
    When abre la pagina "Mis Entradas"
    Then cada tarjeta incluye un codigo QR renderizado como SVG

  Scenario: Mostrar el resumen de compras
    Given que el usuario tiene reservas con varios asientos
    When abre la pagina "Mis Entradas"
    Then el resumen muestra el total de entradas
    And muestra el total de eventos
    And muestra el gasto acumulado

  Scenario: Mostrar el estado vacio
    Given que el usuario no tiene tickets comprados
    When abre la pagina "Mis Entradas"
    Then se muestra el mensaje de estado vacio
    And se muestra un control para volver a la pagina de eventos
```
