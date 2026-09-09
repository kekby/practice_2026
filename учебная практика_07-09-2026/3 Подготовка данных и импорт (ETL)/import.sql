\copy partners from 'partners.csv' with (format csv, header true, null '')
\copy products from 'products.csv' with (format csv, header true)
\copy shipments from 'shipments.csv' with (format csv, header true)

SELECT COUNT(*) FROM partners;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM shipments;
