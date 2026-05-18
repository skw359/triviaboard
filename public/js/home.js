document.getElementById('start-btn').addEventListener('click', () => {


  const username = document.getElementById('username').value.trim();
  const category = document.getElementById('category').value;
  const difficultyLevel = document.getElementById('difficulty').value;
  const errorMessage = document.getElementById('error-msg');

  if (!username) {
    errorMessage.classList.remove('hidden');
    return;
  }

  
  errorMessage.classList.add('hidden');

  const params = new URLSearchParams({ username, category, difficulty: difficultyLevel });
  window.location.href = `/play.html?${params.toString()}`;


});
