const params = new URLSearchParams(window.location.search);
const USERNAME = params.get('username') || 'Anonymous';
const CATEGORY = params.get('category') || '';

const DIFFICULTY = params.get('difficulty') || 'medium';
const TOTAL = 10;



let questions = [];
let current = 0;
let score = 0;

const loading = document.getElementById('loading');
const gameArea = document.getElementById('game-area');
const resultsArea = document.getElementById('results-area');
const questionCounter = document.getElementById('q-counter');
const questionText = document.getElementById('question-text');
const answersGrid  = document.getElementById('answers-grid');
const submitButtom = document.getElementById('submit-btn');


const submitStatus = document.getElementById('submit-status');

function decode(str) {

  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;

}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// OUTLINE: firstly,fetch  GET /api/questions, then read the query parameeters, make the OpenTDB url, get it server-side, and responds to the browser with just data.results (the questions array).
async function loadQuestions() {

  const query = new URLSearchParams({ amount: TOTAL, difficulty: DIFFICULTY });
  if (CATEGORY) query.set('category', CATEGORY);
  const url = `/api/questions?${query}`;
  const res = await fetch(url);
  if (!res.ok) {
    loading.innerHTML = '<p>Failed to load. <a href="/">Go back</a></p>';
    return;
  }
  questions = await res.json();
  loading.classList.add('hidden');
  gameArea.classList.remove('hidden');
  showQuestion();

}

function showQuestion() {

  const q = questions[current];
  questionCounter.textContent = `Question ${current + 1}/${TOTAL}, Score: ${score}`;
  questionText.textContent = decode(q.question);

  answersGrid.innerHTML = '';
  for (const answer of shuffle([q.correct_answer, ...q.incorrect_answers])) {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = decode(answer);
    btn.addEventListener('click', () => userClicksAnswer(btn, answer, q.correct_answer));
    answersGrid.appendChild(btn);
  }

}

function userClicksAnswer(selected, answer, correct) {

  for (const btn of answersGrid.querySelectorAll('.answer-btn')) {
    btn.disabled = true;
    if (decode(btn.textContent) === decode(correct)) btn.classList.add('correct');
  }
  if (answer === correct) {
    selected.classList.add('correct');
    score++;
  } else {
    selected.classList.add('wrong');
  }

  setTimeout(() => {
    current++;
    if (current < TOTAL) {
      showQuestion();
    } else {
      showResults();
    }
  }, 900);


}

function showResults() {

  gameArea.classList.add('hidden');

  resultsArea.classList.remove('hidden');
  document.getElementById('results-title').textContent = `Game Over — ${USERNAME}`;
  document.getElementById('results-score').textContent = `${score} / ${TOTAL} correct`;
  if (score >= 7) {
    confetti({ particleCount: 100, spread: 70 });

  }


}

// OUTLINE: now POST /api/scores by writing to supabasae
submitButtom.addEventListener('click', async () => {
  submitButtom.disabled = true;
  submitButtom.textContent = 'Submitting...';
  const res = await fetch('/api/scores', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },

    body: JSON.stringify({ 
      username: USERNAME, score, category: CATEGORY, difficulty: DIFFICULTY 
    })

  });

  submitStatus.classList.remove('hidden');
  if (res.ok) {

    submitStatus.textContent = 'Score submitted!';
    submitButtom.classList.add('hidden');

  } else {

    submitStatus.textContent = 'Failed to submit.';
    submitButtom.disabled = false;
    submitButtom.textContent = 'Submit Score';

  }
  
});

loadQuestions();
