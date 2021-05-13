function pagination(totalPost, currentPage) {
    const postPage = 10;
    const pageCount = 5;

    // 총 페이지
    const postNum = Math.ceil(totalPost / postPage);
    // 페이지 그룹
    const pageGroup = Math.ceil(currentPage / pageCount);

    // 마지막 페이지 번호
    let last = pageGroup * pageCount;
    if(last > postNum)
        last = postNum;

    let first = last - (pageCount - 1);
    const next = last + 1;
    const prev = first + 1;

    if(postNum < 1)
        first = last;
    
    const pages = document.getElementById('Postpages');
    pages.empty();

    // 프리뷰 버튼 생성
    if(first > 5) {
        pages.append("<li class='page-item'><a onclick=\"GetTarget(" + (prev) +");\" class='page-link' href='#' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>");
    }
    for(let j = first; j <= last; j++) {
        if(currentPage == j) {
            pages.append("<li class='page-item active'><a onclick=\"GetTarget(" + j + ");\" class='page-link' href='#'>" + j + "</a></li>");
        } else if(j > 0) {
            pages.append("<li class='page-item'><a onclick=\"GetTarget(" + j + ");\" class='page-link' href='#'>" + j + "</a></li>");
        }
    }
    if(next > 5 && next < postNum) {
        pages.append("<li class='page-item'><a onclick=\"GetTarget(" + (next) +");\" class='page-link' href='#' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>");
    }
}