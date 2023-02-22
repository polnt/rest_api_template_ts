CREATE TABLE IF NOT EXISTS user (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  email varchar(45) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  lastname varchar(45) DEFAULT NULL,
  firstname varchar(45) DEFAULT NULL
);