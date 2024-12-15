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
  date TEXT NOT NULL,
  username VARCHAR(25)
);

CREATE TABLE boxes (
  id SERIAL PRIMARY KEY,
  room TEXT NOT NULL,
  move INTEGER NOT NULL
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  image TEXT,
  description TEXT NOT NULL,
  box INTEGER NOT NULL
);

