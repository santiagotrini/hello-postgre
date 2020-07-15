CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  mail VARCHAR(60),
  birthday DATE
);

INSERT INTO users(name, mail, birthday) VALUES
  ('Juan', 'juan@mail.com', '2000-05-24'),
  ('Maria', 'maria@mail.com', '2000-02-13'),
  ('Pedro', 'pedro@mail.com', '2000-05-19'),
  ('Julia', 'julia@mail.com', '1998-03-01');
