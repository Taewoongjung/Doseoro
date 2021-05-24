// 카테고리 불러오기
function loadCheckCate() {
    const getCate = document.getElementById('getCate').value;
    let strSplit = getCate.split(','); // 카테고리 목록을 ',' 단위로 나눔

    // 카테고리 id를 배열로 선언, 해당 id값을 저장
    const cateArr = [];
    const cateVal = [];
    for(let i = 1; i < 11; i++) {
        cateArr[i] = document.getElementById('book-category' + i);
        cateVal[i] = document.getElementById('book-category' + i).value;

        // strSplit값과 카테고리 값을 비교
        for(let j = 0; j < 3; j++) {
            if(strSplit[j] == cateVal[i])
                cateArr[i].checked = true;
        }
    }
}

// 책 상태 불러오기
function loadCheckState() {
    const getState = document.getElementById('getState').value;
    let strSplit = getState.split(',');
    let strSplitLen = strSplit.length;

    const stateArr = [];
    const stateVal = [];
    for(let i = 1; i <= 5; i++) {
        stateArr[i] = document.getElementById('book-state' + i);
        stateVal[i] = document.getElementById('book-state' + i).value;

        for(let j = 0; j < strSplitLen; j++) {
            if(strSplit[j] == stateVal[i])
                stateArr[i].checked = true;
        }
    }
}

function loadtradeRoot() {
    const getMethod = document.getElementById('getTradeMethod').value;

    const tradeArr = [];
    const tradeVal = [];
    for(let i = 1; i <= 3; i++) {
        tradeArr[i] = document.getElementById('dealMethod' + i);
        tradeVal[i] = document.getElementById('dealMethod' + i).value;

        if(getMethod == tradeVal[i])
            tradeArr[i].selected = true;
    }
}

function init() {
    loadCheckCate();
    loadtradeRoot();
    loadCheckState();
}init();