import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { pool } from './db.js';
import { getAllPartnersWithDiscount } from './partner_repository.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
