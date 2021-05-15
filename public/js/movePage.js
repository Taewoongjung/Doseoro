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