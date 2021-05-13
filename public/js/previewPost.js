
// 프리뷰
// function readImg(input) {
//     if (input.files && input.files[0]) {
//         // 파일 리더로 파일 읽는 역할
//         const reader = new FileReader();

//         reader.onload = e => {
//             const nowimage = document.getElementById('nowimage');
//             nowimage.src = e.target.result;
//         }

//         // 리더 이미지 읽기
//         reader.readAsDataURL(input.files[0])
//     }
// }

// 파일 개수 제한
function checkLimit(num) {
    const ckPhoto = document.getElementById('ckPhoto');
    const registBtn = document.getElementById('registBtn');

    if (num > 5) {
        ckPhoto.innerHTML = '<p class="text-danger fw-bold">사진은 최대 5개 까지 등록 가능합니다!</p>';
        registBtn.disabled = 'disabled';
    } else {
        ckPhoto.removeChild(ckPhoto.childNodes[0]);
        registBtn.disabled = false;
    }
}
// const inputImg = document.getElementById('book-photo');
// inputImg.addEventListener("change", e => {
//     readImg(e.target);
//     checkLimit(inputImg.files.length);
// })

// 멀티 프리뷰 (flex, fix 방식 결정필요), fix방식
function readImg(input) {
    const nowimage = document.getElementById('nowimage');

    if (input.files && input.files[0]) {
        const fileArr = Array.from(input.files);
        const $colDiv1 = document.createElement("div");
        const $colDiv2 = document.createElement("div");
        // $colDiv1.classList.add("column");
        // $colDiv2.classList.add("column");

        // 배열로 파일을 차례로 읽어 태그 생성
        fileArr.forEach((file, index) => {
            // 파일 리더로 파일 읽는 역할
            const reader = new FileReader();

            const $imgDiv = document.createElement("div");
            const $img = document.createElement("img");
            $img.classList.add("image");
            $imgDiv.classList.add("imageBox");

            const $label = document.createElement("label");
            $label.classList.add("imageLabel");
            $label.textContent = file.name;

            $imgDiv.appendChild($img);
            $imgDiv.appendChild($label);

            reader.onload = e => {
                $img.src = e.target.result;
                // $imgDiv.style.width = 200 + "px";
                // $imgDiv.style.height = 200 + "px";
            }

            if (index % 2 == 0)
                $colDiv1.appendChild($imgDiv);
            else
                $colDiv2.appendChild($imgDiv);

            // 리더 이미지 읽기
            reader.readAsDataURL(file);
            // nowimage.appendChild($imgDiv);
        })
        nowimage.appendChild($colDiv1);
        nowimage.appendChild($colDiv2);
    }
}

// 이벤트 감지
const inputImg = document.getElementById('book-photo');
inputImg.addEventListener("change", e => {
    readImg(e.target)
    checkLimit(inputImg.files.length);
})

// 파일 새로 등록 할때마다 리셋
function clearImg() {
    const nowimage = document.getElementById('nowimage');
    while(nowimage.hasChildNodes()) {
        nowimage.removeChild(nowimage.firstChild);
    }
}