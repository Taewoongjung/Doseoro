window.onload = () => {
  if (new URL(location.href).searchParams.get('loginError')) {
    alert(new URL(location.href).searchParams.get('loginError'));
  }
}

const request = document.getElementById('login-form');

const signup_btn = document.getElementById('login');
signup_btn.addEventListener('click', () => {
    request.setAttribute('action', '/auth/login');
    request.setAttribute('method', 'POST');
})