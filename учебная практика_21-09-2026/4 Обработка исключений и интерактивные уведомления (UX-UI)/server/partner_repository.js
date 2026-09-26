import { calculatePartnerDiscount } from './partner_discount.js';

export async function getAllPartnersWithDiscount(pool) {
  const result = await pool.query(
    `SELECT p.partner_id, p.company_name, p.inn, p.phone, p.rating,
            COALESCE(SUM(s.quantity), 0) AS total_quantity
     FROM partners p
     LEFT JOIN shipments s ON s.partner_id = p.partner_id
     GROUP BY p.partner_id, p.company_name, p.inn, p.phone, p.rating
     ORDER BY p.company_name`
  );

  return result.rows.map((row) => {
    const totalQuantity = Number(row.total_quantity);
    return {
      partnerId: row.partner_id,
      companyName: row.company_name,
      inn: row.inn,
      phone: row.phone,
      rating: row.rating,
      totalQuantity,
      discountPercent: calculatePartnerDiscount(totalQuantity),
    };
  });
}

export async function getPartnerById(pool, partnerId) {
  const result = await pool.query(
    `SELECT partner_id, company_name, partner_type, address, director_name, phone, contact_email, rating
     FROM partners
     WHERE partner_id = $1`,
    [partnerId]
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }
  return {
    partnerId: row.partner_id,
    companyName: row.company_name,
    partnerType: row.partner_type,
    address: row.address,
    directorName: row.director_name,
    phone: row.phone,
    email: row.contact_email,
    rating: row.rating,
  };
}

export async function createPartner(pool, data) {
  const result = await pool.query(
    `INSERT INTO partners (company_name, partner_type, address, director_name, phone, contact_email, rating)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING partner_id`,
    [data.companyName, data.partnerType, data.address, data.directorName, data.phone, data.email, data.rating]
  );
  return result.rows[0].partner_id;
}

export async function updatePartner(pool, partnerId, data) {
  const result = await pool.query(
    `UPDATE partners
     SET company_name = $1, partner_type = $2, address = $3, director_name = $4,
         phone = $5, contact_email = $6, rating = $7
     WHERE partner_id = $8
     RETURNING partner_id`,
    [data.companyName, data.partnerType, data.address, data.directorName, data.phone, data.email, data.rating, partnerId]
  );
  // пустой result значит партнёра с таким id нет — вызывающий код должен это проверить,
  // а не считать обновление успешным
  return result.rows[0] ?? null;
}
