import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { pool } from '../../1 Проектирование многооконной архитектуры и навигации/server/db.js';
import { getAllPartnersWithDiscount } from '../../1 Проектирование многооконной архитектуры и навигации/server/partner_repository.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('/api/partners', async (req, res) => {
  try {
    const partners = await getAllPartnersWithDiscount(pool);
    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'не удалось получить список партнёров' });
  }
});

app.post('/api/partners', (req, res) => {
  console.log('создание партнёра:', req.body);
  res.status(201).json({ received: true });
});

app.put('/api/partners/:id', (req, res) => {
  console.log(`обновление партнёра ${req.params.id}:`, req.body);
  res.status(200).json({ received: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
