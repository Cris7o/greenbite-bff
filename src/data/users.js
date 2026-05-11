const bcrypt = require("bcryptjs");

const users = [
  { id: "1", nombre: "Ana Torres",   email: "ana@greenbite.cl",    password: bcrypt.hashSync("ana123",    10), cliente: "Ana Torres"   },
  { id: "2", nombre: "Carlos Vega",  email: "carlos@greenbite.cl", password: bcrypt.hashSync("carlos123", 10), cliente: "Carlos Vega"  },
  { id: "3", nombre: "Sofia Reyes",  email: "sofia@greenbite.cl",  password: bcrypt.hashSync("sofia123",  10), cliente: "Sofía Reyes"  },
  { id: "4", nombre: "Miguel Diaz",  email: "miguel@greenbite.cl", password: bcrypt.hashSync("miguel123", 10), cliente: "Miguel Díaz"  },
];

module.exports = users;