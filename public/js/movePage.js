function movePagesCommu() {
    const getPage = document.getElementById('inputPage').value;
    const maxPage = document.getElementById('maxPage').value;
    let addr = '/pages/community?page='

    if(getPage > maxPage || getPage < 1)
        alert("번호를 재확인하세요");
    else
        window.location.href = addr.concat(getPage);
}

function movePagesSale() {
    const getPage = document.getElementById('inputPage').value;
    const maxPage = document.getElementById('maxPage').value;
    let addr = '/pages/saleBoard?page='

    if(getPage > maxPage || getPage < 1)
        alert("번호를 재확인하세요");
    else
        window.location.href = addr.concat(getPage);
}

function movePagesRequest() {
    const getPage = document.getElementById('inputPage').value;
    const maxPage = document.getElementById('maxPage').value;
    let addr = '/pages/bookRequest?page='

    if(getPage > maxPage || getPage < 1)
        alert("번호를 재확인하세요");
    else
        window.location.href = addr.concat(getPage);
}

function movePagesFree() {
    const getPage = document.getElementById('inputPage').value;
    const maxPage = document.getElementById('maxPage').value;
    let addr = '/pages/donationBoard?page='

    if(getPage > maxPage || getPage < 1)
        alert("번호를 재확인하세요");
    else
        window.location.href = addr.concat(getPage);
}

// 페이징 리다이렉트 초기화
function redirectPage() {
    // split을 기준으로 문자를 배열로 나눔
    const nowPage = document.location.href.split("?");
    let movePage
    const findStr = "myPostingList?page=1";
    console.log(nowPage);

    // 1번째 배열의 값으로 페이징 적용 유무 판단
    if(nowPage[1] == null) {
        movePage = document.location.href + '?page=1';

        // myPostingList는 페이징 동작이 다르기 때문에 추가 확인 필요
        if(movePage.indexOf(findStr) != -1)
            movePage = document.location.href + '?pageSale=1';

        location.replace(movePage);
    }
    else
        console.log("정상 리다이렉트");
}redirectPage();