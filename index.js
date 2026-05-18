require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_LINK,
  process.env.SUPABASE_KEY
);

app.use(bodyParser.json());
app.use(express.static('public'));

// GET /api/questions - proxy to Open Trivia DB (external API)
app.get('/api/questions', async (req, res) => {
  const { amount = 10, category = '', difficulty = 'medium' } = req.query;
  let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&difficulty=${difficulty}`;
  if (category) url += `&category=${category}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.response_code !== 0) {
      return res.status(500).json({ error: 'Failed to fetch questions from OpenTDB' });
    }
    res.json(data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/scores - write a score to Supabase
app.post('/api/scores', async (req, res) => {
  const { username, score, category, difficulty } = req.body;
  if (!username || score === undefined) {
    return res.status(400).json({ error: 'username and score are required' });
  }

  const { data, error } = await supabase
    .from('scores')
    .insert([{ username, score, category: category || null, difficulty: difficulty || null }])
    .select();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data[0]);
});

// GET /api/scores - read top scores from Supabase
app.get('/api/scores', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
