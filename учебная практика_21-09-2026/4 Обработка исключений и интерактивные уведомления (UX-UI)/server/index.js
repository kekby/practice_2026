import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { pool } from './db.js';
import {
  getAllPartnersWithDiscount,
  getPartnerById,
  createPartner,
  updatePartner,
} from './partner_repository.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// сервер не должен доверять клиенту
// и обязан сам отбраковать значение, которого нет в бизнес-справочнике
const PARTNER_TYPES = ['ООО', 'ЗАО', 'АО', 'ИП', 'ТК'];

function validatePartnerPayload(body) {
  const errors = [];
  if (!body.companyName || !body.companyName.trim()) {
    errors.push('Наименование партнёра — обязательное поле.');
  }
  if (!body.email || !body.email.trim()) {
    errors.push('Email партнёра — обязательное поле.');
  }
  if (!PARTNER_TYPES.includes(body.partnerType)) {
    errors.push(`partnerType должен быть одним из: ${PARTNER_TYPES.join(', ')}`);
  }
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    errors.push('Рейтинг должен быть целым числом от 0 до 5. Пожалуйста, удалите знаки препинания и повторите попытку.');
  }
  return errors;
}

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

app.get('/api/partners/:id', async (req, res) => {
  try {
    const partner = await getPartnerById(pool, req.params.id);
    if (!partner) {
      res.status(404).json({ error: 'партнёр не найден' });
      return;
    }
    res.json(partner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'не удалось получить партнёра' });
  }
});

app.post('/api/partners', async (req, res) => {
  const errors = validatePartnerPayload(req.body);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  try {
    const partnerId = await createPartner(pool, req.body);
    res.status(201).json({ partnerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'не удалось создать партнёра' });
  }
});

app.put('/api/partners/:id', async (req, res) => {
  const errors = validatePartnerPayload(req.body);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  try {
    const updated = await updatePartner(pool, req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'партнёр не найден' });
      return;
    }
    res.json({ partnerId: updated.partner_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'не удалось обновить партнёра' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
