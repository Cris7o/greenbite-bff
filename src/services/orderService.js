const axios = require("axios");

const getOrders = async (userId) => {
  const response = await axios.get("http://localhost:3001/pedidos");
  return response.data.data;
};

module.exports = { getOrders };
