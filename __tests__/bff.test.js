const { getCatalog } = require('../src/services/catalogService');
const { getOrders } = require('../src/services/orderService');

test('getCatalog retorna lista de cajas', async () => {
  const catalog = await getCatalog();
  expect(catalog).toHaveLength(3);
  expect(catalog[0]).toHaveProperty('name');
  expect(catalog[0]).toHaveProperty('price');
});

test('getOrders retorna pedidos de un usuario', async () => {
  const orders = await getOrders('u1');
  expect(orders).toHaveLength(2);
  expect(orders[0]).toHaveProperty('status');
});

test('getOrders incluye el userId correcto', async () => {
  const orders = await getOrders('u1');
  expect(orders[0].userId).toBe('u1');
});