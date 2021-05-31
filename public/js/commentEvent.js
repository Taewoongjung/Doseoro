// 댓글 이벤트에 관한 JS

/* 댓글 삭제 이벤트 */
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

// 댓글 수정 이벤트
function comment_edit(id) {
    var Com = prompt('수정 할 문구를 적어주세요');
    document.getElementById(`edit_it-${id}`).value = `${Com}`;
    const request = document.getElementById(`comment-ED-form-${id}`);

    let getPageAddr = location.href;
    let addrArr = ['community','complain','buybook','book']; //확인할 주소
    let getAddr = ['commu','customer','buy','']; //리턴할 주소

    let ckCom = Com.replace(/\s|  /gi, '');
    if (ckCom == '')
        alert("내용을 입력하세요");
    else {
        for(let i = 0; i < addrArr.length; i++) {
            if(getPageAddr.indexOf(addrArr[i]) != -1) {
                if(i == 3) {
                    request.setAttribute('action', `/comment/commentEdit?Com`);
                    break;
                }
                request.setAttribute('action', '/comment/commentEdit_' + getAddr[i] + '?Com');
                break;
            }
        }
        request.setAttribute('method', 'GET');
    }
}

// 대댓글 등록클릭 이벤트
function postReComment() {
    alert("대댓글 등록");
    window.location.reload();
}