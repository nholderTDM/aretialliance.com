// Login functionality
loginBtn.addEventListener('click', function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (!username || !password) {
      errorAlert.textContent = 'Username and password are required';
      errorAlert.classList.remove('hidden');
      return;
  }
  
  // Show loading indicator
  const originalBtnText = loginBtn.innerHTML;
  loginBtn.innerHTML = '<div class="loading-spinner mx-auto"></div>';
  loginBtn.disabled = true;
  
  // Call authentication endpoint - use your existing endpoint from server.js
  fetch('/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Authentication failed');
      }
      return response.json();
  })
  .then(data => {
      if (!data.success) {
          throw new Error('Authentication failed');
      }
      
      // Store the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Show dashboard
      showDashboard();
  })
  .catch(error => {
      console.error('Login error:', error);
      errorAlert.textContent = 'Invalid username or password';
      errorAlert.classList.remove('hidden');
  })
  .finally(() => {
      // Reset button state
      loginBtn.innerHTML = originalBtnText;
      loginBtn.disabled = false;
  });
});