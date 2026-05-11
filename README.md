# greenbite-bff

Backend For Frontend de GreenBite. Agrega datos de catálogo y pedidos para el cliente React.

## Instalación
```bash
npm install
```

## Ejecución
```bash
node src/index.js
```

## Pruebas
```bash
npm test
```

## Estructura del proyecto
greenbite-bff/
├── tests/
│   └── bff.test.js
├── src/
│   ├── routes/
│   │   └── bff.js
│   ├── services/
│   │   ├── catalogService.js
│   │   └── orderService.js
│   └── index.js
├── package.json
└── README.md

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/dashboard/:userId | Retorna catálogo y pedidos agregados para el usuario |
| GET | /api/catalog | Retorna el catálogo completo de cajas orgánicas |

## Patrón implementado

### Backend For Frontend (BFF)
Agrega datos de múltiples microservicios (catálogo y pedidos) en una sola respuesta para el cliente React, reduciendo el número de llamadas HTTP y optimizando el rendimiento en días de alta demanda.

## Resultados de pruebas
- 3/3 tests pasando
- getCatalog: retorna lista de cajas correctamente
- getOrders: retorna pedidos por usuario correctamente
