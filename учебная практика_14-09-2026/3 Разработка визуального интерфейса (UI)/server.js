const path = require('node:path');
const express = require('express');
const { pool } = require('../2 Интеграция с БД и агрегация данных (SQL + Backend)/db');
const { getAllPartnersWithDiscount } = require('../2 Интеграция с БД и агрегация данных (SQL + Backend)/partner_repository');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

app.get('/api/partners', async (req, res) => {
  const partners = await getAllPartnersWithDiscount(pool);
  res.json(partners);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
