# Challenge 1: Extendiendo flujo de apuestas

Automatizacion del Challenge 1 de Stage 2 sobre QAXpert Bet.

## Sitio de practica

https://qaxpert.com/lab/sites/stage-2/bet/index.html

## HU-01: Proteccion contra sobregiro

### Historia de usuario

Como apostador de QAXpert Bet, quiero que el sistema me impida apostar mas de lo que tengo en la billetera, para evitar sobregiros y mantener el control de mis finanzas.

### Criterios de aceptacion

- Al intentar apostar un monto mayor al saldo disponible, el boton "Realizar Apuesta" esta deshabilitado.
- El sistema muestra visualmente que el monto excede el saldo.

### Caso de prueba en Gherkin

```gherkin
Feature: Proteccion contra sobregiro

  Scenario: Bloquear apuesta cuando el monto total supera el saldo disponible
    Given que el apostador tiene dos selecciones agregadas al ticket
    And se encuentra en la pagina "Mi Ticket"
    When ingresa montos cuyo total supera el saldo disponible
    Then el boton "Realizar Apuesta" debe estar deshabilitado
    And el balance despues de apuesta debe mostrarse visualmente como monto excedido
```

### Cobertura automatizada

- Valida que la pagina de eventos cargue con 8 partidos visibles.
- Agrega dos cuotas "Local" al ticket lateral.
- Navega a "Mi Ticket".
- Ingresa un total de COP 501.000 sobre un saldo controlado de COP 500.000.
- Verifica que "Realizar Apuesta" quede deshabilitado.
- Verifica que el balance posterior quede negativo y se muestre con el color de peligro.

## HU-02: Recarga de billetera

### Historia de usuario

Como apostador de QAXpert Bet, quiero agregar fondos a mi billetera con montos predefinidos, para tener mas saldo disponible para apostar.

### Criterios de aceptacion

- Al seleccionar un monto preseleccionado, se marca como activo.
- Al hacer clic en "Agregar Fondos", el saldo se actualiza con el monto agregado.
- El saldo anterior mas el monto agregado coincide con el nuevo saldo mostrado.

### Caso de prueba en Gherkin

```gherkin
Feature: Recarga de billetera

  Scenario: Agregar fondos usando un monto predefinido
    Given que el apostador se encuentra en la pagina "Billetera" con saldo disponible
    When selecciona un monto predefinido de recarga
    Then el monto seleccionado debe quedar marcado como activo
    When hace clic en "Agregar Fondos"
    Then el saldo se actualiza con el monto agregado
    And el saldo anterior mas el monto agregado coincide con el nuevo saldo mostrado
```

### Cobertura automatizada

- Controla el saldo inicial en COP 500.000.
- Selecciona el preset de COP 200.000 usando `data-amount="200000"`.
- Verifica que el preset quede con la clase `active`.
- Verifica que el input `#amount` tome el valor `200000`.
- Hace clic en `#btnAddFunds`.
- Verifica el mensaje de exito.
- Verifica que el saldo visible cambie a COP 700.000.
- Verifica en `localStorage` que el balance real sea `700000`.

## HU-03: Cancelacion de apuesta

### Historia de usuario

Como apostador de QAXpert Bet, quiero poder cancelar una apuesta antes de confirmarla, para no registrar apuestas no deseadas.

### Criterios de aceptacion

- Al hacer clic en "Cancelar" en el modal de confirmacion, la apuesta no se registra.
- El saldo permanece sin cambios despues de cancelar.
- La apuesta cancelada no aparece en el historial.

### Caso de prueba en Gherkin

```gherkin
Feature: Cancelacion de apuesta

  Scenario: Cancelar una apuesta desde el modal de confirmacion
    Given que el apostador tiene una apuesta lista para confirmar
    When hace clic en "Cancelar" en el modal de confirmacion
    Then la apuesta no se registra
    And el saldo permanece sin cambios despues de cancelar
    And la apuesta cancelada no aparece en el historial
```

### Cobertura automatizada

- Controla el saldo inicial en COP 500.000.
- Agrega una seleccion al ticket desde la pagina de eventos.
- Ingresa una apuesta de COP 50.000 y abre el modal de confirmacion.
- Hace clic en "Cancelar" dentro de `#confirmModal`.
- Verifica que `qaxbet_history` permanezca vacio.
- Verifica que el modal de exito no se active.
- Verifica que `qaxbet_wallet.balance` siga en `500000`.
- Navega al historial y verifica el mensaje "No se encontraron apuestas".

## HU-04: Filtros del historial

### Historia de usuario

Como apostador de QAXpert Bet, quiero filtrar mis apuestas por estado y ordenarlas, para encontrar rapidamente la informacion que necesito.

### Criterios de aceptacion

- Al filtrar por estado "Pendiente", solo se muestran apuestas con ese estado.
- Al ordenar por "Mayor monto", las apuestas se ordenan de mayor a menor.
- Al buscar por nombre de equipo, solo aparecen las apuestas que coinciden.

### Caso de prueba en Gherkin

```gherkin
Feature: Filtros del historial

  Scenario: Filtrar, ordenar y buscar apuestas registradas
    Given que el apostador tiene apuestas registradas en el historial
    When filtra por estado "Pendiente"
    Then solo se muestran apuestas con estado "Pendiente"
    When ordena las apuestas por "Mayor monto"
    Then las apuestas se ordenan de mayor a menor
    When busca por nombre de equipo
    Then solo aparecen las apuestas que coinciden con la busqueda
```

### Cobertura automatizada

- Crea cuatro apuestas en `qaxbet_history` con estados `Pendiente`, `Ganada` y `Perdida`.
- Usa montos distintos para validar orden descendente.
- Filtra por `Pendiente` y verifica que solo aparezcan dos filas con ese estado.
- Ordena por `monto-desc` y verifica que COP 400.000 aparezca antes que COP 250.000.
- Busca `Boca` y verifica que solo aparezca `Boca Juniors vs River Plate`.

## HU-05: Drag & drop de eventos

### Historia de usuario

Como apostador de QAXpert Bet, quiero arrastrar un evento desde el catalogo hasta el ticket lateral, para agregarlo a mi seleccion de apuestas sin usar clics.

### Criterios de aceptacion

- Al arrastrar un evento al ticket lateral, se agrega automaticamente.
- El evento arrastrado se muestra en el ticket con su cuota correspondiente.
- Las odds combinadas se recalculan al agregar un nuevo evento por arrastre.

### Caso de prueba en Gherkin

```gherkin
Feature: Drag & drop de eventos

  Scenario: Agregar eventos al ticket lateral usando arrastre
    Given que el apostador esta en el catalogo de eventos con el ticket vacio
    When arrastra un evento al ticket lateral
    Then el evento se agrega automaticamente al ticket
    And el evento arrastrado se muestra con su cuota correspondiente
    When arrastra un segundo evento al ticket lateral
    Then las odds combinadas se recalculan
```

### Cobertura automatizada

- Valida que el catalogo cargue con 8 eventos y que el ticket este vacio.
- Arrastra el primer `.event-card` hacia `#ticketSidebar`.
- Verifica que el ticket tenga un item y se habilite "Ir a Apostar".
- Captura el nombre del evento y su cuota local antes del arrastre.
- Verifica que el ticket muestre el nombre y la cuota correspondiente.
- Arrastra un segundo evento y valida que `#combinedOdds` sea el producto de ambas cuotas.

## Ejecucion

```bash
pnpm test
```

### Ejecutar una HU especifica

```bash
pnpm run test:hu01
pnpm run test:hu02
pnpm run test:hu03
pnpm run test:hu04
pnpm run test:hu05
```

### Ejecutar una HU viendo el navegador

```bash
pnpm run test:hu01:headed
pnpm run test:hu02:headed
pnpm run test:hu03:headed
pnpm run test:hu04:headed
pnpm run test:hu05:headed
```
