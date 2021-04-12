let cnt = 1;
const maxCnt = 3;
function ckLimit(ck) {
    if(ck.checked) {
        cnt += 1;
    } else {
        cnt -= 1;
    }
    
    if(cnt > maxCnt) {
        alert("최대 3개까지만 선택가능합니다");
        ck.checked = false;
        cnt -= 1;
    }
    console.log(cnt + " / " + maxCnt);
}