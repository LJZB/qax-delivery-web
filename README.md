# Stage 3 - Quick Task: Aserciones y anotaciones en formularios

## Alcance implementado

- Punto 1: validacion del titulo de la pagina.
- Punto 2: validacion de visibilidad de la seccion del simulador de credito.
- Puntos 3 al 10: automatizacion del formulario principal de `QAX PayLater`.

## Notas importantes del sitio actual

### Diferencias entre el enunciado y la sandbox

- El punto 3 pide que el boton de accion este deshabilitado inicialmente, pero en `apply-step1.html` el boton `#btnSubmit` aparece habilitado desde la carga inicial.
- El punto 4 pide validar que al llenar obligatorios el boton se habilite. En la sandbox actual el boton ya viene habilitado, por lo que no existe transicion visible de deshabilitado a habilitado.
- El punto 10 pide borde rojo en campos vacios al enviar, pero la implementacion actual muestra mensajes de error (`.error-msg`) y no aplica borde rojo a los inputs.

## Decision de automatizacion

Los casos fueron implementados fieles al enunciado.  
Si la sandbox no cumple exactamente la regla pedida, la prueba queda como detector de desviacion funcional y puede fallar intencionalmente hasta que el comportamiento del sitio sea corregido.
