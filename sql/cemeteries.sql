CREATE TABLE cemeteries (
  cem_id int PRIMARY KEY,
  org_id int,
  cem_name varchar(100),
  cem_street varchar(100),
  cem_city varchar(100),
  cem_state varchar(20),
  cem_zip varchar(10),
  cem_capacity int,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);