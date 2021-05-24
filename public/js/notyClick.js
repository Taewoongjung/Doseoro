function noty_click(id) {
    const request = document.getElementById(`Without-Commu-form-${id}`);
    request.setAttribute('action', '/notification/witoutCommu_first_click');
    request.setAttribute('method', 'GET');
}

function noty2_click(id) {
    const request = document.getElementById(`Without2-Commu-form-${id}`);
    request.setAttribute('action', '/notification/witoutCommu_second_click');
    request.setAttribute('method', 'GET');
}

function commu_noty_click(id) {
    const request = document.getElementById(`Commu-form-${id}`);
    request.setAttribute('action', '/notification/onlyCommu_first_click');
    request.setAttribute('method', 'GET');
}

function commu_noty2_click(id) {
    const request = document.getElementById(`Commu-form-${id}`);
    request.setAttribute('action', '/notification/onlyCommu_second_click');
    request.setAttribute('method', 'GET');
}

function like_noty_click(id) {
    const request = document.getElementById(`like-notice-form-${id}`);
    request.setAttribute('action', '/notification/notyLike_click');
    request.setAttribute('method', 'GET');
}
