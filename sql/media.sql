CREATE TABLE media (
  media_id int primary key,
  cem_id int,
  file_name varchar(40),
  file_type varchar(10),

  foreign key (cem_id) references cemeteries(cem_id)
);