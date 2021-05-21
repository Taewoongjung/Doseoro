<!-- 상단 바 / ~detail.html은 topNavbar2로 load하기-->
<nav class="navbar fixed-top navbar-expand-md navbar-light bg-white ps-3 pe-3" id="topNav">
    <div class="container-fluid">
        <a class="navbar-brand" href="/"><img src="/img/logo3.png" width="160" height="64"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse justify-content-sm-end" id="navbarCollapse">
            <ul class="navbar-nav mb-2 mb-md-0">
                {% if users and users.id %}
                <li class="nav-item">
                    <div onclick="notionClick(true)" class="nav-link btn notionBtn d-flex align-items-center">
                        <img src="/img/notionF.png" width="23px" alt="notionImg">
                        <p style="color:red">{% if noticess == 0 %}{% else %}!{% endif %}</p>
                    </div>
                    <div id="notionList" class="notionInner p-2">
                        <!-- 알림 테스트 -->
                        <ul class="m-2"><a class="notionBtn p-2" onclick="notionClick(false)">close</a></ul>

                        {% if noticess == 0 %}
                        <p class="ms-3">아주 조용합니다..</p>
                        {% else %}
                        <div id="listAll">
                            {% for notice in noticess %}
                            <ul id="list-{{notice.id}}" class="mb-3">
                                {% if notice.BookId == null %}
                                {% if notice.reCommentNick == null %}
                                <form id="Commu-form-{{notice.id}}" class="d-flex">
                                    <input type="hidden" name="community_Id" value="{{notice.id}}">
                                    <input type="hidden" name="theURL" value="{{notice.thisURL}}">
                                    <div class="d-flex">
                                        <button id="cancel" class="delBtn" type="submit"
                                            onclick="commu_noty_delete('{{notice.id}}')">x</button>
                                        <button type="submit" class="notionMsg" onclick="">
                                            [커뮤니티] {{notice.commentingNick}} 님이 댓글을 달았습니다.
                                        </button>
                                    </div>
                                </form>
                                {% endif %}
                                {% if notice.commentingNick == null %}
                                <form id="Commu-form-{{notice.id}}" class="d-flex">
                                    <input type="hidden" name="community_Id" value="{{notice.id}}">
                                    <input type="hidden" name="theURL" value="{{notice.thisURL}}">
                                    <div class="d-flex">
                                        <button id="cancel" class="delBtn" type="submit"
                                            onclick="commu_noty_delete('{{notice.id}}')">x</button>
                                        <button type="submit" class="notionMsg" onclick="">
                                            [커뮤니티] {{notice.reCommentNick}} 님이 답글을 달았습니다.
                                        </button>
                                    </div>
                                </form>
                                {% endif %}
                                {% elif notice.commentingNick == null %}
                                <form id="Without-Commu-form-{{notice.id}}" class="d-flex">
                                    <input type="hidden" name="notCommunity_Id" value="{{notice.id}}">
                                    <input type="hidden" name="theURL" value="{{notice.thisURL}}">
                                    <div class="d-flex">
                                        <button id="cancel" class="delBtn" type="submit"
                                            onclick="noty_delete('{{notice.id}}')">x</button>
                                        <button type="submit" class="notionMsg"
                                            onclick="commu_noty2_click('{{notice.id}}')">
                                            [답글] {{notice.reCommentNick}} 님이 답글을 달았습니다.
                                        </button>
                                    </div>
                                </form>
                                {% elif notice.commentingNick %}
                                <form id="Without2-Commu-form-{{notice.id}}" class="d-flex">
                                    <input type="hidden" name="notCommunity_Id" value="{{notice.id}}">
                                    <input type="hidden" name="theURL" value="{{notice.thisURL}}">
                                    <div class="d-flex">
                                        <button id="cancel" class="delBtn" type="submit"
                                            onclick="noty2_delete('{{notice.id}}')">x</button>
                                        <button type="submit" class="notionMsg" onclick="noty2_click('{{notice.id}}')">
                                            [댓글] {{notice.commentingNick}} 님이 댓글을 달았습니다.
                                        </button>
                                    </div>
                                </form>
                                {% endif %}
                            </ul>
                            {% endfor %}
                            {% for likenotice in likesfornotice %}
                            <ul id="listLike-{{likenotice.id}}">
                                <form id="like-notice-form-{{likenotice.id}}">
                                    <input type="hidden" name="Like_Id" value="{{likenotice.id}}">
                                    <input type="hidden" name="theURL_like" value="{{likenotice.thisURL}}">
                                    <div class="nav-link">
                                        <button id="cancel" class="delBtn" type="submit"
                                            onclick="like_noty_delete('{{likenotice.id}}')">x</button>
                                        <button type="submit" class="notionMsg"
                                            onclick="like_noty_click('{{likenotice.id}}')">
                                            [좋아요] {{likenotice.likedNick}} 님이 회원님의 게시물을 찜 했습니다.
                                        </button>
                                    </div>
                                </form>
                            </ul>
                            {% endfor %}
                            <!-- 모두삭제 /  -->
                            <form id="deleteAll">
                                <ul class="ms-1" id="delAll">
                                    <button id="cancel" class="delBtn p-2" type="submit" onclick="delAll()">모두
                                        삭제</button>
                                </ul>
                            </form>
                        </div>
                        {% endif %}
                    </div>
                </li>

                <li class="nav-item"><a class="nav-link p-3">안녕하세요 {{users.nick}}님</a></li>
                <li class="nav-item"><a class="nav-link p-3" href="/pages/like">관심상품</a></li>
                <li class="nav-item"><a class="nav-link p-3" href="/mypage">마이페이지</a></li>
                <li class="nav-item"><a class="nav-link p-3" href="/auth/logout">로그아웃</a></li>
                {% else %}
                <li class="nav-item"><a class="nav-link p-3" href="/login">로그인</a></li>{% endif %}
            </ul>
        </div>
    </div>

    <script src="/js/notionEvent.js"></script>
    <script src="/js/notyClick.js"></script>
    <script>
        function commu_noty_delete(id) {
            const request = document.getElementById(`Commu-form-${id}`);
            const notionId = document.getElementById(`list-${id}`);
            notionId.style.display = 'none';
            request.setAttribute('action', '/notification/onlyCommu');
            request.setAttribute('method', 'GET');
        }

        function noty_delete(id) {
            const request = document.getElementById(`Without-Commu-form-${id}`);
            const notionId = document.getElementById(`list-${id}`);
            notionId.style.display = 'none';
            request.setAttribute('action', '/notification/witoutCommu');
            request.setAttribute('method', 'GET');
        }

        function noty2_delete(id) {
            const request = document.getElementById(`Without2-Commu-form-${id}`);
            const notionId = document.getElementById(`list-${id}`);
            notionId.style.display = 'none';
            request.setAttribute('action', '/notification/witoutCommu');
            request.setAttribute('method', 'GET');
        }
        function like_noty_delete(id) {
            const request = document.getElementById(`like-notice-form-${id}`);
            const notionId = document.getElementById(`listLike-${id}`);
            notionId.style.display = 'none';
            request.setAttribute('action', '/notification/notyLike');
            request.setAttribute('method', 'GET');
        }

        // 모두 삭제 기능
        function delAll() {
            const request = document.getElementById('deleteAll');
            const allNotion = document.getElementById('listAll');
            allNotion.style.display = 'none';
            request.setAttribute('action', '/notification/deleteAll');
            request.setAttribute('method', 'GET');
        }
    </script>
</nav>