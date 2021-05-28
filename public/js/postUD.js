// 고객문의 게시글 수정
function complain_item_edit(id) {
    const request = document.getElementById(`complain_item-ED-form-${id}`);
    request.setAttribute('action', '/customer/editIt_complain');
    request.setAttribute('method', 'POST');
}

// 고객문의 게시글 삭제
function complain_item_delete(id) {
    const request = document.getElementById(`complain_item-ED-form-${id}`);
    request.setAttribute('action', '/customer/delete_customer');
    request.setAttribute('method', 'GET');
}

// 삽니다 수정
function buy_item_edit(id) {
    const request = document.getElementById(`buy_item-ED-form-${id}`);
    request.setAttribute('action', '/wannabuy/editIt');
    request.setAttribute('method', 'POST');
}

// 삽니다 삭제
function buy_item_delete(id) {
    const request = document.getElementById(`buy_item-ED-form-${id}`);
    request.setAttribute('action', '/wannabuy/delete');
    request.setAttribute('method', 'GET');
}

// 커뮤니티 수정
function community_item_edit(id) {
    const request = document.getElementById(`community_item-ED-form-${id}`);
    request.setAttribute('action', '/free_community/editIt_community');
    request.setAttribute('method', 'POST');
}

// 커뮤니티 삭제
function community_item_delete(id) {
    const request = document.getElementById(`community_item-ED-form-${id}`);
    request.setAttribute('action', '/free_community/delete_community');
    request.setAttribute('method', 'GET');
}

// 팝니다 수정
function sell_item_edit(id) {
    const request = document.getElementById(`sell_item-ED-form-${id}`);
    request.setAttribute('action', '/mpfunc/editIt_A');
    request.setAttribute('method', 'POST');
}
// 무료나눔 수정
function sell_item_edit2(id) {
    const request = document.getElementById(`sell_item-ED-form-${id}`);
    request.setAttribute('action', '/mpfunc/editIt_B');
    request.setAttribute('method', 'POST');
}
// 팝니다, 무료나눔 삭제
function sell_item_delete(id) {
    const request = document.getElementById(`sell_item-ED-form-${id}`);
    request.setAttribute('action', '/mpfunc/deleteInDetail');
    request.setAttribute('method', 'GET');
}