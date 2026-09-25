-- расширяем partners под поля формы из задания 2

ALTER TABLE partners
    ADD COLUMN partner_type VARCHAR(10) CHECK (partner_type IN ('ООО', 'ЗАО', 'АО', 'ИП', 'ТК')),
    ADD COLUMN address VARCHAR(255),
    ADD COLUMN director_name VARCHAR(255);

-- форма не собирает ИНН, а он был NOT NULL
ALTER TABLE partners ALTER COLUMN inn DROP NOT NULL;