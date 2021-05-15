function movePages() {
    const getPage = document.getElementById('inputPage').value;
    let addr = '/pages/community?page='
    console.log(addr.concat(getPage));
    
    window.location.href = addr.concat(getPage);
}