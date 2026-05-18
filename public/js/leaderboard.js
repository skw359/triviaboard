// Ffetch #3 — GET /api/scores (
async function loadLeaderboard() {


  const res = await fetch('/api/scores?limit=20');
  document.getElementById('lb-loading').classList.add('hidden');

  if (!res.ok) {
    document.getElementById('lb-empty').textContent = 'Failed to load scores.';
    document.getElementById('lb-empty').classList.remove('hidden');
    return;
  }

  const scores = await res.json();
  if (scores.length === 0) {
    document.getElementById('lb-empty').classList.remove('hidden');
    return;
  }

  const tbody = document.getElementById('lb-body');
  for (let i = 0; i < scores.length; i++) {
    const row = scores[i];
    const tr = document.createElement('tr');

    const rankCell = document.createElement('td');
    rankCell.textContent = i + 1;

    const nameCell = document.createElement('td');
    nameCell.textContent = row.username;

    const scoreCell = document.createElement('td');
    scoreCell.textContent = `${row.score} / 10`;

    const difficultyCell = document.createElement('td');
    difficultyCell.textContent = row.difficulty || '-';
    difficultyCell.style.textTransform = 'capitalize';

    tr.appendChild(rankCell);
    tr.appendChild(nameCell);
    tr.appendChild(scoreCell);
    tr.appendChild(difficultyCell);
    tbody.appendChild(tr);
  }

  document.getElementById('lb-table').classList.remove('hidden');

  // OUTLINE: here, i'll use the chart.js bar chart for the top 10 scores

  const top10 = scores.slice(0, 10);

  const chartLabels = [];
  const chartData = [];
  for (let i = 0; i < top10.length; i++) {
    chartLabels.push(top10[i].username);
    chartData.push(top10[i].score);
  }

  document.getElementById('chart-wrap').classList.remove('hidden');

  new Chart(document.getElementById('scores-chart'), {

    type: 'bar',


    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Score',
        data: chartData,
        backgroundColor: '#555'
      }]
    },
    options: {

      scales: {

        y: { 
          min: 0, max: 10, ticks: { stepSize: 2 } 
        }

      },

      
      plugins: { 

        legend: { 
          display: false 
        } 
  
      }
    }
  });
}

loadLeaderboard();
