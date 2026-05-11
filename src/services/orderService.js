const axios = require("axios");
const users = require("../data/users");

const getOrders = async (userId) => {
  const user = users.find(u => u.id === userId);
  const response = await axios.get("http://localhost:3001/pedidos");
  const allOrders = response.data.data;
  if (!user) return allOrders;
  return allOrders.filter(p => p.cliente === user.cliente);
};

module.exports = { getOrders };