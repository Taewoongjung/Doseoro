function popupGuide(tf) {
    const popGuide = document.getElementById('popGuide');
    const popupBox = document.getElementById('popupBox');

    if(tf) 
        popupBox.style.display='table';
    else
        popupBox.style.display='none';
}

// 메인페이지 view guide팝업 이벤트
function popUpPage() {
    window.open('/pages/mainPopup','viewGuide','wideth=10px, height=100px');
}