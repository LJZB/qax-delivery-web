# Localizadores - Shadow DOM, IFrame y PopUp

## Shadow DOM

URL: https://bonigarcia.dev/selenium-webdriver-java/shadow-dom.html

- Texto dentro del Shadow DOM:
  `page.locator('#content').getByText('Hello Shadow DOM')`

  Explicación: `#content` es el host. El script crea dentro un shadow root abierto con `attachShadow({ mode: "open" })` y agrega un `<p>` con el texto `Hello Shadow DOM`. Playwright puede acceder porque el shadow root está en modo `open`.

## IFrame

URL: https://bonigarcia.dev/selenium-webdriver-java/iframes.html

- IFrame principal:
  `page.frameLocator('#my-iframe')`

  Explicación: localiza el `<iframe id="my-iframe" src="content.html">`. Como el contenido está en otro documento, primero se entra con `frameLocator()`.

- Contenido interno del iframe:
  `page.frameLocator('#my-iframe').locator('#content')`

  Explicación: dentro del iframe existe un contenedor `<div id="content">` donde se carga el texto.

- Primer párrafo interno:
  `page.frameLocator('#my-iframe').getByText('Lorem ipsum')`

  Explicación: el primer párrafo dentro del iframe comienza con el texto visible `Lorem ipsum`, por eso se puede ubicar con `getByText()`.

## PopUp / Dialog boxes

URL: https://bonigarcia.dev/selenium-webdriver-java/dialog-boxes.html

- Botón Launch alert:
  `page.getByRole('button', { name: 'Launch alert' })`

  Explicación: localiza el botón `<button id="my-alert">Launch alert</button>`, que dispara un `alert("Hello world!")`.

- Botón Launch confirm:
  `page.getByRole('button', { name: 'Launch confirm' })`

  Explicación: localiza el botón `<button id="my-confirm">Launch confirm</button>`, que dispara un `confirm("Is this correct?")`.

- Resultado del confirm:
  `page.locator('#confirm-text')`

  Explicación: localiza el `<p id="confirm-text">` donde se muestra si el usuario aceptó o canceló.

- Botón Launch prompt:
  `page.getByRole('button', { name: 'Launch prompt' })`

  Explicación: localiza el botón `<button id="my-prompt">Launch prompt</button>`, que dispara un `prompt("Please enter your name")`.

- Resultado del prompt:
  `page.locator('#prompt-text')`

  Explicación: localiza el `<p id="prompt-text">` donde se muestra el texto escrito en el prompt.

- Botón Launch modal:
  `page.getByRole('button', { name: 'Launch modal' })`

  Explicación: localiza el botón que abre el modal HTML `#example-modal`.

- Título del modal:
  `page.getByRole('heading', { name: 'Modal title' })`

  Explicación: localiza el `<h5>` visible del modal.

- Botón Close del modal:
  `page.getByRole('button', { name: 'Close' })`

  Explicación: localiza el botón visible para cerrar el modal.

- Botón Save changes:
  `page.getByRole('button', { name: 'Save changes' })`

  Explicación: localiza el botón visible que guarda/cierra el modal.
