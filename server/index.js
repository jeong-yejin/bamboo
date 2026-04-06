const express = require('express');
const cors = require('cors');
const db = require('./db');
const { containsProfanity } = require('./profanity');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── Helpers ──────────────────────────────────────────────────────────────────

function parsePost(row) {
  return {
    ...row,
    reactions: typeof row.reactions === 'string' ? JSON.parse(row.reactions) : row.reactions,
  };
}

// ── GET /posts ────────────────────────────────────────────────────────────────
// Query params: category (optional filter)
app.get('/posts', (req, res) => {
  const { category } = req.query;
  let rows;
  if (category && category !== '전체') {
    rows = db.prepare(
      'SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC'
    ).all(category);
  } else {
    rows = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  }
  res.json(rows.map(parsePost));
});

// ── POST /posts ───────────────────────────────────────────────────────────────
app.post('/posts', (req, res) => {
  const { content, category = '기타' } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content is required.' });
  }
  const trimmed = content.trim();
  if (trimmed.length < 10) {
    return res.status(400).json({ error: 'Please write at least 10 characters.' });
  }
  if (trimmed.length > 500) {
    return res.status(400).json({ error: 'Content cannot exceed 500 characters.' });
  }
  if (containsProfanity(trimmed)) {
    return res.status(400).json({ error: 'Your post contains inappropriate language.' });
  }

  const VALID_CATEGORIES = ['학교', '직장', '연애', '가족', '일상', '기타'];
  const cat = VALID_CATEGORIES.includes(category) ? category : '기타';

  const result = db.prepare(
    'INSERT INTO posts (content, category) VALUES (?, ?)'
  ).run(trimmed, cat);

  const post = parsePost(
    db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid)
  );
  res.status(201).json(post);
});

// ── GET /posts/:id ────────────────────────────────────────────────────────────
app.get('/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const comments = db.prepare(
    'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC'
  ).all(req.params.id);

  res.json({ ...parsePost(post), comments });
});

// ── POST /posts/:id/comments ──────────────────────────────────────────────────
app.post('/posts/:id/comments', (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const { content } = req.body;
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Reply content is required.' });
  }
  const trimmed = content.trim();
  if (trimmed.length < 1) {
    return res.status(400).json({ error: 'Reply content is required.' });
  }
  if (trimmed.length > 200) {
    return res.status(400).json({ error: 'Reply cannot exceed 200 characters.' });
  }
  if (containsProfanity(trimmed)) {
    return res.status(400).json({ error: 'Your reply contains inappropriate language.' });
  }

  const result = db.prepare(
    'INSERT INTO comments (post_id, content) VALUES (?, ?)'
  ).run(req.params.id, trimmed);

  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(comment);
});

// ── POST /posts/:id/reactions ─────────────────────────────────────────────────
// Body: { type: 'like' | 'comfort' | 'surprised', action: 'add' | 'remove' }
app.post('/posts/:id/reactions', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const { type, action } = req.body;
  const VALID_TYPES = ['like', 'comfort', 'surprised'];
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Invalid reaction type.' });
  }

  const reactions = JSON.parse(post.reactions);
  if (action === 'remove') {
    reactions[type] = Math.max(0, (reactions[type] || 0) - 1);
  } else {
    reactions[type] = (reactions[type] || 0) + 1;
  }

  db.prepare('UPDATE posts SET reactions = ? WHERE id = ?').run(
    JSON.stringify(reactions),
    req.params.id
  );

  res.json({ reactions });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Bamboo server running on http://localhost:${PORT}`);
});
