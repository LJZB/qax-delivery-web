# HU-03: Checkout y pago con iframe

## Historia de usuario

**Como** usuario de QAXTickets  
**Quiero** ingresar mis datos y pagar con tarjeta  
**Para** completar la compra de mis entradas

## Feature: Checkout y pago

```gherkin
Feature: Checkout y pago con iframe

  Background:
    Given que el usuario selecciono un evento
    And eligio dos asientos disponibles
    And navego a la pagina de checkout

  Scenario: Solicitar los datos del comprador
    Then el formulario solicita nombre, correo y telefono
    And los tres campos son obligatorios

  Scenario: Activar la pasarela con el total de la orden
    When el usuario completa y envia sus datos
    Then el iframe de pago se activa
    And muestra el mismo total del resumen de compra

  Scenario: Validar los campos de tarjeta dentro del iframe
    Given que la pasarela de pago esta activa
    When el usuario intenta pagar con una tarjeta de menos de 16 digitos
    And ingresa una fecha incompleta
    And ingresa un CVV de menos de 3 digitos
    Then se muestran errores para numero de tarjeta, vencimiento y CVV

  Scenario: Procesar un pago exitoso
    Given que la pasarela de pago esta activa
    When el usuario ingresa una tarjeta valida
    And procesa el pago
    Then se muestra el mensaje "Pago exitoso"

  Scenario: Generar el identificador de reserva
    Given que el pago fue aprobado
    When el sistema genera la reserva
    Then el identificador tiene el formato "TKT-XXXXXXXXXX"

  Scenario: Redirigir a Mis Entradas
    Given que el pago fue aprobado
    Then el usuario es redirigido a la pagina "Mis Entradas"
```
