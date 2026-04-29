CREATE TABLE IF NOT EXISTS items (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  creator       TEXT,
  cover_url     TEXT,
  type          TEXT NOT NULL CHECK(type IN ('book','manga','comic')),
  isbn          TEXT,
  external_id   TEXT,
  source        TEXT,
  status        TEXT NOT NULL CHECK(status IN ('wishlist','owned','reading','read','dnf')),
  rating        INTEGER CHECK(rating BETWEEN 1 AND 5),
  notes         TEXT,
  series        TEXT,
  volume        INTEGER,
  date_added    TEXT NOT NULL DEFAULT (datetime('now')),
  date_finished TEXT
);

CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_type   ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_series ON items(series);
