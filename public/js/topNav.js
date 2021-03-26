function setInnerHTML() {
    const navInner = document.getElementById('topNav');
    navInner.innerHTML ='<div class="container-fluid"><a class="navbar-brand" href="/"><img src="/img/logo3.png" width="200" height="80"></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse justify-content-sm-end" id="navbarCollapse"><ul class="navbar-nav mb-2 mb-md-0"><li class="nav-item"><a class="nav-link p-3" href="#">고객문의</a></li><li class="nav-item"><a class="nav-link p-3" href="#">관심상품</a></li><li class="nav-item"><a class="nav-link p-3" href="/login">로그인</a></li><li class="nav-item"><a class="nav-link p-3" href="/saleDetail">마이페이지</a></li></ul></div></div>';
    console.log('topNav 실행');
}
window.onload = () => {
    setInnerHTML();
}