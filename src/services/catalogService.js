const axios = require('axios');

const getCatalog = async () => {
  // Simula llamada al microservicio de catálogo
  return [
    { id: '1', name: 'Caja Básica', price: 15000, season: 'verano', producer: 'Huerto Los Andes' },
    { id: '2', name: 'Caja Premium', price: 25000, season: 'otoño', producer: 'Finca Verde' },
    { id: '3', name: 'Caja Familiar', price: 35000, season: 'verano', producer: 'Huerto Los Andes' },
  ];
};

module.exports = { getCatalog };
