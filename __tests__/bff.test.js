const request = require("supertest");
const axios = require("axios");
const app = require("../src/index");

jest.mock("axios");

// ─── Datos de prueba ────────────────────────────────────────────────────────

const mockCatalog = [
  { name: "Caja Primavera", price: 9990, season: "primavera", producer: "Huerto Verde" },
  { name: "Caja Verano",    price: 11990, season: "verano",   producer: "Sol y Tierra" },
  { name: "Caja Otoño",     price: 8990,  season: "otoño",    producer: "Huerto Verde" },
];

const mockPedidos = [
  { cliente: "Ana Torres",  producto: "Caja Primavera", cantidad: 1, estado: "PENDIENTE" },
  { cliente: "Ana Torres",  producto: "Caja Verano",    cantidad: 1, estado: "ENTREGADO" },
  { cliente: "Carlos Vega", producto: "Caja Otoño",     cantidad: 1, estado: "PENDIENTE" },
];

// ─── catalogService ──────────────────────────────────────────────────────────

describe("catalogService - getCatalog", () => {
  test("retorna lista de cajas desde el microservicio", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockCatalog } });

    const { getCatalog } = require("../src/services/catalogService");
    const result = await getCatalog();

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("price");
  });

  test("lanza error si el microservicio falla", async () => {
    axios.get.mockRejectedValueOnce(new Error("Microservicio no disponible"));

    const { getCatalog } = require("../src/services/catalogService");
    await expect(getCatalog()).rejects.toThrow("Microservicio no disponible");
  });
});

// ─── orderService ────────────────────────────────────────────────────────────

describe("orderService - getOrders", () => {
  test("retorna solo los pedidos del usuario indicado", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockPedidos } });

    const { getOrders } = require("../src/services/orderService");
    const orders = await getOrders("1"); // id "1" = Ana Torres

    expect(orders.length).toBeGreaterThan(0);
    orders.forEach(o => expect(o.cliente).toBe("Ana Torres"));
  });

  test("retorna todos los pedidos si el userId no existe", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockPedidos } });

    const { getOrders } = require("../src/services/orderService");
    const orders = await getOrders("no-existe");

    expect(orders).toHaveLength(mockPedidos.length);
  });

  test("lanza error si el microservicio falla", async () => {
    axios.get.mockRejectedValueOnce(new Error("Timeout"));

    const { getOrders } = require("../src/services/orderService");
    await expect(getOrders("1")).rejects.toThrow("Timeout");
  });
});

// ─── POST /api/login ─────────────────────────────────────────────────────────

describe("POST /api/login", () => {
  test("retorna datos del usuario con credenciales correctas", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "ana@greenbite.cl", password: "ana123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("nombre");
    expect(res.body).toHaveProperty("email");
    expect(res.body).not.toHaveProperty("password");
  });

  test("retorna 401 si el email no existe", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "noexiste@greenbite.cl", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("retorna 401 si la contraseña es incorrecta", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "ana@greenbite.cl", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});

// ─── POST /api/suscribir ──────────────────────────────────────────────────────

describe("POST /api/suscribir", () => {
  test("crea una suscripción correctamente", async () => {
    const mockPedido = { id: "p99", cliente: "Ana Torres", producto: "Caja Primavera", estado: "PENDIENTE" };
    axios.post.mockResolvedValueOnce({ data: mockPedido });

    const res = await request(app)
      .post("/api/suscribir")
      .send({ userId: "1", boxNombre: "Caja Primavera" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("cliente");
    expect(res.body).toHaveProperty("producto", "Caja Primavera");
  });

  test("retorna 404 si el userId no existe", async () => {
    const res = await request(app)
      .post("/api/suscribir")
      .send({ userId: "no-existe", boxNombre: "Caja Primavera" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("retorna 500 si el microservicio de pedidos falla", async () => {
    axios.post.mockRejectedValueOnce(new Error("ms-pedidos caído"));

    const res = await request(app)
      .post("/api/suscribir")
      .send({ userId: "1", boxNombre: "Caja Primavera" });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});

// ─── GET /api/catalog ─────────────────────────────────────────────────────────

describe("GET /api/catalog", () => {
  test("retorna el catálogo completo", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockCatalog } });

    const res = await request(app).get("/api/catalog");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("price");
  });

  test("retorna 500 si el microservicio de productos falla", async () => {
    axios.get.mockRejectedValueOnce(new Error("ms-productos caído"));

    const res = await request(app).get("/api/catalog");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});

// ─── GET /api/dashboard/:userId ───────────────────────────────────────────────

describe("GET /api/dashboard/:userId", () => {
  test("retorna catálogo y pedidos agregados para el usuario", async () => {
    axios.get
      .mockResolvedValueOnce({ data: { data: mockCatalog } })
      .mockResolvedValueOnce({ data: { data: mockPedidos } });

    const res = await request(app).get("/api/dashboard/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("userId", "1");
    expect(res.body).toHaveProperty("catalog");
    expect(res.body).toHaveProperty("orders");
    expect(Array.isArray(res.body.catalog)).toBe(true);
    expect(Array.isArray(res.body.orders)).toBe(true);
  });

  test("responde aunque el userId no exista (cliente undefined)", async () => {
    axios.get
      .mockResolvedValueOnce({ data: { data: mockCatalog } })
      .mockResolvedValueOnce({ data: { data: mockPedidos } });

    const res = await request(app).get("/api/dashboard/no-existe");

    expect(res.status).toBe(200);
    expect(res.body.cliente).toBeUndefined();
  });

  test("retorna 500 si algún microservicio falla", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error de red"));

    const res = await request(app).get("/api/dashboard/1");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
