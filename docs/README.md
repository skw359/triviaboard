# TriviaRank

This project is for INST377, and this is a browser-based trivia game. Players pick a category and difficulty, answer 10 questions from the Open Trivia Database, and submit their score to a global leaderboard! It's fun and it works!

## Target Browsers

- Chrome 120+ (desktop, Android, iOS)

---

### What you should have

- Node.js v18+
- npm
- Supabase account
- Vercel account

### Installation

```bash
git clone https://github.com/your-username/trivia-leaderboard.git
cd trivia-leaderboard
npm install
cp .env.example .env
```

Fill in `.env`:

```
SUPABASE_URL=https://the-url-here
SUPABASE_KEY=the-anon-key-here
```

### Database Setup

In Supabase, create a project and then use th SQL Editor:

```sql
CREATE TABLE scores (
  id         SERIAL PRIMARY KEY,
  username   TEXT NOT NULL,
  score      INT NOT NULL,
  category   TEXT,
  difficulty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
```

### API Endpoints

#### `GET /api/questions`

Fetches questions from the Open Trivia Database.

| Param | Default | Description |
|-------|---------|-------------|
| amount | 10 | Number of questions |
| category | (any) | OpenTDB category ID |
| difficulty | medium | easy, medium, or hard |

The response is an array of question objects

---

#### `POST /api/scores`

This writes  a score to Supabase 

Body:
```json
{ 
  "username": "string", "score": 8, "category": "18", "difficulty": "medium" 
  }
```

The response is an inserted row

---

#### `GET /api/scores`

This one returnd top scores from Supabase ordered by score descending

| Param | Default | Description |
|-------|---------|-------------|
| limit | 20 | Max rows returned |

The response is an array of score objects

### How to Deploy...

1. Push your repo to GitHub (that's what I did)
2. Create a Vercel account and then import it
3. Add your `SUPABASE_URL` and `SUPABASE_KEY` in the env variables
4. Deploy!
