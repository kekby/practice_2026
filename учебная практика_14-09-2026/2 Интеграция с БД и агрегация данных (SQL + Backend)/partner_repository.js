const { calculatePartnerDiscount } = require('../1 Разработка ядра бизнес-логики (Расчет скидки)/partner_discount');

async function getPartnerSalesSummary(pool, partnerId) {
  const result = await pool.query(
    `SELECT p.partner_id, p.company_name, COALESCE(SUM(s.quantity), 0) AS total_quantity
     FROM partners p
     LEFT JOIN shipments s ON s.partner_id = p.partner_id
     WHERE p.partner_id = $1
     GROUP BY p.partner_id, p.company_name`,
    [partnerId]
  );
  
  const row = result.rows[0];
  if (!row) {
    return null;
  }
  return {
    partnerId: row.partner_id,
    companyName: row.company_name,
    totalQuantity: Number(row.total_quantity),
  };
}

async function getPartnerWithDiscount(pool, partnerId) {
  const summary = await getPartnerSalesSummary(pool, partnerId);
  if (!summary) {
    return null;
  }
  return {
    ...summary,
    discountPercent: calculatePartnerDiscount(summary.totalQuantity),
  };
}

async function getAllPartnersWithDiscount(pool) {
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

module.exports = { getPartnerSalesSummary, getPartnerWithDiscount, getAllPartnersWithDiscount };
