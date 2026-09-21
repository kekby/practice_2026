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
