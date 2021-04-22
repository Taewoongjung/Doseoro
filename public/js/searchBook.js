function one() {
    const request = document.getElementById('search-form');
    request.setAttribute('action', '/search{{searchWord}}');
    request.setAttribute('method', 'GET');
}