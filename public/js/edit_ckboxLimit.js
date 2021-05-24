let cnt = 0;
const cateBox = []
for(let i = 1; i<11; i++) {
    cateBox[i] = document.getElementById('book-category'+i);
    if(cateBox[i].checked == true)
        cnt++;
}

const maxCnt = 3;
function ckLimit(ck) {
    if(ck.checked)
        cnt += 1;
    else
        cnt -= 1;
    
    if(cnt > maxCnt) {
        alert("최대 3개까지만 선택가능합니다");
        ck.checked = false;
        cnt -= 1;
    }
    console.log(cnt + " / " + maxCnt);
}