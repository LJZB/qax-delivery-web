# HU-02: Seleccionar asientos

## Historia de usuario

**Como** usuario de QAXTickets  
**Quiero** elegir hasta 4 asientos en diferentes zonas  
**Para** asistir al evento con mis amigos

## Feature: Seleccionar asientos

```gherkin
Feature: Seleccionar asientos

  Background:
    Given que el usuario selecciono un evento disponible
    And navego a la pantalla de seleccion de asientos

  Scenario: Visualizar las zonas del mapa
    Then el mapa muestra las zonas "VIP", "Platea" y "General"

  Scenario: Visualizar un asiento libre
    Then los asientos libres se muestran en color verde

  Scenario: Impedir la seleccion de un asiento ocupado
    Given que existe un asiento ocupado
    Then el asiento ocupado se muestra en color rojo
    When el usuario intenta seleccionarlo
    Then el asiento no cambia al estado seleccionado
    And no aparece en el resumen de compra

  Scenario: Seleccionar un asiento libre
    When el usuario selecciona un asiento libre
    Then el asiento cambia a color dorado

  Scenario: Limitar la seleccion a cuatro asientos
    Given que el usuario selecciono cuatro asientos
    When intenta seleccionar un quinto asiento
    Then el quinto asiento no queda seleccionado
    And aparece una advertencia indicando el limite de cuatro asientos

  Scenario: Mostrar el resumen de los asientos seleccionados
    When el usuario selecciona dos asientos libres
    Then el panel flotante muestra cada asiento con su zona y precio
    And el total corresponde a la suma de los asientos seleccionados

  Scenario: Mantener deshabilitado el pago sin asientos
    Given que el usuario no ha seleccionado asientos
    Then el boton "Continuar a Pago" esta deshabilitado
```
