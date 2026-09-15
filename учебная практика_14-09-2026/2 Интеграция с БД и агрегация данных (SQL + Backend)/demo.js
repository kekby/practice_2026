const { pool } = require('./db');
const { getPartnerWithDiscount } = require('./partner_repository');

async function main() {
  const result = await pool.query('SELECT partner_id FROM partners ORDER BY partner_id');
  for (const row of result.rows) {
    const partner = await getPartnerWithDiscount(pool, row.partner_id);
    console.log(partner);
  }
  await pool.end();
}

main();
