const express = require('express');
const bffRoutes = require('./routes/bff');

const app = express();
app.use(express.json());
app.use('/api', bffRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFF GreenBite corriendo en puerto ${PORT}`);
});

module.exports = app;