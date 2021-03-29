function setInnerHTML() {
    const navInner = document.getElementById('topNav');
    // navInner.innerHTML ='<div class="container-fluid"><a class="navbar-brand" href="/"><img src="/img/logo3.png" width="200" height="80"></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse justify-content-sm-end" id="navbarCollapse"><ul class="navbar-nav mb-2 mb-md-0"><li class="nav-item"><a class="nav-link p-3" href="#">관심상품</a></li>{% if user and user.id %}<li class="nav-item"><a class="nav-link p-3">안녕하세요 {{user.nick}}님</a></li><li class="nav-item"><a class="nav-link p-3" href="/">마이페이지</a></li><li class="nav-item"><a class="nav-link p-3" href="#">관심상품</a></li><li class="nav-item"><a class="nav-link p-3" href="/auth/logout">로그아웃</a></li>{% else %}<li class="nav-item"><a class="nav-link p-3" href="/login">로그인</a></li>{% endif %}</ul></div></div>';
    // console.log('topNav 실행');
    
    const footerInner = document.getElementById('footerNav');
    footerInner.innerHTML = '<div class="w-50 ms-auto me-auto mt-2 text-center"><a class="navbar-brand fw-bold ms-auto me-auto" href="">도서로</a><div class="mt-4"><ul class="navbar-nav justify-content-center"><li class="nav-item ms-1 me-1"><a class="nav-link active" aria-current="page" href="/">홈</a></li><li class="nav-item ms-1 me-1"><a class="nav-link" href="#">고객문의</a></li><li class="nav-item dropup ms-1 me-1"><a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">개발자</a><ul class="dropdown-menu" aria-labelledby="dropdown10"><li><a class="dropdown-item m-1" href="#">배한조</a></li><li><a class="dropdown-item m-1" href="#">정태웅</a></li><li><a class="dropdown-item m-1" href="#">최현지</a></li><li><a class="dropdown-item m-1" href="#">황정현</a></li></ul></li></ul></div></div>';
}

function init() {
    setInnerHTML();
}
init();