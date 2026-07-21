# Servidor mock local

Este proyecto crea una API REST local con Node.js y Express. Los datos se guardan temporalmente en memoria y se reinician cada vez que se detiene y vuelve a iniciar el servidor.

## Creación del servidor

Desde la carpeta donde se quiere crear el proyecto:

```bash
mkdir mi-servidor-mock
cd mi-servidor-mock
pnpm init
pnpm add express
touch server.js
```

- `mkdir mi-servidor-mock` crea la carpeta del proyecto.
- `cd mi-servidor-mock` entra en la carpeta.
- `pnpm init` crea el archivo `package.json`.
- `pnpm add express` instala Express.
- `touch server.js` crea el archivo del servidor.

El proyecto utiliza ES Modules mediante `"type": "module"` en `package.json`, por lo que Express se importa así:

```js
import express from 'express';
```

## Ejecución

Dentro de `mi-servidor-mock`, iniciar el servidor con:

```bash
node server.js
```

Cuando inicia correctamente, la terminal muestra:

```text
Servidor corriendo en http://localhost:4001
```

La terminal debe permanecer abierta mientras se utiliza la API. Para detener el servidor, presionar `Ctrl + C`.

## Datos disponibles

Al iniciar el servidor se crean estos usuarios:

```json
[
  { "id": 1, "nombre": "Ana", "email": "ana@test.com" },
  { "id": 2, "nombre": "Carlos", "email": "carlos@test.com" }
]
```

Se pueden consultar en el navegador o mediante una herramienta para API:

```text
http://localhost:4001/api/users
```

También se crean estos productos:

```json
[
  { "id": 1, "nombre": "Laptop", "precio": 2500000, "categoria": "tecnologia" },
  { "id": 2, "nombre": "Mouse", "precio": 50000, "categoria": "tecnologia" }
]
```

Las órdenes comienzan como una lista vacía y se agregan mediante `POST /api/orders`.

## Endpoints

| Método | Ruta | Función |
| --- | --- | --- |
| `GET` | `/api/users` | Devuelve todos los usuarios. |
| `GET` | `/api/users/:id` | Devuelve el usuario correspondiente al ID. |
| `POST` | `/api/users` | Crea un usuario con `nombre` y `email`. |
| `DELETE` | `/api/users/:id` | Elimina el usuario correspondiente al ID. |
| `GET` | `/api/products` | Devuelve todos los productos. |
| `POST` | `/api/products` | Crea un producto nuevo. |
| `DELETE` | `/api/products/:id` | Elimina el producto correspondiente al ID. |
| `GET` | `/api/orders` | Devuelve todas las órdenes. |
| `POST` | `/api/orders` | Crea una orden con fecha y estado pendiente. |
| `PUT` | `/api/orders/:id` | Actualiza una orden existente. |

Ejemplo del cuerpo para crear un usuario:

```json
{
  "nombre": "María",
  "email": "maria@test.com"
}
```

Con el servidor activo, la petición se puede enviar desde otra terminal Git Bash:

```bash
curl -X POST http://localhost:4001/api/users \
  -H "Content-Type: application/json" \
  -d '{"nombre":"María","email":"maria@test.com"}'
```

- `curl` envía la petición HTTP.
- `-X POST` selecciona el método utilizado para crear el usuario.
- La URL identifica el endpoint del servidor local.
- `-H "Content-Type: application/json"` informa que el cuerpo contiene JSON.
- `-d` incluye los datos que se enviarán.

La respuesta esperada es el usuario creado con su ID:

```json
{
  "id": 3,
  "nombre": "María",
  "email": "maria@test.com"
}
```

Después de crearlo, se puede consultar nuevamente la lista completa:

```bash
curl http://localhost:4001/api/users
```

Los usuarios creados o eliminados durante una ejecución no se conservan después de reiniciar el servidor.
