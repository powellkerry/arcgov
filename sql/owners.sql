CREATE TABLE owners (
  owner_id int PRIMARY KEY,
  owner_first_name char(100),
  owner_last_name char(100),
  owner_title char(100),
  owner_street char(100),
  owner_city char(100),
  owner_state char(2),
  owner_zip char(10),
  owner_billing_street char(100),
  owner_billing_city char(100),
  owner_billing_state char(2),
  owner_billing_zip char(10)
);