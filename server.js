// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Se asume que el frontend (HTML, CSS, JS, inventory.json) se encuentra en la carpeta "public"
// Rutas para la API
// 1. Obtener el inventario (GET /api/inventory)
app.get("/api/inventory", (req, res) => {
  const inventoryPath = path.join(__dirname, "public", "inventory.json");
  fs.readFile(inventoryPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el inventario:", err);
      return res.status(500).json({ error: "No se pudo leer el inventario" });
    }
    try {
      const inventory = JSON.parse(data);
      res.json(inventory);
    } catch (parseErr) {
      console.error("Error al parsear el inventario:", parseErr);
      res.status(500).json({ error: "Error interno al procesar el inventario" });
    }
  });
});
// 2. Actualizar un producto del inventario (PUT /api/inventory/:id)
// Se espera que el cuerpo de la petición incluya, por ejemplo, { quantity: 20 }
app.put("/api/inventory/:id", (req, res) => {
  // Nota: En un entorno real se debería realizar autenticación y verificación de rol (administrador)
  const productId = parseInt(req.params.id, 10);
  const { quantity } = req.body;
  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({ error: "La cantidad es requerida y debe ser un número" });
  }
  const inventoryPath = path.join(__dirname, "public", "inventory.json");
  fs.readFile(inventoryPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el inventario:", err);
      return res.status(500).json({ error: "No se pudo leer el inventario" });
    }
    try {
      const inventory = JSON.parse(data);
      const productIndex = inventory.findIndex(prod => prod.id === productId);
      if (productIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      // Actualizar la cantidad y actualizar el estado del producto
      inventory[productIndex].quantity = quantity;
      inventory[productIndex].status = quantity > 0 ? "available" : "out_of_stock";
      // Guardar el inventario actualizado
      fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2), "utf8", writeErr => {
        if (writeErr) {
          console.error("Error al actualizar el inventario:", writeErr);
          return res.status(500).json({ error: "Error al actualizar el inventario" });
        }
        res.json({ message: "Inventario actualizado exitosamente", product: inventory[productIndex] });
      });
    } catch (parseErr) {
      console.error("Error al procesar el inventario:", parseErr);
      res.status(500).json({ error: "Error interno al procesar el inventario" });
    }
  });
});
// 3. Login de Administrador y Cliente (POST /api/login)
// Se reciben en el body { role: "admin" o "cliente", username, password } o { role: "cliente", nombre, email }
app.post("/api/login", (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ error: "El rol es requerido (admin o cliente)" });
  }
  if (role === "admin") {
    const { username, password } = req.body;
    // Credenciales fake para administrador
    if (username === "admin" && password === "admin123") {
      return res.json({ message: "Administrador autenticado exitosamente", role });
    } else {
      return res.status(401).json({ error: "Credenciales inválidas para administrador" });
    }
  } else if (role === "cliente") {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ error: "Se requieren nombre y email para el cliente" });
    }
    // Se simula la actualización de datos en una 'base de datos' (archivo clients.json)
    const clientsPath = path.join(__dirname, "clients.json");
    // Leer clientes existentes o inicializar un arreglo
    fs.readFile(clientsPath, "utf8", (err, data) => {
      let clients = [];
      if (!err) {
        try {
          clients = JSON.parse(data);
        } catch (parseErr) {
          console.error("Error al parsear clients.json:", parseErr);
        }
      }
      // Verificar si el cliente ya existe (por email)
      const existing = clients.find(c => c.email === email);
      if (!existing) {
        const nuevoCliente = { nombre, email, fecha: new Date() };
        clients.push(nuevoCliente);
        fs.writeFile(clientsPath, JSON.stringify(clients, null, 2), "utf8", writeErr => {
          if (writeErr) {
            console.error("Error al guardar client:", writeErr);
          }
        });
      }
      return res.json({ message: "Cliente autenticado exitosamente", role, nombre, email });
    });
  } else {
    return res.status(400).json({ error: "Rol inválido" });
  }
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});