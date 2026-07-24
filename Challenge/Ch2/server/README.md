# SUT QAXadmin — Mock API + UI para Entrenamiento E2E

Sistema completo bajo prueba (SUT) que combina una Mock API REST con una UI de panel administrativo CRM. Ideal para practicar automatización E2E con Playwright: validación de respuestas HTTP paginadas, status codes de CRUD, y consistencia entre datos de API y lo renderizado en la UI (tablas, KPI cards, gráficos).

## Levantar el SUT (un solo comando)

```bash
cd sut-admin
npm install    # solo la primera vez
npm start
```

Esto levanta:
- **UI**: http://localhost:4001 (login: `admin@qaxpert.com` / `admin123`)
- **Swagger**: http://localhost:4001/api-docs

Una sola terminal. El servidor Express sirve tanto la API como los archivos estáticos.

## Endpoints

| Método | Endpoint | Respuesta |
|--------|----------|-----------|
| `GET` | `/api/health` | `{ status: "ok" }` |
| **Usuarios** |
| `GET` | `/api/users?search=&role=&status=&page=&limit=` | Paginado `{ data, page, limit, total, totalPages }` |
| `GET` | `/api/users/:id` | Usuario individual |
| `POST` | `/api/users` | Crear `{ nombre, email, rol, estado }` → 201 |
| `PUT` | `/api/users/:id` | Actualizar → 200 |
| `DELETE` | `/api/users/:id` | Eliminar → 200 |
| **Productos** |
| `GET` | `/api/products?search=&category=&page=&limit=` | Paginado |
| `GET` | `/api/products/:id` | Producto individual |
| `POST` | `/api/products` | Crear `{ nombre, categoria, precio, stock }` |
| `PUT` | `/api/products/:id` | Actualizar |
| `DELETE` | `/api/products/:id` | Eliminar |
| **Órdenes** |
| `GET` | `/api/orders?search=&status=&page=&limit=` | Paginado |
| `GET` | `/api/orders/stats` | KPIs `{ totalOrdenes, ingresoTotal, pendientes, procesando, ... }` |
| `GET` | `/api/orders/:id` | Orden individual |
| `POST` | `/api/orders` | Crear `{ cliente, producto, total }` |
| `PUT` | `/api/orders/:id` | Actualizar estado `{ estado }` |
| `DELETE` | `/api/orders/:id` | Eliminar |

## Probar con curl

```bash
# Health
curl http://localhost:4001/api/health

# Usuarios paginados
curl "http://localhost:4001/api/users?page=1&limit=5" | jq

# Buscar usuario
curl "http://localhost:4001/api/users?search=laura" | jq

# Filtrar por rol
curl "http://localhost:4001/api/users?role=Vendedor&status=active" | jq

# Crear usuario
curl -X POST http://localhost:4001/api/users \
  -H "Content-Type: application/json" \
  -d '{"nombre":"QA User","email":"qa@test.com","rol":"Comprador","estado":"active"}' | jq

# Cambiar estado de orden
curl -X PUT http://localhost:4001/api/orders/ao5 \
  -H "Content-Type: application/json" \
  -d '{"estado":"Enviado"}' | jq

# Stats de órdenes
curl http://localhost:4001/api/orders/stats | jq

# Eliminar producto
curl -X DELETE http://localhost:4001/api/products/ap20
```

## Flujo de la UI

1. `index.html` → Login (`admin@qaxpert.com` / `admin123`)
2. `dashboard.html` → KPI cards + bar chart
3. `users.html` → Tabla CRUD con paginación, búsqueda, sort, modal crear/editar
4. `products.html` → Tabla CRUD con categorías
5. `orders.html` → Tabla con filtro por estado, cambio de estado vía select
6. `reports.html` → Gráficos CSS (bar, donut, line) + CSV export

## Ejemplo de test Playwright (API + UI)

```typescript
import { test, expect } from '@playwright/test';

const SUT = 'http://localhost:4001';

test('API: listar usuarios paginados y validar estructura', async ({ request }) => {
  const res = await request.get(`${SUT}/api/users?page=1&limit=5`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.data.length).toBeLessThanOrEqual(5);
  expect(body.totalPages).toBeGreaterThan(1);
  expect(body.data[0]).toHaveProperty('id');
  expect(body.data[0]).toHaveProperty('nombre');
  expect(body.data[0]).toHaveProperty('email');
  expect(body.data[0]).toHaveProperty('rol');
  expect(body.data[0]).toHaveProperty('estado');
});

test('API + UI: crear usuario y validar que aparece en la tabla', async ({ request, page }) => {
  // 1. Crear usuario vía API
  const res = await request.post(`${SUT}/api/users`, {
    data: { nombre: 'E2E Test', email: 'e2e@test.com', rol: 'Comprador', estado: 'active' }
  });
  expect(res.status()).toBe(201);
  const newUser = await res.json();

  // 2. Login en la UI
  await page.goto(SUT);
  await page.fill('#email', 'admin@qaxpert.com');
  await page.fill('#password', 'admin123');
  await page.click('button:has-text("Ingresar")');

  // 3. Navegar a Usuarios y buscar el nuevo
  await page.click('text=Usuarios');
  await page.fill('#searchUser', newUser.nombre);
  await expect(page.locator(`text=${newUser.email}`)).toBeVisible();
});

test('API: validar stats de órdenes', async ({ request }) => {
  const res = await request.get(`${SUT}/api/orders/stats`);
  expect(res.status()).toBe(200);
  const stats = await res.json();
  expect(stats.totalOrdenes).toBeGreaterThan(0);
  const sum = stats.pendientes + stats.procesando + stats.enviados + stats.entregados + stats.cancelados;
  expect(sum).toBe(stats.totalOrdenes);
});
```

## Estructura

```
sut-admin/
├── package.json        # express, cors, swagger-ui-express
├── server.js           # Mock API + servidor estático
├── README.md           # Este archivo
└── ui/                 # Archivos de la UI
    ├── index.html      # Login
    ├── dashboard.html  # KPI + gráficos
    ├── users.html      # CRUD usuarios
    ├── products.html   # CRUD productos
    ├── orders.html     # Gestión de órdenes
    ├── reports.html    # Reportes + CSV
    ├── css/style.css
    └── js/app.js       # Cliente que consume la API
```
