document.getElementById('start-btn').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const category = document.getElementById('category').value;
  const difficulty = document.getElementById('difficulty').value;
  const errorMsg = document.getElementById('error-msg');

  if (!username) {
    errorMsg.classList.remove('hidden');
    return;
  }
  errorMsg.classList.add('hidden');

  const params = new URLSearchParams({ username, category, difficulty });
  window.location.href = `/play.html?${params.toString()}`;
});
