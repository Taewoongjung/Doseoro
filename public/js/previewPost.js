
// 프리뷰
function readImg(input) {
    if (input.files && input.files[0]) {
        // 파일 리더로 파일 읽는 역할
        const reader = new FileReader();

        reader.onload = e => {
            const nowimage = document.getElementById('nowimage');
            nowimage.src = e.target.result;
        }

        // 리더 이미지 읽기
        reader.readAsDataURL(input.files[0])
    }
}

// 파일 개수 제한
function checkLimit(num) {
    const ckPhoto = document.getElementById('ckPhoto');
    const registBtn = document.getElementById('registBtn');

    if(num > 5) {
        ckPhoto.innerHTML = '<p class="text-danger fw-bold">사진은 최대 5개 까지 등록 가능합니다!</p>';
        registBtn.disabled = 'disabled';
    } else {
        ckPhoto.removeChild(ckPhoto.childNodes[0]);
        registBtn.disabled = false;
    }
}
const inputImg = document.getElementById('book-photo');
inputImg.addEventListener("change", e => {
    readImg(e.target);
    checkLimit(inputImg.files.length);
})