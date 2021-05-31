// 댓글 이벤트에 관한 JS

// 댓글 삭제 이벤트
function comment_delete(id) {
    const request = document.getElementById(`comment-ED-form-${id}`);
    let getPageAddr = location.href;

    let addrArr = ['community','complain','buybook','book']; //확인할 주소
    let getAddr = ['commu','customer','buy','']; //리턴할 주소

    for(let i = 0; i < addrArr.length; i++) {

        // addrArr에 포함되는 주소값 있는지 확인
        if(getPageAddr.indexOf(addrArr[i]) != -1) {
            if(i == 3) { //saleDetail(삽니다, 무료나눔)은 방식이 달라 재확인 필요
                request.setAttribute('action', '/comment/commentDelete');
                break;
            }
            // saleDetail 이외 getaddr에서 맞는 주소값 리턴
            request.setAttribute('action', '/comment/commentDelete_' + getAddr[i]);
            break;
        }
    }
    request.setAttribute('method', 'GET');
}