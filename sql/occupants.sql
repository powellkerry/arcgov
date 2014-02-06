CREATE TABLE occupants(
  occupant_id int PRIMARY KEY,
  headstone_id int,
  occupant_first_name char(100),
  occupant_last_name char(100),
  occupant_gender char(1),
  occupant_birth_date date,
  occupant_death_date date,

  FOREIGN KEY (headstone_id) REFERENCES headstones(headstone_id)
)