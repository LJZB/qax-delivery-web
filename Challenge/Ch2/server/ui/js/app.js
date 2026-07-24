// SUT QAXadmin — Modo API (fetch contra localhost:4001)
// Datos semilla como fallback. La API los sobrescribe al sincronizar.
// setAdminData envía automáticamente creates/updates/deletes a la API.

var API = '';
var estados = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];
var categorias = ['Celulares', 'Computación', 'Audio', 'Cámaras', 'Deportes', 'Muebles', 'Electrodomésticos', 'Moda', 'Tecnología', 'Electrónica'];

// Seed data — fallback instantáneo mientras la API responde
var DEFAULT_USERS = [
  { id: 'a1', nombre: 'Admin Principal', email: 'admin@qaxpert.com', rol: 'Admin', estado: 'active' },
  { id: 'a2', nombre: 'Carlos Martínez', email: 'carlos@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a3', nombre: 'María Gómez', email: 'maria@email.com', rol: 'Vendedor', estado: 'active' },
  { id: 'a4', nombre: 'Andrés López', email: 'andres@email.com', rol: 'Vendedor', estado: 'inactive' },
  { id: 'a5', nombre: 'Laura Torres', email: 'laura@email.com', rol: 'Comprador', estado: 'active' }
];
var DEFAULT_PRODUCTS = [
  { id: 'ap1', nombre: 'iPhone 14 Pro', categoria: 'Celulares', precio: 4300000, stock: 15 },
  { id: 'ap2', nombre: 'Samsung Galaxy S23', categoria: 'Celulares', precio: 2800000, stock: 22 },
  { id: 'ap3', nombre: 'MacBook Air M2', categoria: 'Computación', precio: 5200000, stock: 8 },
  { id: 'ap4', nombre: 'Sony WH-1000XM5', categoria: 'Audio', precio: 1200000, stock: 30 },
  { id: 'ap5', nombre: 'Canon EOS R10', categoria: 'Cámaras', precio: 3600000, stock: 5 }
];
var DEFAULT_ORDERS = [
  { id: 'ao1', cliente: 'Laura Torres', producto: 'Samsung Galaxy S23', total: 2800000, estado: 'Entregado', fecha: '2026-05-01' },
  { id: 'ao2', cliente: 'Diego Ramírez', producto: 'Mouse MX Master 3S', total: 760000, estado: 'Enviado', fecha: '2026-05-03' },
  { id: 'ao3', cliente: 'Sofía Herrera', producto: 'Nespresso Vertuo Next', total: 650000, estado: 'Entregado', fecha: '2026-04-28' },
  { id: 'ao4', cliente: 'Laura Torres', producto: 'Air Fryer Ninja 4L', total: 480000, estado: 'Procesando', fecha: '2026-05-08' },
  { id: 'ao5', cliente: 'Valentina Cruz', producto: 'iPhone 14 Pro', total: 4300000, estado: 'Pendiente', fecha: '2026-05-11' }
];

// Seed instantáneo (las páginas leen esto sincrónicamente)
if (!localStorage.getItem('qaxadmin_users')) localStorage.setItem('qaxadmin_users', JSON.stringify(DEFAULT_USERS));
if (!localStorage.getItem('qaxadmin_products')) localStorage.setItem('qaxadmin_products', JSON.stringify(DEFAULT_PRODUCTS));
if (!localStorage.getItem('qaxadmin_orders')) localStorage.setItem('qaxadmin_orders', JSON.stringify(DEFAULT_ORDERS));

async function apiGet(path) {
  var res = await fetch(API + path);
  if (!res.ok) throw new Error(path + ' → ' + res.status);
  return res.json();
}

async function apiPost(path, data) {
  var res = await fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(path + ' → ' + res.status);
  return res.json();
}

async function apiPut(path, data) {
  var res = await fetch(API + path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(path + ' → ' + res.status);
  return res.json();
}

async function apiDelete(path) {
  var res = await fetch(API + path, { method: 'DELETE' });
  if (!res.ok) throw new Error(path + ' → ' + res.status);
  return res.json();
}

// Sincroniza desde la API → localStorage
async function syncFromApi() {
  var usersRes = await apiGet('/api/users?limit=100');
  var productsRes = await apiGet('/api/products?limit=100');
  var ordersRes = await apiGet('/api/orders?limit=100');
  localStorage.setItem('qaxadmin_users', JSON.stringify(usersRes.data));
  localStorage.setItem('qaxadmin_products', JSON.stringify(productsRes.data));
  localStorage.setItem('qaxadmin_orders', JSON.stringify(ordersRes.data));
  return { users: usersRes.data, products: productsRes.data, orders: ordersRes.data };
}

// CRUD helpers
async function createUser(data) {
  var created = await apiPost('/api/users', data);
  var list = JSON.parse(localStorage.getItem('qaxadmin_users') || '[]');
  list.push(created);
  localStorage.setItem('qaxadmin_users', JSON.stringify(list));
  return created;
}

async function updateUser(id, data) {
  var updated = await apiPut('/api/users/' + id, data);
  var list = JSON.parse(localStorage.getItem('qaxadmin_users') || '[]');
  var idx = list.findIndex(function(u) { return u.id === id; });
  if (idx !== -1) list[idx] = updated;
  localStorage.setItem('qaxadmin_users', JSON.stringify(list));
  return updated;
}

async function deleteUser(id) {
  await apiDelete('/api/users/' + id);
  var list = JSON.parse(localStorage.getItem('qaxadmin_users') || '[]');
  list = list.filter(function(u) { return u.id !== id; });
  localStorage.setItem('qaxadmin_users', JSON.stringify(list));
}

async function createProduct(data) {
  var created = await apiPost('/api/products', data);
  var list = JSON.parse(localStorage.getItem('qaxadmin_products') || '[]');
  list.push(created);
  localStorage.setItem('qaxadmin_products', JSON.stringify(list));
  return created;
}

async function updateProduct(id, data) {
  var updated = await apiPut('/api/products/' + id, data);
  var list = JSON.parse(localStorage.getItem('qaxadmin_products') || '[]');
  var idx = list.findIndex(function(p) { return p.id === id; });
  if (idx !== -1) list[idx] = updated;
  localStorage.setItem('qaxadmin_products', JSON.stringify(list));
  return updated;
}

async function deleteProduct(id) {
  await apiDelete('/api/products/' + id);
  var list = JSON.parse(localStorage.getItem('qaxadmin_products') || '[]');
  list = list.filter(function(p) { return p.id !== id; });
  localStorage.setItem('qaxadmin_products', JSON.stringify(list));
}

async function createOrder(data) {
  var created = await apiPost('/api/orders', data);
  var list = JSON.parse(localStorage.getItem('qaxadmin_orders') || '[]');
  list.push(created);
  localStorage.setItem('qaxadmin_orders', JSON.stringify(list));
  return created;
}

async function updateOrder(id, data) {
  var updated = await apiPut('/api/orders/' + id, data);
  var list = JSON.parse(localStorage.getItem('qaxadmin_orders') || '[]');
  var idx = list.findIndex(function(o) { return o.id === id; });
  if (idx !== -1) list[idx] = updated;
  localStorage.setItem('qaxadmin_orders', JSON.stringify(list));
  return updated;
}

async function deleteOrder(id) {
  await apiDelete('/api/orders/' + id);
  var list = JSON.parse(localStorage.getItem('qaxadmin_orders') || '[]');
  list = list.filter(function(o) { return o.id !== id; });
  localStorage.setItem('qaxadmin_orders', JSON.stringify(list));
}

function getAdminData(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }

// setAdminData automáticamente sincroniza creates/updates/deletes con la API
var _origSet = function(key, data) { localStorage.setItem(key, JSON.stringify(data)); };

function setAdminData(key, data) {
  var old = getAdminData(key);
  _origSet(key, data);

  // Detectar cambios y llamar a la API (fire-and-forget)
  if (key === 'qaxadmin_users') {
    data.forEach(function(u) {
      var prev = old.find(function(o) { return o.id === u.id; });
      if (!prev) {
        apiPost('/api/users', { nombre: u.nombre, email: u.email, rol: u.rol, estado: u.estado }).catch(function(){});
      } else if (prev.nombre !== u.nombre || prev.email !== u.email || prev.rol !== u.rol || prev.estado !== u.estado) {
        apiPut('/api/users/' + u.id, u).catch(function(){});
      }
    });
    old.forEach(function(o) {
      if (!data.some(function(u) { return u.id === o.id; })) {
        apiDelete('/api/users/' + o.id).catch(function(){});
      }
    });
  } else if (key === 'qaxadmin_products') {
    data.forEach(function(p) {
      var prev = old.find(function(o) { return o.id === p.id; });
      if (!prev) {
        apiPost('/api/products', { nombre: p.nombre, categoria: p.categoria, precio: p.precio, stock: p.stock }).catch(function(){});
      } else if (prev.nombre !== p.nombre || prev.categoria !== p.categoria || prev.precio !== p.precio || prev.stock !== p.stock) {
        apiPut('/api/products/' + p.id, p).catch(function(){});
      }
    });
    old.forEach(function(p) {
      if (!data.some(function(o) { return o.id === p.id; })) {
        apiDelete('/api/products/' + p.id).catch(function(){});
      }
    });
  } else if (key === 'qaxadmin_orders') {
    data.forEach(function(o) {
      var prev = old.find(function(p) { return p.id === o.id; });
      if (!prev) {
        apiPost('/api/orders', { cliente: o.cliente, producto: o.producto, total: o.total }).catch(function(){});
      } else if (prev.estado !== o.estado) {
        apiPut('/api/orders/' + o.id, { estado: o.estado }).catch(function(){});
      }
    });
    old.forEach(function(o) {
      if (!data.some(function(p) { return p.id === o.id; })) {
        apiDelete('/api/orders/' + o.id).catch(function(){});
      }
    });
  }
}

function isLoggedIn() { return sessionStorage.getItem('qaxadmin_logged') === 'true'; }

function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

// Auto-sync al cargar — las páginas pueden esperar esta promesa
var _dataReady = syncFromApi().catch(function(e) { console.error('API init error:', e); });
