// 지역 범위 프론트앤드
function rangeIntro() {
        const checkRange = document.getElementById('localRange').value;
        let getRage = document.getElementById('getRage');
        const checkRangeValue = document.getElementById('localRangeValue');

        // 범위의 기본값은 모든지역
        if (checkRange == 0) {
                getRage.innerText = '동 / 리';
                checkRangeValue.value = 0;
        }
        else if (checkRange == 1) {
                getRage.innerText = '구 / 읍';
                checkRangeValue.value = 1;
        }
        else if (checkRange == 2) {
                getRage.innerText = '시 / 도';
                checkRangeValue.value = 2;
        }
        else {
                getRage.innerText = '모든 지역';
                checkRangeValue.value = 3;
        }
}

function showRange(id) {
        obj = document.getElementById(id);

        if (obj.style.display == 'none')
                obj.style.display = 'block';
        else
                obj.style.display = 'none';
}