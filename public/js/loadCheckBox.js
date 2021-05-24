function loadCheck() {
    const getCate = document.getElementById('getCate').value;
    let strSplit = getCate.split(','); // 카테고리 목록을 ',' 단위로 나눔

    // 카테고리 id를 배열로 선언, 해당 id값을 저장
    const cateArr = [];
    const cateVal = [];
    for(let i = 1; i < 11; i++) {
        cateArr[i] = document.getElementById('book-category' + i);
        // console.log(cateArr[i]);
        cateVal[i] = document.getElementById('book-category' + i).value;
        // console.log(cateVal[i]);

        // strSplit값과 카테고리 값을 비교
        for(let j = 0; j < 3; j++) {
            if(strSplit[j] == cateVal[i]) {
                // console.log("맞습니다");
                cateArr[i].checked = true;
            }
        }
    }
}loadCheck();