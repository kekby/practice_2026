SELECT p.company_name, COUNT(s.sale_id) AS deliveries_count
FROM partners p
LEFT JOIN shipments s ON s.partner_id = p.partner_id
GROUP BY p.partner_id, p.company_name
ORDER BY p.company_name;

BEGIN;
INSERT INTO partners (partner_id, company_name, inn, contact_email, phone, rating)
VALUES (4, 'ООО "Тест"', '9998887771', 'test@test.ru', '+70000000000', 5.0);
INSERT INTO shipments (sale_id, partner_id, product_id, sale_date, quantity, total_amount)
VALUES (106, 4, 1, '2026-04-01', 10, 5000.00);
COMMIT;

SELECT pr.product_name, s.sale_date, s.quantity, s.total_amount
FROM shipments s
JOIN products pr ON pr.product_id = s.product_id
WHERE s.partner_id = 1
  AND s.sale_date BETWEEN '2026-03-01' AND '2026-03-31'
ORDER BY s.sale_date;
