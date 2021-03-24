const request = document.getElementById('login-form');

const signup_btn = document.getElementById('login');
signup_btn.addEventListener('click', () => {
    request.setAttribute('action', '/auth/login');
    request.setAttribute('method', 'POST');
});