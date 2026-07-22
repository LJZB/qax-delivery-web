# Quick Task Stage 4: Codegen, servidor mock y Postman

Este Quick Task aplica los conceptos del Warmup mediante dos partes: la grabación y refactorización de un flujo real con Playwright Codegen, y la construcción de un servidor mock documentado con una colección de Postman.

## Estructura

```text
Quick_Task/
├── mercado-libre.spec.ts
├── playwright.config.ts
├── save-auth.mjs
├── tsconfig.json
├── utils/
│   └── dataGenerator.ts
└── mi-servidor-mock/
    ├── evidencias/
    ├── mi-servidor-mock.postman_collection.json
    ├── package.json
    ├── pnpm-lock.yaml
    ├── README.md
    └── server.js
```

## Parte 1: Playwright Codegen con Mercado Libre

### Flujo realizado

1. Abrir Mercado Libre Colombia.
2. Buscar `play station 5`.
3. Seleccionar `Consola PlayStation 5 Pro 2TB SSD`.
4. Iniciar el proceso de compra.
5. Avanzar por las pantallas de entrega.
6. Verificar la pantalla `Elige cómo pagar`.
7. Detener la prueba sin seleccionar un medio de pago ni confirmar una compra.

### Grabación inicial con Codegen

Desde la raíz del repositorio:

```bash
pnpm exec playwright codegen https://mercadolibre.com
```

El código generado se revisó antes de guardarlo. Se eliminaron pasos duplicados, interacciones del CAPTCHA y localizadores dinámicos de sus `iframe`.

### Datos dinámicos

`utils/dataGenerator.ts` genera un nombre y un correo únicos por ejecución. El test adjunta estos datos al reporte de Playwright para identificar la corrida sin reutilizar valores fijos.

### Autenticación local

Mercado Libre requiere una cuenta autenticada para llegar al checkout. La cuenta utilizada tiene 2FA y llave de seguridad, por lo que las credenciales y los códigos no se automatizan.

Para guardar una sesión local:

```bash
pnpm run auth:stage4
```

1. Completar manualmente el login y el 2FA en el navegador.
2. Volver a la terminal y presionar `Enter`.
3. La sesión se guarda en `.auth/mercadolibre.json`.

El directorio `.auth/` está excluido de Git porque contiene cookies y tokens sensibles. La sesión puede expirar y debe regenerarse cuando Mercado Libre vuelva a solicitarla.

### Ejecución del test

```bash
pnpm run test:stage4 --headed
```

La ejecución debe ser visible porque Mercado Libre puede solicitar autenticación reforzada durante el checkout. Cuando Playwright Inspector pause el test:

1. Completar manualmente el login, 2FA o llave de seguridad.
2. Pulsar **Resume** en Playwright Inspector.
3. Permitir que el test continúe hasta verificar la pantalla de pagos.

### Problemas encontrados en Mercado Libre

- El sitio presentó un CAPTCHA durante la grabación con Codegen.
- El CAPTCHA solicitó varias verificaciones manuales y nunca se automatizó.
- Codegen registró los intentos del CAPTCHA con nombres de `iframe` e IDs dinámicos; esos pasos se eliminaron por ser frágiles y por tratarse de un control de seguridad.
- El login se pausó durante la grabación para evitar registrar credenciales y códigos sensibles.
- `storageState` permitió reutilizar parte de la sesión, pero el checkout solicitó autenticación reforzada nuevamente.
- La solicitud de login apareció en diferentes puntos del checkout. El test espera tanto el siguiente paso como la pantalla de autenticación para evitar condiciones de carrera.
- La prueba requiere intervención manual cuando aparece la autenticación y no pretende ejecutarse sin supervisión en CI/CD.

### Verificación de TypeScript

```bash
pnpm run typecheck:stage4
```

La configuración de `tsconfig.json` utiliza resolución `Bundler`, compatible con los imports TypeScript que carga Playwright.

## Parte 2: servidor mock

El servidor local está construido con Node.js y Express y funciona en:

```text
http://localhost:4001
```

### Instalación

```bash
cd Stage_4/Quick_Task/mi-servidor-mock
pnpm install
```

### Ejecución

```bash
node server.js
```

La terminal debe permanecer abierta. Para detener el servidor se utiliza `Ctrl + C`.

### Servicios disponibles

#### Users

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `DELETE /api/users/:id`

#### Products

- `GET /api/products`
- `POST /api/products`
- `DELETE /api/products/:id`

#### Orders

- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id`

Los datos se almacenan en memoria. Al reiniciar el servidor se restauran los usuarios y productos iniciales, mientras que las órdenes vuelven a una lista vacía.

## Colección de Postman

El archivo `mi-servidor-mock/mi-servidor-mock.postman_collection.json` utiliza el formato Collection v2.1 e incluye:

- Carpeta `Users` con cinco peticiones, incluida una respuesta 404.
- Carpeta `Products` con tres peticiones.
- Carpeta `Orders` con tres peticiones.
- Variable `baseUrl` con el valor `http://localhost:4001`.
- Scripts que guardan los IDs creados para reutilizarlos en DELETE y PUT.

Para utilizarla:

1. Iniciar el servidor local.
2. Abrir Postman.
3. Importar `mi-servidor-mock.postman_collection.json`.
4. Ejecutar las peticiones en el orden mostrado dentro de cada carpeta.

## Evidencias

La carpeta `mi-servidor-mock/evidencias/` contiene 11 capturas que muestran:

- Método y URL de cada petición.
- Body JSON en POST y PUT.
- Respuesta JSON.
- Estados `200 OK`, `201 Created` y `404 Not Found`.

## Validaciones realizadas

- `pnpm run typecheck:stage4`: aprobado.
- `pnpm run test:stage4 --headed`: un test aprobado.
- `node --check Stage_4/Quick_Task/mi-servidor-mock/server.js`: aprobado.
- Endpoints de users, products y orders: verificados en Postman.
- Flujo de Mercado Libre: verificado hasta pagos sin confirmar una compra.
