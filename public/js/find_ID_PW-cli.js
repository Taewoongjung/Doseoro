const request = document.getElementById('findID-form');

const signup_btn = document.getElementById('find');
signup_btn.addEventListener('click', () => {
    request.setAttribute('action', '/auth/ID');
    request.setAttribute('method', 'POST');
});
