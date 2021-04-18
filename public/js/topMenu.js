function goSaleBoard() {
    window.location.href = "/pages/saleBoard";
}
function goBookRequest() {
    window.location.href = "/pages/bookRequest";
}
function goDonationBoard() {
    window.location.href = "/pages/donationBoard";
}
function goCommunity() {
    window.location.href = "/pages/community";
}
function setTopMenu() {
    const topMenu = document.getElementById('topMenu');
    topMenu.innerHTML = '<div class="menuForm container mt-2 mb-2 justify-content-center d-flex" role="group"><div class="ms-1 me-1"><button type="button" class="btn fw-bold" onclick="goSaleBoard()" >팝니다</button></div><div class="ms-1 me-1"><button type="button" class="btn fw-bold" onclick="goBookRequest()">삽니다</button></div><div class="ms-1 me-1"><button type="button" class="btn fw-bold" onclick="goDonationBoard()">무료나눔</button></div><div class="ms-1 me-1"><button type="button" class="btn fw-bold" onclick="goCommunity()">커뮤니티</button></div></div>';
}
setTopMenu();