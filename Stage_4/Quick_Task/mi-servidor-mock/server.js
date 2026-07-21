import express from "express";
const app = express();

app.use(express.json());

// Datos almacenados temporalmente en memoria.
let users = [
  { id: 1, nombre: "Ana", email: "ana@test.com" },
  { id: 2, nombre: "Carlos", email: "carlos@test.com" },
];

// Devuelve todos los usuarios.
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Devuelve un usuario según su ID.
app.get("/api/users/:id", (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));

  if (user) {
    res.json(user);
    return;
  }

  res.status(404).json({ error: "Usuario no encontrado" });
});

// Crea un usuario nuevo.
app.post("/api/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    nombre: req.body.nombre,
    email: req.body.email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// Elimina un usuario según su ID.
app.delete("/api/users/:id", (req, res) => {
  users = users.filter((user) => user.id !== Number(req.params.id));
  res.json({ message: "Usuario eliminado" });
});

// Bloque de datos de productos:
// Mantiene productos iniciales en memoria para consultar y modificar durante la práctica.
let products = [
  { id: 1, nombre: "Laptop", precio: 2500000, categoria: "tecnologia" },
  { id: 2, nombre: "Mouse", precio: 50000, categoria: "tecnologia" },
];

// Bloque de consulta de productos:
// Devuelve todos los productos disponibles actualmente en memoria.
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Bloque de creación de productos:
// Asigna un ID al contenido JSON recibido y devuelve el nuevo recurso con estado 201.
app.post("/api/products", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Bloque de eliminación de productos:
// Excluye de la colección el producto cuyo ID llega como parámetro de la ruta.
app.delete("/api/products/:id", (req, res) => {
  products = products.filter(
    (product) => product.id !== Number(req.params.id),
  );

  res.json({ message: "Producto eliminado" });
});

// Bloque de datos de órdenes:
// Inicia una colección vacía que vivirá solamente mientras el servidor esté activo.
let orders = [];

// Bloque de consulta de órdenes:
// Devuelve todas las órdenes creadas durante la ejecución actual.
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Bloque de creación de órdenes:
// Completa el recurso recibido con un ID, la fecha actual y el estado inicial pendiente.
app.post("/api/orders", (req, res) => {
  const newOrder = {
    id: orders.length + 1,
    ...req.body,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Bloque de actualización de órdenes:
// Modifica la orden existente con el JSON recibido o responde 404 cuando el ID no existe.
app.put("/api/orders/:id", (req, res) => {
  const order = orders.find((item) => item.id === Number(req.params.id));

  if (order) {
    Object.assign(order, req.body);
    res.json(order);
    return;
  }

  res.status(404).json({ error: "Orden no encontrada" });
});

// Inicia el servidor local en el puerto 4001.
app.listen(4001, () => {
  console.log("Servidor corriendo en http://localhost:4001");
});
