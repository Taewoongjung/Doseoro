//회원가입 페이지 비밀번호 일치여부 판단
function checkPwd() {   
    const userPassword = document.getElementById('userPassword');
    const userPasswordCheck = document.getElementById('userPasswordCheck');
    const pwdCheck = document.getElementById('pwdCheck');
     
    if (userPassword.value != userPasswordCheck.value) {
        pwdCheck.innerHTML = "<a>비밀번호 불일치</a>";
    } else if (userPassword.value == userPasswordCheck.value) {
        pwdCheck.innerHTML = '<a>비밀번호 일치</a>';
    } else {
        alert('에러!');
    }
}

//회원가입 페이지 핸드폰 번호 자동 '-' 입력
function telFormat(str) {
    let inputPhone = document.getElementById('inputPhone');
    inputPhone = inputPhone.value.split('-').join('');

    let lastNum = inputPhone.replace(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/, '$1$2$3-$4$5$6$7-$8$9$10$11');
    document.getElementById('inputPhone').value = lastNum;
}

// 검색 필터
function checkText() {
    const searchText = document.getElementById('book-publisher').value;
    const submitBtn = document.getElementById('submitBtn');

    let convText = searchText.replace(/\s|  /gi, '');
    if (convText == '')
        submitBtn.disabled = true;
    else
        submitBtn.disabled = false;
}