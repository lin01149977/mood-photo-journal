CREATE TABLE IF NOT EXISTS journal (
  id          TEXT PRIMARY KEY,
  entry_date  TEXT NOT NULL,
  mood        TEXT NOT NULL,
  mood_color  TEXT NOT NULL,
  note        TEXT NOT NULL DEFAULT '',
  photos      TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_journal_entry_date ON journal (entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_created_at ON journal (created_at);
