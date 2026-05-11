const express = require('express');
const router = express.Router();
const { getCatalog } = require('../services/catalogService');
const { getOrders } = require('../services/orderService');

// Patrón BFF: agrega datos de catálogo + pedidos para el frontend
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [catalog, orders] = await Promise.all([
      getCatalog(),
      getOrders(userId)
    ]);
    res.json({ userId, catalog, orders });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

router.get('/catalog', async (req, res) => {
  try {
    const catalog = await getCatalog();
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener catálogo' });
  }
});

module.exports = router;