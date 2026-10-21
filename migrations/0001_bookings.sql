CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL CHECK (time IN ('09:00', '10:00', '11:00', '12:00')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '',
  vin TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  UNIQUE (date, time)
);
