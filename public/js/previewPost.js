
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

const inputImg = document.getElementById('book-photo');
inputImg.addEventListener("change", e => {
    readImg(e.target)
})