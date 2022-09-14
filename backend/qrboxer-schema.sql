CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE moves (
  id SERIAL PRIMARY KEY,
  location TEXT NOT NULL,
  month TEXT NOT NULL,
  year INTEGER CHECK (year <= 2100),
  username VARCHAR(25)
);

CREATE TABLE boxes (
  id SERIAL PRIMARY KEY,
  room TEXT NOT NULL,
  description TEXT NOT NULL,
  move INTEGER REFERENCES moves(id) ON DELETE CASCADE
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  image TEXT,
  description TEXT NOT NULL,
  box INTEGER REFERENCES boxes(id) ON DELETE CASCADE
);

