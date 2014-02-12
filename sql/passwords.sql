CREATE TABLE passwords (
  password_id int PRIMARY KEY,
  user_id int,
  password varchar(500),

  FOREIGN KEY (user_id) REFERENCES users(user_id)
);