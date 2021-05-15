function movePages() {
    const getPage = document.getElementById('inputPage').value;
    const maxPage = document.getElementById('maxPage').value;
    let addr = '/pages/community?page='

    console.log(getPage + " / " + maxPage);
    if(getPage > maxPage || getPage < 1)
        alert("번호를 재확인하세요");
    else
        window.location.href = addr.concat(getPage);
}