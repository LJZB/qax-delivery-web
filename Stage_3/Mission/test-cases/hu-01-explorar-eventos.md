# HU-01: Explorar eventos

## Historia de usuario

**Como** usuario de QAXTickets  
**Quiero** filtrar eventos por categoria  
**Para** encontrar rapidamente el tipo de espectaculo que me interesa

## Feature: Explorar eventos

```gherkin
Feature: Explorar eventos

  Background:
    Given que el usuario abre la pagina principal de QAXTickets

  Scenario: Visualizar los eventos disponibles
    Then se muestran 6 eventos
    And cada evento muestra nombre, fecha, lugar y precio

  Scenario: Filtrar eventos por la categoria Futbol
    When el usuario hace clic en el filtro "Futbol"
    Then solo se muestran los eventos de la categoria "Futbol"
    And el boton del filtro "Futbol" se resalta visualmente

  Scenario: Navegar a la seleccion de asientos
    When el usuario hace clic en "Comprar Entradas"
    Then navega a la seleccion de asientos
```

