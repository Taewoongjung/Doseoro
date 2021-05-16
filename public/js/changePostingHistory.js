const salePosting = document.getElementById('salePosting');
const requestPosting = document.getElementById('requestPosting');
const donatePosting = document.getElementById('donatePosting');
const communityPosting = document.getElementById('communityPosting');

// 로컬스토리지 저장 변수
let loadPage;

function showSale() {
    requestPosting.style.display = donatePosting.style.display = communityPosting.style.display = "none";
    salePosting.style.display = "block";

    loadPage = 'salePosting';
    // 로컬 스토리지에 page변수 저장
    localStorage.setItem('page', loadPage);
}

function showRequset() {
    salePosting.style.display = donatePosting.style.display = communityPosting.style.display = "none";
    requestPosting.style.display = "block";

    loadPage = 'requestPosting';
    localStorage.setItem('page', loadPage);
}

function showDonate() {
    requestPosting.style.display = salePosting.style.display = communityPosting.style.display = "none";
    donatePosting.style.display = "block";

    loadPage = 'donatePosting';
    localStorage.setItem('page', loadPage);
}

function showCommunity() {
    requestPosting.style.display = donatePosting.style.display = salePosting.style.display = "none";
    communityPosting.style.display = "block";

    loadPage = 'communityPosting';
    localStorage.setItem('page', loadPage);
}

// 로컬스토리지
function reloadPage() {
    // 로컬스토리지 내용 가져오기
    const getPage = localStorage.getItem('page');
    // 로컬스토리지 내용을 html id로 변환
    const pageId = document.getElementById(getPage);

    pageId.style.display = 'block';
}
reloadPage();