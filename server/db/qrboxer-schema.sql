CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE moves (
  id SERIAL PRIMARY KEY,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE boxes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  room VARCHAR(100) NOT NULL,
  move INTEGER REFERENCES moves(id) ON DELETE CASCADE
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  image TEXT,
  description TEXT NOT NULL,
  box INTEGER REFERENCES boxes(id) ON DELETE CASCADE
);

