const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'db', 'bamboo.db');
const db = new Database(dbPath);

const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
db.exec(schema);

const insertPost = db.prepare(
  'INSERT INTO posts (content, category, created_at, reactions) VALUES (?, ?, ?, ?)'
);

const seeds = [
  {
    content: "I failed a job interview today. I prepared so hard but it just didn't work out. I keep telling myself I'll get back up, but right now it really hurts. Just needed to get this off my chest.",
    category: '기타',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
    reactions: JSON.stringify({ like: 12, comfort: 34, surprised: 2 }),
  },
  {
    content: "A friend told me something in confidence and I accidentally let it slip to someone else. They don't know yet. The guilt is eating me alive. I don't know what to do.",
    category: '기타',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
    reactions: JSON.stringify({ like: 5, comfort: 21, surprised: 8 }),
  },
  {
    content: "My parents keep pushing me toward a stable career but all I want to do is make art. We fight about it constantly. I never thought loving someone could feel this exhausting.",
    category: '기타',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19),
    reactions: JSON.stringify({ like: 18, comfort: 45, surprised: 3 }),
  },
];

const count = db.prepare('SELECT COUNT(*) as c FROM posts').get();
if (count.c === 0) {
  for (const s of seeds) {
    insertPost.run(s.content, s.category, s.created_at, s.reactions);
  }
  console.log('Seeded 3 sample posts.');
} else {
  console.log('DB already has data, skipping seed.');
}

db.close();
