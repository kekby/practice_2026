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

module.exports = { getPartnerSalesSummary, getPartnerWithDiscount };
