# TriviaRank

This project is for INST377, and this is a browser-based trivia game. Players pick a category and difficulty, answer 10 questions from the Open Trivia Database, and submit their score to a global leaderboard! It's fun and it works!

## Target Browsers

- Chrome 120+ (desktop, Android, iOS)

### What you should have

- Node.js v18+
- npm
- A Supabase account
- A Vercel account, both can be free (no paid tiers)

### Installation

To install, run this:

```bash
git clone https://github.com/your-username/trivia-leaderboard.git
cd trivia-leaderboard
npm install
```

Then edit the .env file:

```
SUPABASE_LINK=https://whatever-url-here.co
SUPABASE_KEY=the-anon-key-here
```

Now, start the server:
   npm start

Then open it locally or on the Vercel link:
   http://localhost:3000 


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
```

In Vercel, I had to disable row level security, so make sure to do that in SQL Editor tab.

### API Endpoints

#### `GET /api/questions`

This gets the questions from the Open Trivia Database.

| Param | Default | Description |
|-------|---------|-------------|
| amount | 10 | Number of questions |
| category | (any) | OpenTDB category ID |
| difficulty | medium | easy, medium, or hard |

The response is an array of question objects

---

#### `POST /api/scores`

This writes a score to Supabase 

```json
{ 
  "username": "string", "score": 8, "category": "18", "difficulty": "medium" 
  }
```

The response is an inserted row

---

#### `GET /api/scores`

This API gets the top scores from Supabase database ordered by score descending

| Param | Default | Description |
|-------|---------|-------------|
| limit | 20 | Max rows returned |

The response is an array of score objects

### How to Deploy (aka how I did it)...

1. Push your repo to GitHub (that's what I did)
2. Create a Vercel account and then import it
3. Add your `SUPABASE_URL` and `SUPABASE_KEY` in the env variables
4. Deploy!

### Tests for the Application

This project does not include automated tests. If you want, you can run the test command:

npm test

### Future Improvements/Roadmap
- I'd want to add per-question countdown timer, it could make the game more fun
- I'd also want to add leaderboard filtering by category and difficulty
- Finally, I'd love to prevent duplicate score submissions per session.
