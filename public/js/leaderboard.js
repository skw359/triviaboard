const CATS = { 
  '': 'Any', '9': 'General Knowledge', '17': 'Science & Nature', '18': 'Computers', '21': 'Sports', '23': 'History', '27': 'Animals' 
};

function escapeHTML(str) {


  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;

}

// Ffetch #3 — GET /api/scores (
async function loadLeaderboard() {


  const res = await fetch('/api/scores?limit=20');
  document.getElementById('lb-loading').classList.add('hidden');

  if (!res.ok) { document.getElementById('lb-empty').textContent = 'Failed to load scores.'; document.getElementById('lb-empty').classList.remove('hidden'); return; }

  const scores = await res.json();
  if (!scores.length) { document.getElementById('lb-empty').classList.remove('hidden'); return; }

  const tbody = document.getElementById('lb-body');
  scores.forEach((row, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i + 1}</td><td>${escapeHTML(row.username)}</td><td>${row.score} / 10</td><td style="text-transform:capitalize">${row.difficulty || '-'}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('lb-table').classList.remove('hidden');

  // OUTLINE: here, i'll use the chart.js bar chart for the top 10 scores

  const top10 = scores.slice(0, 10);

  document.getElementById('chart-wrap').classList.remove('hidden');

  new Chart(document.getElementById('scores-chart'), {

    type: 'bar',


    data: {
      labels: top10.map(r => r.username),
      datasets: [{ label: 'Score', data: top10.map(r => r.score), backgroundColor: '#555' }]
    },
    options: {

      scales: {

        y: { min: 0, max: 10, ticks: { stepSize: 2 } }
      },

      
      plugins: { legend: { display: false } }
    }
  });
}

loadLeaderboard();
