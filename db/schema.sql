CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '기타',
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  reactions TEXT NOT NULL DEFAULT '{"like":0,"comfort":0,"surprised":0}'
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT (datetime('now'))
);
