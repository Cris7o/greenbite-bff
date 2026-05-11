const axios = require("axios");

const getCatalog = async () => {
  const response = await axios.get("http://localhost:3002/productos");
  return response.data.data;
};

module.exports = { getCatalog };
