const getOrders = async (userId) => {
  // Simula llamada al microservicio de pedidos
  return [
    { id: 'o1', userId, boxId: '1', status: 'activo', date: '2025-01-15' },
    { id: 'o2', userId, boxId: '2', status: 'pausado', date: '2025-02-01' },
  ];
};

module.exports = { getOrders };
