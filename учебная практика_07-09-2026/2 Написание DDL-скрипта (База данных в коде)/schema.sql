DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS partners;

CREATE TABLE partners (
    partner_id    INTEGER PRIMARY KEY,
    company_name  VARCHAR(255) NOT NULL,
    inn           VARCHAR(12) NOT NULL UNIQUE,
    contact_email VARCHAR(255) UNIQUE,
    phone         VARCHAR(20),
    rating        DECIMAL(2,1)
);

CREATE TABLE products (
    product_id   INTEGER PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE shipments (
    sale_id      INTEGER PRIMARY KEY,
    partner_id   INTEGER NOT NULL,
    product_id   INTEGER NOT NULL,
    sale_date    DATE NOT NULL,
    quantity     INTEGER NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (partner_id) REFERENCES partners (partner_id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE RESTRICT
);
