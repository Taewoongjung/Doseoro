
const request = document.getElementById('signup-form');

const signup_btn = document.getElementById('signup');
signup_btn.addEventListener('click', () => {
    request.setAttribute('action', '/auth/signup');
    request.setAttribute('method', 'POST');
});