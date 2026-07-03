# Localizadores - Flujo de compra

URL usada: http://testingyes.com/

## Nota
La URL indicada en la consigna (`http://www.testingyes.com/onlineshop/`) devuelve 404, pero la tienda está disponible desde la URL base.

## Home / Búsqueda

- Abrir modal de búsqueda:
  `page.getByRole('link', { name: /Product Search/i })`

  Explicación: localiza el enlace visible `Product Search`. En el DOM es un `<a>` con `data-bs-target="#searchModal"`, por eso abre el modal.

- Campo de búsqueda:
  `page.getByRole('searchbox', { name: 'Product Search' })`

  Explicación: sale del `<input type="search" aria-label="Product Search">`. Por `type="search"` tiene rol `searchbox`.

- Botón para ejecutar búsqueda:
  `page.getByRole('button', { name: 'Product Search' })`

  Explicación: el botón no tiene texto visible, pero tiene `aria-label="Product Search"`.

## Home / Producto seleccionado

- Producto Lime:
  `page.getByRole('link', { name: 'Lime' })`

  Explicación: localiza el título visible del producto. En el DOM está dentro de `<a href="...">Lime</a>`, y un `<a>` con `href` tiene rol implícito `link`.

- Imagen del producto Lime:
  `page.getByAltText('Lime')`

  Explicación: localiza la imagen por `alt="Lime"`. Es alternativa si se abre el detalle haciendo click en la imagen.

## Detalle del producto

- Título del producto:
  `page.getByRole('heading', { name: 'Lime' })`

  Explicación: valida que el detalle cargó el producto correcto usando el encabezado visible.

- Campo de cantidad:
  `page.locator('input[name="cart_quantity"]')`

  Explicación: localiza el input técnico de cantidad del carrito. Se usa CSS porque este campo normalmente no tiene label visible claro.

- Botón Add to Cart:
  `page.getByRole('button', { name: /Add To Cart|Add to Cart/i })`

  Explicación: localiza el botón visible para agregar el producto al carrito usando rol `button` y texto accesible.

## Carrito

- Abrir carrito:
  `page.locator('[aria-controls="offcanvasCart"]').last()`

  Explicación: localiza el control que abre el carrito lateral. Uso `.last()` porque el DOM tiene una versión mobile y otra desktop.

- Contador del carrito:
  `page.locator('.cart-count').last()`

  Explicación: localiza el contador de productos del carrito. Se usa CSS porque el valor está dentro de un `<span class="cart-count">`.

- Producto Lime dentro del carrito:
  `page.getByText('Lime')`

  Explicación: valida que el producto agregado aparece en el carrito por su texto visible.

- Ir al checkout:
  `page.getByRole('link', { name: /Checkout/i })`

  Explicación: localiza el enlace visible de checkout desde el carrito.

## Login / Checkout

- Abrir menú de cuenta:
  `page.locator('#navDropdownAccount')`

  Explicación: localiza el dropdown de cuenta por su `id`, porque el control principal usa ícono y no tiene texto visible estable.

- Link Log In:
  `page.getByRole('link', { name: /Log In/i })`

  Explicación: localiza el enlace visible para iniciar sesión dentro del menú de cuenta.

- Campo email:
  `page.locator('input[name="email_address"]')`

  Explicación: localiza el campo por el atributo `name`, usado por el formulario de login.

- Campo password:
  `page.locator('input[name="password"]')`

  Explicación: localiza el campo de contraseña por el atributo `name`.

- Botón Sign In:
  `page.getByRole('button', { name: /Sign In/i })`

  Explicación: localiza el botón visible para enviar el formulario de login.

- Botón Continue / Confirm Order:
  `page.getByRole('button', { name: /Continue|Confirm Order/i })`

  Explicación: localiza los botones principales del checkout usando texto visible, útil para avanzar entre pasos del flujo.
