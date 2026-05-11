const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const axios = require("axios");
const users = require("../data/users");
const { getCatalog } = require("../services/catalogService");
const { getOrders } = require("../services/orderService");

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Credenciales incorrectas" });
  res.json({ id: user.id, nombre: user.nombre, email: user.email, cliente: user.cliente });
});

router.post("/suscribir", async (req, res) => {
  try {
    const { userId, boxNombre } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const pedido = { cliente: user.cliente, producto: boxNombre, cantidad: 1, estado: "PENDIENTE" };
    const response = await axios.post("http://localhost:3001/pedidos", pedido);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error suscribir:", error.message);
    res.status(500).json({ error: "Error al crear suscripción" });
  }
});

router.get("/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Dashboard para userId:", userId);
    const user = users.find(u => u.id === userId);
    console.log("Usuario encontrado:", user?.nombre);
    const catalog = await getCatalog();
    console.log("Catalogo ok, items:", catalog.length);
    const orders = await getOrders(userId);
    console.log("Orders ok, items:", orders.length);
    res.json({ userId, cliente: user?.cliente, catalog, orders });
  } catch (error) {
    console.error("Error dashboard:", error.message);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

router.get("/catalog", async (req, res) => {
  try {
    const catalog = await getCatalog();
    res.json(catalog);
  } catch (error) {
    console.error("Error catalog:", error.message);
    res.status(500).json({ error: "Error al obtener catálogo" });
  }
});

module.exports = router;