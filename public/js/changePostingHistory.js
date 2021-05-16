const salePosting = document.getElementById('salePosting');
const requestPosting = document.getElementById('requestPosting');
const donatePosting = document.getElementById('donatePosting');
const communityPosting = document.getElementById('communityPosting');

function showSale() {
    console.log('판매클릭');

    requestPosting.style.display = donatePosting.style.display = communityPosting.style.display = "none";
    salePosting.style.display = "block";
}

function showRequset() {
    salePosting.style.display = donatePosting.style.display = communityPosting.style.display = "none";
    requestPosting.style.display = "block";
}

function showDonate() {
    console.log('나눔클릭');

    requestPosting.style.display = salePosting.style.display = communityPosting.style.display = "none";
    donatePosting.style.display = "block";
}

function showCommunity() {
    console.log('커뮤클릭');

    requestPosting.style.display = donatePosting.style.display = salePosting.style.display = "none";
    communityPosting.style.display = "block";
}