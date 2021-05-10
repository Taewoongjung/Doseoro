// 지역 범위 프론트앤드
function rangeIntro() {
    const checkRange = document.getElementById('localRange').value;
    let getRage = document.getElementById('getRage');

    // 범위의 기본값은 모든지역
    if (checkRange == 0) 
            getRage.innerText = '동 / 리';
    else if (checkRange == 1) 
            getRage.innerText = '구 / 읍';
    else if (checkRange == 2) 
            getRage.innerText = '시 / 군';
    else 
            getRage.innerText = '모든 지역';

}

function showRange(id) {
    obj = document.getElementById(id);

    if(obj.style.display == 'none')
        obj.style.display = 'block';
    else
        obj.style.display = 'none';
}