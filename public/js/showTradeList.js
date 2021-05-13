const boughtBox = document.getElementById('boughtBooksBox'); // 판매상품
const soldBox = document.getElementById('soldBooksBox'); // 구매상품
const sold_buy_Box = document.getElementById("soldBooks_buy_Box"); // 삽니다(판매)
const bought_buy_Box = document.getElementById('boughtBooks_buy_Box'); // 삽니다(구매)

function showSoldBox() {
    boughtBox.style.display = 'block';
    soldBox.style.display = 'none';
    sold_buy_Box.style.display = 'none';
    bought_buy_Box.style.display = 'none';
}

function showBoughtBox() {
    boughtBox.style.display = 'none';
    soldBox.style.display = 'block';
    sold_buy_Box.style.display = 'none';
    bought_buy_Box.style.display = 'none';
}

function showSoldBuyBox() {
    boughtBox.style.display = 'none';
    soldBox.style.display = 'none';
    sold_buy_Box.style.display = 'block';
    bought_buy_Box.style.display = 'none';
}

function showBoughtBuyBox() {
    boughtBox.style.display = 'none';
    soldBox.style.display = 'none';
    sold_buy_Box.style.display = 'none';
    bought_buy_Box.style.display = 'block';
}