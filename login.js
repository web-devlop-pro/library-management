function mockLogin(event) {
  event.preventDefault();

  const rollNo = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('loginMessage');
  const loginBox = document.querySelector('.login-box');

  // Mock credentials (replace with real DB/auth later)
  const validRollNo = '2023001';
  const validPass = '016';

  if (rollNo === validRollNo && password === validPass) {
    message.style.color = 'lightgreen';
    message.textContent = 'Login Successful! Redirecting...';
    message.classList.add('login-success');
    loginBox.classList.add('success');
    
    setTimeout(() => {
      window.location.href = 'index.html'; // Redirect to dashboard or main site
    }, 1500);
  } else {
    message.style.color = 'red';
    message.textContent = 'Invalid roll number or password.';
    message.classList.remove('login-success');
    loginBox.classList.remove('success');
  }
}

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleButton = document.querySelector('.toggle-password');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleButton.textContent = '👁️';
  } else {
    passwordInput.type = 'password';
    toggleButton.textContent = '👁';
  }
}
