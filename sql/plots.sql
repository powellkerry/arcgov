CREATE TABLE plots (
  plot_id INT PRIMARY KEY,
  cem_id INT,
  owner_id INT,
  occupant_id INT,
  headstone_id INT,
  plot_address CHAR(100),
  plot_lat LONG,
  plot_lng LONG,
  plot_price DECIMAL,
  plot_purchase_price DECIMAL,
  plot_purchase_date DATETIME,

  FOREIGN KEY (owner_id) REFERENCES owners(owner_id),
  FOREIGN KEY (occupant_id) REFERENCES occupants(occupant_id),
  FOREIGN KEY (headstone_id) REFERENCES headstones(headstone_id)
)