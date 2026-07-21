# Stage 3 - Quick Task: Aserciones y anotaciones en formularios

## Alcance implementado

- Punto 1: validación del título de la página.
- Punto 2: validación de la visibilidad de la sección del simulador de crédito.
- Puntos 3 al 10: automatización del formulario principal de `QAX PayLater`.

## Notas importantes del sitio actual

### Diferencias entre el enunciado y la sandbox

- El punto 3 pide que el botón de acción esté deshabilitado inicialmente, pero en `apply-step1.html` el botón `#btnSubmit` aparece habilitado desde la carga inicial.
- El punto 4 pide validar que, al llenar los campos obligatorios, el botón se habilite. En la sandbox actual, el botón ya viene habilitado, por lo que no existe una transición visible de deshabilitado a habilitado.
- El punto 10 pide un borde rojo en los campos vacíos al enviar, pero la implementación actual muestra mensajes de error (`.error-msg`) y no aplica un borde rojo a los inputs.

## Decisión de automatización

Los casos fueron implementados fielmente según el enunciado.

Si la sandbox no cumple exactamente con la regla solicitada, la prueba queda como detector de desviaciones funcionales y puede fallar intencionalmente hasta que se corrija el comportamiento del sitio.
