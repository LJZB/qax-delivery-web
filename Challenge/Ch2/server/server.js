const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const usuarios = [
  { id: 'a1', nombre: 'Admin Principal', email: 'admin@qaxpert.com', rol: 'Admin', estado: 'active' },
  { id: 'a2', nombre: 'Carlos Martínez', email: 'carlos@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a3', nombre: 'María Gómez', email: 'maria@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a4', nombre: 'Andrés López', email: 'andres@email.com', rol: 'Vendedor', estado: 'inactive' },
  { id: 'a5', nombre: 'Laura Torres', email: 'laura@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a6', nombre: 'Diego Ramírez', email: 'diego@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a7', nombre: 'Sofía Herrera', email: 'sofia@email.com', rol: 'Comprador', estado: 'inactive' },
  { id: 'a8', nombre: 'Fernando Ríos', email: 'fernando@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a9', nombre: 'Valentina Cruz', email: 'valentina@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a10', nombre: 'Javier Peña', email: 'javier@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a11', nombre: 'Camila Restrepo', email: 'camila@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a12', nombre: 'Sebastián Mora', email: 'sebastian@email.com', rol: 'Vendedor', estado: 'inactive' },
  { id: 'a13', nombre: 'Natalia Vargas', email: 'natalia@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a14', nombre: 'Mateo Cardona', email: 'mateo@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a15', nombre: 'Isabella Rojas', email: 'isabella@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a16', nombre: 'Samuel Duarte', email: 'samuel@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a17', nombre: 'Daniela Castro', email: 'daniela@email.com', rol: 'Vendedor', estado: 'inactive' },
  { id: 'a18', nombre: 'Emilio Zuluaga', email: 'emilio@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a19', nombre: 'Lucía Mejía', email: 'lucia@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a20', nombre: 'Tomás Henao', email: 'tomas@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a21', nombre: 'Gabriela Uribe', email: 'gabriela@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a22', nombre: 'Santiago Ospina', email: 'santiago@email.com', rol: 'Comprador', estado: 'inactive' },
  { id: 'a23', nombre: 'Antonia Betancur', email: 'antonia@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a24', nombre: 'Nicolás Giraldo', email: 'nicolas@email.com', rol: 'Comprador', estado: 'active' },
  { id: 'a25', nombre: 'Mariana Echeverri', email: 'mariana@email.com', rol: 'Vendedor', estado: 'active' }
];

const productos = [
  { id: 'ap1', nombre: 'iPhone 14 Pro', categoria: 'Celulares', precio: 4300000, stock: 15 },
  { id: 'ap2', nombre: 'Samsung Galaxy S23', categoria: 'Celulares', precio: 2800000, stock: 22 },
  { id: 'ap3', nombre: 'MacBook Air M2', categoria: 'Computación', precio: 5200000, stock: 8 },
  { id: 'ap4', nombre: 'Sony WH-1000XM5', categoria: 'Audio', precio: 1200000, stock: 30 },
  { id: 'ap5', nombre: 'Canon EOS R10', categoria: 'Cámaras', precio: 3600000, stock: 5 },
  { id: 'ap6', nombre: 'Bicicleta Trek Marlin 7', categoria: 'Deportes', precio: 2800000, stock: 10 },
  { id: 'ap7', nombre: 'Silla Gamer Corsair T3', categoria: 'Muebles', precio: 1500000, stock: 18 },
  { id: 'ap8', nombre: 'Monitor Dell 27" 4K', categoria: 'Computación', precio: 1900000, stock: 7 },
  { id: 'ap9', nombre: 'Nespresso Vertuo Next', categoria: 'Electrodomésticos', precio: 650000, stock: 25 },
  { id: 'ap10', nombre: 'Roomba j7', categoria: 'Electrodomésticos', precio: 2200000, stock: 12 },
  { id: 'ap11', nombre: 'Air Fryer Ninja 4L', categoria: 'Electrodomésticos', precio: 480000, stock: 40 },
  { id: 'ap12', nombre: 'Nike Air Max 270', categoria: 'Moda', precio: 520000, stock: 35 },
  { id: 'ap13', nombre: 'Apple Watch Series 9', categoria: 'Tecnología', precio: 2100000, stock: 14 },
  { id: 'ap14', nombre: 'Teclado Keychron K8', categoria: 'Computación', precio: 450000, stock: 20 },
  { id: 'ap15', nombre: 'Mouse MX Master 3S', categoria: 'Computación', precio: 380000, stock: 28 },
  { id: 'ap16', nombre: 'iPad Air 2024', categoria: 'Computación', precio: 3100000, stock: 9 },
  { id: 'ap17', nombre: 'Cafetera Espresso', categoria: 'Electrodomésticos', precio: 850000, stock: 16 },
  { id: 'ap18', nombre: 'Zapatillas Adidas Ultraboost', categoria: 'Moda', precio: 480000, stock: 22 },
  { id: 'ap19', nombre: 'Smart TV Samsung 55"', categoria: 'Electrónica', precio: 2400000, stock: 11 },
  { id: 'ap20', nombre: 'Router WiFi 6 TP-Link', categoria: 'Computación', precio: 320000, stock: 45 }
];

const ordenes = [
  { id: 'ao1', cliente: 'Laura Torres', producto: 'Samsung Galaxy S23', total: 2800000, estado: 'Entregado', fecha: '2026-05-01' },
  { id: 'ao2', cliente: 'Diego Ramírez', producto: 'Mouse MX Master 3S', total: 760000, estado: 'Enviado', fecha: '2026-05-03' },
  { id: 'ao3', cliente: 'Sofía Herrera', producto: 'Nespresso Vertuo Next', total: 650000, estado: 'Entregado', fecha: '2026-04-28' },
  { id: 'ao4', cliente: 'Laura Torres', producto: 'Air Fryer Ninja 4L', total: 480000, estado: 'Procesando', fecha: '2026-05-08' },
  { id: 'ao5', cliente: 'Valentina Cruz', producto: 'iPhone 14 Pro', total: 4300000, estado: 'Pendiente', fecha: '2026-05-11' },
  { id: 'ao6', cliente: 'Santiago Ospina', producto: 'Teclado Keychron K8', total: 450000, estado: 'Cancelado', fecha: '2026-05-02' },
  { id: 'ao7', cliente: 'Camila Restrepo', producto: 'MacBook Air M2', total: 5200000, estado: 'Procesando', fecha: '2026-05-10' },
  { id: 'ao8', cliente: 'Natalia Vargas', producto: 'Nike Air Max 270', total: 520000, estado: 'Entregado', fecha: '2026-04-25' },
  { id: 'ao9', cliente: 'Mateo Cardona', producto: 'Sony WH-1000XM5', total: 1200000, estado: 'Enviado', fecha: '2026-05-09' },
  { id: 'ao10', cliente: 'Diego Ramírez', producto: 'Silla Gamer Corsair T3', total: 1500000, estado: 'Pendiente', fecha: '2026-05-12' },
  { id: 'ao11', cliente: 'Lucía Mejía', producto: 'Roomba j7', total: 2200000, estado: 'Entregado', fecha: '2026-04-20' },
  { id: 'ao12', cliente: 'Tomás Henao', producto: 'Apple Watch Series 9', total: 2100000, estado: 'Procesando', fecha: '2026-05-11' },
  { id: 'ao13', cliente: 'Gabriela Uribe', producto: 'iPad Air 2024', total: 3100000, estado: 'Enviado', fecha: '2026-05-10' },
  { id: 'ao14', cliente: 'Nicolás Giraldo', producto: 'Canon EOS R10', total: 3600000, estado: 'Pendiente', fecha: '2026-05-12' },
  { id: 'ao15', cliente: 'Mariana Echeverri', producto: 'Smart TV Samsung 55"', total: 2400000, estado: 'Entregado', fecha: '2026-04-18' },
  { id: 'ao16', cliente: 'Valentina Cruz', producto: 'Cafetera Espresso', total: 850000, estado: 'Cancelado', fecha: '2026-04-30' },
  { id: 'ao17', cliente: 'Sofía Herrera', producto: 'Monitor Dell 27" 4K', total: 1900000, estado: 'Enviado', fecha: '2026-05-07' },
  { id: 'ao18', cliente: 'Laura Torres', producto: 'Bicicleta Trek Marlin 7', total: 2800000, estado: 'Procesando', fecha: '2026-05-09' },
  { id: 'ao19', cliente: 'Tomás Henao', producto: 'Air Fryer Ninja 4L', total: 480000, estado: 'Entregado', fecha: '2026-04-22' },
  { id: 'ao20', cliente: 'Mateo Cardona', producto: 'iPhone 14 Pro', total: 4300000, estado: 'Pendiente', fecha: '2026-05-11' },
  { id: 'ao21', cliente: 'Camila Restrepo', producto: 'Zapatillas Adidas Ultraboost', total: 480000, estado: 'Entregado', fecha: '2026-04-15' },
  { id: 'ao22', cliente: 'Diego Ramírez', producto: 'Sony WH-1000XM5', total: 1200000, estado: 'Enviado', fecha: '2026-05-08' },
  { id: 'ao23', cliente: 'Natalia Vargas', producto: 'iPad Air 2024', total: 3100000, estado: 'Procesando', fecha: '2026-05-10' },
  { id: 'ao24', cliente: 'Santiago Ospina', producto: 'Router WiFi 6', total: 320000, estado: 'Cancelado', fecha: '2026-05-03' },
  { id: 'ao25', cliente: 'Laura Torres', producto: 'Cafetera Espresso', total: 850000, estado: 'Pendiente', fecha: '2026-05-12' },
  { id: 'ao26', cliente: 'Nicolás Giraldo', producto: 'MacBook Air M2', total: 5200000, estado: 'Enviado', fecha: '2026-05-06' },
  { id: 'ao27', cliente: 'Valentina Cruz', producto: 'Teclado Keychron K8', total: 450000, estado: 'Entregado', fecha: '2026-04-12' },
  { id: 'ao28', cliente: 'Tomás Henao', producto: 'Bicicleta Trek Marlin 7', total: 2800000, estado: 'Procesando', fecha: '2026-05-09' },
  { id: 'ao29', cliente: 'Gabriela Uribe', producto: 'Samsung Galaxy S23', total: 2800000, estado: 'Enviado', fecha: '2026-05-05' },
  { id: 'ao30', cliente: 'Mariana Echeverri', producto: 'Apple Watch Series 9', total: 2100000, estado: 'Pendiente', fecha: '2026-05-12' }
];

function paginate(list, page, limit) {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const start = (page - 1) * limit;
  return { data: list.slice(start, start + limit), page, limit, total: list.length, totalPages: Math.ceil(list.length / limit) };
}

function filterBy(list, query, fields) {
  if (!query) return list;
  const q = query.toLowerCase();
  return list.filter(item => fields.some(f => String(item[f]).toLowerCase().includes(q)));
}

// ─── Swagger ───
const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'SUT QAXadmin API', version: '1.0.0', description: 'Mock API para entrenamiento E2E — CRUD completo de usuarios, productos y órdenes con paginación. Explorá todos los endpoints en esta interfaz interactiva.' },
  servers: [{ url: 'http://localhost:4001', description: 'SUT local' }],
  tags: [
    { name: 'Health', description: 'Verificación' },
    { name: 'Users', description: 'CRUD de usuarios' },
    { name: 'Products', description: 'CRUD de productos' },
    { name: 'Orders', description: 'CRUD de órdenes + stats' }
  ],
  paths: {
    '/api/health': { get: { tags: ['Health'], summary: 'Health check', responses: { '200': { description: 'OK' } } } },
    '/api/users': {
      get: {
        tags: ['Users'], summary: 'Listar usuarios (paginado, búsqueda, filtros)',
        parameters: [
          { name: 'search', in: 'query', description: 'Buscar por nombre o email' },
          { name: 'role', in: 'query', description: 'Admin / Vendedor / Comprador' },
          { name: 'status', in: 'query', description: 'active / inactive' },
          { name: 'page', in: 'query', example: 1 },
          { name: 'limit', in: 'query', example: 10 }
        ],
        responses: { '200': { description: 'Paginated users' } }
      },
      post: { tags: ['Users'], summary: 'Crear usuario', requestBody: { content: { 'application/json': { example: { nombre: 'Nuevo', email: 'nuevo@test.com', rol: 'Comprador', estado: 'active' } } } }, responses: { '201': { description: 'Creado' }, '400': { description: 'Faltan campos' } } }
    },
    '/api/users/{id}': {
      get: { tags: ['Users'], summary: 'Obtener usuario', parameters: [{ name: 'id', in: 'path', required: true, example: 'a1' }], responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } } },
      put: { tags: ['Users'], summary: 'Actualizar usuario', parameters: [{ name: 'id', in: 'path', required: true, example: 'a1' }], requestBody: { content: { 'application/json': { example: { nombre: 'Actualizado', rol: 'Vendedor' } } } }, responses: { '200': { description: 'Actualizado' } } },
      delete: { tags: ['Users'], summary: 'Eliminar usuario', parameters: [{ name: 'id', in: 'path', required: true, example: 'a1' }], responses: { '200': { description: 'Eliminado' } } }
    },
    '/api/products': {
      get: { tags: ['Products'], summary: 'Listar productos (paginado, búsqueda, categoria)', parameters: [{ name: 'search', in: 'query' }, { name: 'category', in: 'query' }, { name: 'page', in: 'query' }, { name: 'limit', in: 'query' }], responses: { '200': { description: 'OK' } } },
      post: { tags: ['Products'], summary: 'Crear producto', requestBody: { content: { 'application/json': { example: { nombre: 'Nuevo', categoria: 'Electrónica', precio: 500000, stock: 20 } } } }, responses: { '201': { description: 'Creado' } } }
    },
    '/api/products/{id}': {
      get: { tags: ['Products'], summary: 'Obtener producto', parameters: [{ name: 'id', in: 'path', required: true, example: 'ap1' }], responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } } },
      put: { tags: ['Products'], summary: 'Actualizar producto', parameters: [{ name: 'id', in: 'path', required: true, example: 'ap1' }], requestBody: { content: { 'application/json': { example: { stock: 50 } } } }, responses: { '200': { description: 'Actualizado' } } },
      delete: { tags: ['Products'], summary: 'Eliminar producto', parameters: [{ name: 'id', in: 'path', required: true, example: 'ap1' }], responses: { '200': { description: 'Eliminado' } } }
    },
    '/api/orders': {
      get: { tags: ['Orders'], summary: 'Listar órdenes (paginado, búsqueda, filtro por estado)', parameters: [{ name: 'search', in: 'query' }, { name: 'status', in: 'query', description: 'Pendiente/Procesando/Enviado/Entregado/Cancelado' }, { name: 'page', in: 'query' }, { name: 'limit', in: 'query' }], responses: { '200': { description: 'OK' } } },
      post: { tags: ['Orders'], summary: 'Crear orden', requestBody: { content: { 'application/json': { example: { cliente: 'Juan', producto: 'iPhone', total: 4300000 } } } }, responses: { '201': { description: 'Creada' } } }
    },
    '/api/orders/stats': { get: { tags: ['Orders'], summary: 'KPIs de órdenes', responses: { '200': { description: 'Stats', content: { 'application/json': { example: { totalOrdenes: 30, ingresoTotal: 67800000, pendientes: 6, procesando: 5, enviados: 7, entregados: 9, cancelados: 3 } } } } } } },
    '/api/orders/{id}': {
      get: { tags: ['Orders'], summary: 'Obtener orden', parameters: [{ name: 'id', in: 'path', required: true, example: 'ao1' }], responses: { '200': { description: 'OK' }, '404': { description: 'No encontrada' } } },
      put: { tags: ['Orders'], summary: 'Actualizar orden (estado)', parameters: [{ name: 'id', in: 'path', required: true, example: 'ao1' }], requestBody: { content: { 'application/json': { example: { estado: 'Enviado' } } } }, responses: { '200': { description: 'Actualizada' } } },
      delete: { tags: ['Orders'], summary: 'Eliminar orden', parameters: [{ name: 'id', in: 'path', required: true, example: 'ao1' }], responses: { '200': { description: 'Eliminada' } } }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ─── API Routes ───

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Users
app.get('/api/users', (req, res) => {
  const { search, role, status: estado, page, limit } = req.query;
  let result = [...usuarios];
  if (role) result = result.filter(u => u.rol === role);
  if (estado) result = result.filter(u => u.estado === estado);
  result = filterBy(result, search, ['nombre', 'email']);
  res.json(paginate(result, page, limit));
});
app.get('/api/users/:id', (req, res) => {
  const user = usuarios.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});
app.post('/api/users', (req, res) => {
  const { nombre, email, rol, estado } = req.body;
  if (!nombre || !email) return res.status(400).json({ error: 'nombre y email son requeridos' });
  const u = { id: 'a' + (usuarios.length + 1), nombre, email, rol: rol || 'Comprador', estado: estado || 'active' };
  usuarios.push(u);
  res.status(201).json(u);
});
app.put('/api/users/:id', (req, res) => {
  const idx = usuarios.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
  usuarios[idx] = { ...usuarios[idx], ...req.body, id: usuarios[idx].id };
  res.json(usuarios[idx]);
});
app.delete('/api/users/:id', (req, res) => {
  const idx = usuarios.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
  usuarios.splice(idx, 1);
  res.json({ deleted: true });
});

// Products
app.get('/api/products', (req, res) => {
  const { search, category, page, limit } = req.query;
  let result = [...productos];
  if (category) result = result.filter(p => p.categoria === category);
  result = filterBy(result, search, ['nombre', 'categoria']);
  res.json(paginate(result, page, limit));
});
app.get('/api/products/:id', (req, res) => {
  const prod = productos.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(prod);
});
app.post('/api/products', (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;
  if (!nombre || !categoria) return res.status(400).json({ error: 'nombre y categoria son requeridos' });
  const p = { id: 'ap' + (productos.length + 1), nombre, categoria, precio: precio || 0, stock: stock || 0 };
  productos.push(p);
  res.status(201).json(p);
});
app.put('/api/products/:id', (req, res) => {
  const idx = productos.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  productos[idx] = { ...productos[idx], ...req.body, id: productos[idx].id };
  res.json(productos[idx]);
});
app.delete('/api/products/:id', (req, res) => {
  const idx = productos.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  productos.splice(idx, 1);
  res.json({ deleted: true });
});

// Orders
app.get('/api/orders', (req, res) => {
  const { search, status: estado, page, limit } = req.query;
  let result = [...ordenes];
  if (estado) result = result.filter(o => o.estado === estado);
  result = filterBy(result, search, ['cliente', 'producto', 'id']);
  res.json(paginate(result, page, limit));
});
app.get('/api/orders/stats', (req, res) => {
  const total = ordenes.reduce((sum, o) => sum + o.total, 0);
  const byStatus = {};
  ordenes.forEach(o => { byStatus[o.estado] = (byStatus[o.estado] || 0) + 1; });
  res.json({
    totalOrdenes: ordenes.length, ingresoTotal: total,
    pendientes: byStatus['Pendiente'] || 0, procesando: byStatus['Procesando'] || 0,
    enviados: byStatus['Enviado'] || 0, entregados: byStatus['Entregado'] || 0, cancelados: byStatus['Cancelado'] || 0
  });
});
app.get('/api/orders/:id', (req, res) => {
  const order = ordenes.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
  res.json(order);
});
app.post('/api/orders', (req, res) => {
  const { cliente, producto, total } = req.body;
  if (!cliente || !producto) return res.status(400).json({ error: 'cliente y producto son requeridos' });
  const o = { id: 'ao' + (ordenes.length + 1), cliente, producto, total: total || 0, estado: 'Pendiente', fecha: new Date().toISOString().split('T')[0] };
  ordenes.push(o);
  res.status(201).json(o);
});
app.put('/api/orders/:id', (req, res) => {
  const idx = ordenes.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Orden no encontrada' });
  ordenes[idx] = { ...ordenes[idx], ...req.body, id: ordenes[idx].id };
  res.json(ordenes[idx]);
});
app.delete('/api/orders/:id', (req, res) => {
  const idx = ordenes.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Orden no encontrada' });
  ordenes.splice(idx, 1);
  res.json({ deleted: true });
});

// ─── Serve UI static files ───
app.use(express.static(path.join(__dirname, 'ui')));

app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   SUT QAXadmin — Mock API + UI           ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  UI:      http://localhost:' + PORT + '           ║');
  console.log('║  Swagger: http://localhost:' + PORT + '/api-docs  ║');
  console.log('╚══════════════════════════════════════════╝');
});
