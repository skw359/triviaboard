const params     = new URLSearchParams(window.location.search);
const USERNAME   = params.get('username') || 'Anonymous';
const CATEGORY   = params.get('category') || '';

const DIFFICULTY = params.get('difficulty') || 'medium';
const TOTAL      = 10;



let questions = [], current = 0, score = 0;

const loading     = document.getElementById('loading');
const gameArea    = document.getElementById('game-area');
const resultsArea = document.getElementById('results-area');
const qCounter    = document.getElementById('q-counter');

const questionText = document.getElementById('question-text');
const answersGrid  = document.getElementById('answers-grid');
const submitBtn    = document.getElementById('submit-btn');


const submitStatus = document.getElementById('submit-status');

function decode(str) {

  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;

}

function shuffle(arr) { 
  return arr.sort(() => Math.random() - 0.5); 
}

// OUTLINE: firstly,fetch  GET /api/questions 
async function loadQuestions() {

  const url = `/api/questions?amount=${TOTAL}&difficulty=${DIFFICULTY}${CATEGORY ? `&category=${CATEGORY}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) { loading.innerHTML = '<p>Failed to load. <a href="/">Go back</a></p>'; return; }
  questions = await res.json();
  loading.classList.add('hidden');
  gameArea.classList.remove('hidden');
  showQuestion();

}

function showQuestion() {

  const q = questions[current];
  qCounter.textContent = `Question ${current + 1} / ${TOTAL} — Score: ${score}`;
  questionText.textContent = decode(q.question);

  answersGrid.innerHTML = '';
  shuffle([q.correct_answer, ...q.incorrect_answers]).forEach(answer => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = decode(answer);
    btn.addEventListener('click', () => handleAnswer(btn, answer, q.correct_answer));
    answersGrid.appendChild(btn);
  });

}

function handleAnswer(selected, answer, correct) {

  answersGrid.querySelectorAll('.answer-btn').forEach(btn => {
    btn.disabled = true;
    if (decode(btn.textContent) === decode(correct)) btn.classList.add('correct');
  });
  if (answer === correct) { selected.classList.add('correct'); score++; }
  else selected.classList.add('wrong');

  setTimeout(() => {
    current++;
    if (current < TOTAL) showQuestion();
    else showResults();
  }, 
  900);


}

function showResults() {

  gameArea.classList.add('hidden');
  resultsArea.classList.remove('hidden');
  document.getElementById('results-title').textContent = `Game Over — ${USERNAME}`;
  document.getElementById('results-score').textContent = `${score} / ${TOTAL} correct`;
  if (score >= 7) confetti({ particleCount: 100, spread: 70 });


}

// OUTLINE: now POST /api/scores by writing to supabasae
submitBtn.addEventListener('click', async () => {
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  const res = await fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, score, category: CATEGORY, difficulty: DIFFICULTY })
  });
  submitStatus.classList.remove('hidden');
  if (res.ok) {
    submitStatus.textContent = 'Score submitted!';
    submitBtn.classList.add('hidden');
  } else {
    submitStatus.textContent = 'Failed to submit.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Score';
  }
  
});

loadQuestions();
