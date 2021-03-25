window.onload = () => {
    console.log("@@@");
    const param = (new URL(location.href)).searchParams;
    const error_param = param.get('signupError');
    const success_param = param.get('signupSuccess');
    if(error_param){
        alert(error_param);
    }
    else if(success_param){
        alert(success_param);
        location.href="/";
    }
};

const request = document.getElementById('signup-form');

const signup_btn = document.getElementById('signup');
signup_btn.addEventListener('click', () => {
    request.setAttribute('action', '/auth/signup');
    request.setAttribute('method', 'POST');
});