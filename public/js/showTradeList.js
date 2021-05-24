const boughtBox = document.getElementById('boughtBooksBox'); // 판매상품
const soldBox = document.getElementById('soldBooksBox'); // 구매상품
const sold_buy_Box = document.getElementById("soldBooks_buy_Box"); // 삽니다(판매)
const bought_buy_Box = document.getElementById('boughtBooks_buy_Box'); // 삽니다(구매)

function showSoldBox() {
    boughtBox.style.display = 'block';
    soldBox.style.display = sold_buy_Box.style.display = bought_buy_Box.style.display = 'none';
}

function showBoughtBox() {
    soldBox.style.display = 'block';
    boughtBox.style.display = sold_buy_Box.style.display = bought_buy_Box.style.display = 'none';
}

function showSoldBuyBox() {
    sold_buy_Box.style.display = 'block';
    boughtBox.style.display = soldBox.style.display = bought_buy_Box.style.display = 'none';
}

function showBoughtBuyBox() {
    bought_buy_Box.style.display = 'block';
    boughtBox.style.display = soldBox.style.display = sold_buy_Box.style.display = 'none';
}