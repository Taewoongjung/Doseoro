function loadCate() {
    const nowCate = document.getElementById('commuCate').value;
    const commuArr = [];
    const commuVal = [];

    for(let i = 1; i <= 4; i++) {
        commuArr[i] = document.getElementById('commuCategory'+i);
        commuVal[i] = document.getElementById('commuCategory'+i).value;

        if(nowCate == commuVal[i])
            commuArr[i].selected = true;
    }
}loadCate();