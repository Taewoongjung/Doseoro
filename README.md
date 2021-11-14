# 도서판매 웹사이트 
### 명지대학교 팀프로젝트2
* 배포 도메인: (https://doseoro.taewoongjung.xyz)
  
## < 팀 로고 > 
![logo_clear](https://user-images.githubusercontent.com/70272679/138470108-f52de0fd-d7c6-4eac-a868-2355e4731ca0.png)
 
<br>   
  
## < 이용 방법 >  
![image](https://user-images.githubusercontent.com/70272679/123265365-f0828280-d535-11eb-8cb9-55af9e65ca21.png)
![image](https://user-images.githubusercontent.com/70272679/123265401-faa48100-d535-11eb-97aa-bb5d07aab768.png)
![image](https://user-images.githubusercontent.com/70272679/123265450-098b3380-d536-11eb-8e68-1eb5af7a6069.png)
![image](https://user-images.githubusercontent.com/70272679/123265502-1445c880-d536-11eb-9857-2a23b0c97588.png)
![image](https://user-images.githubusercontent.com/70272679/123265524-1c056d00-d536-11eb-99c7-e71e3354184a.png)
             
              
## < 사용 기술 > 
* Backend: Express, Passport, AWS EC2, Route53, Multer
* Frontend: HTML, CSS, Nunjucks, Bootstrap 
* Database: Sequelize, mysql
  
## < 실행 방법 > 
  1. .env가 필요하므로 파일은 저한테 요청해주세요.
  2. 1번을 따라 .env 파일을 받으시면 터미널에 "npm i" 치고 엔터 후 "npx sequelize db:create"를 치고 엔터를 눌러주세요.
  3. 그 다음으로 " localhost:1000 "로 들어가시면 됩니다. 
  4. .env에 있는 DB_SECRET은 MySQL 비밀번호이므로 유저님의 비밀번호를 적어 넣으시면 됩니다.
 
## 💡 개요  
 ### 프로젝트의 목적
 이 프로젝트의 목적은 책을 전문으로 다루는 중고거래 website제작이다. 이용자 본인이 있는 위치를 기반으로 한 직거래와 택배를 이용한 거래의 두 가지 방식을 다 채택한다. 단순한 판매, 구매 뿐만이 아니라 무료 나눔, 커뮤니티 등의 기능을 추가하고, 기존 사이트에 없던 구매의사를 표현할 수 있는 기능도 추가하였다. 다양한 형태의 거래를 시행하고 커뮤니티를 통한 사용자들읠 정보 공유와 고객 문의를 이용한 웹사이트의 수정, 보완을 할 수 있다. 본 프로젝트는 이처럼 다양한 형태의 중고거래 구현을 목표로 한다.
  
 ### 프로젝트의 기대효과
 이용자는 도서명, 저자, 출판사를 중심으로 다양한 형태의 중고거래를 검색할 수 있으며, 카테고리 별로도 거래 현황을 볼 수 있다. 판매 외에도 구매자가 원하는 도서를 게시판에 올려 구매자 위주로의 거래가 활발하게 이루어질 수 있다. 또한 커뮤니티 게시글을 통한 도서의 정보를 다양하게 공유할 수 있으며, 이동경로에 따라 다양한 위치에서의 거래가 가능해 폭넓은 양의 직거래가 가능하다는점을 기대한다. 궁극적으로는 COVID-19 이후로 높아진 수요의 중고거래와 도서를 이용하여 또 다른 경제유통의 장을 열 수 있는 효과가 있다.

## 🗄 파일 구조  
* public
  * css - css files
  * img - image files
  * js - script files
* routes - router files
* views - HTML and nunjucks files
* config - Setting for linking sequelize and mysql
* models - sequelize table
* passport - passport strategy

## 💡 프로젝트 제안 내용
 ### 주요기능
번호|기능명|설명 
:---:|:---|---|
1|팝니다| 중고 도서를 판매할 수 있다.
2|삽니다| 도서 판매 요청 글을 남겨 판매자를 구할 수 있다.
3|무료 나눔| 책을 무료로 나눌 수 있다.
4|커뮤니티| 도서 후기, 궁금증 등을 글로 남겨 사용자 간의 소통이 가능하다.
5|검색 옵션| 도서명, 저자, 출판사 설정을 통해 원하는 도서를 검색할 수 있다.
6|메인 베너| 페이지 사용법, 추천도서를 확인할 수 있다.
7|로그인| 카카오, 구글 연동 로그인, 회원가입, ID 찾기, PW 찾기가 가능하다.
8|ID 찾기| 가입 시 기입한 전화번호를 입력하면 아이디를 알려준다.
9|PW 찾기| 닉네임과 보안 질문에 올바른 답을 입력하면 비밀번호 변경 페이지로 넘어간다.
10|도서 목록| 도서 사진, 도서 제목, 가격, 거래 지역이 노출되고 사진을 클릭하면 자세한 내용을 확인 할 수 있다.
11|정렬 필터| 내 위치를 기준으로 지역 범위를 설정하여 글을 검색할 수 있다.
12|관심 상품| 관심 상품으로 등록해 마이페이지에서 한 번에 조회할 수 있다.
13|거래 문의| 판매글 하단의 댓글을 통해 거래 문의가 가능하다.
14|거래 현황| 모든 거래 게시글에 대해 거래 완료 설정을 할 수 있고 거래 완료로 변경 시 댓글 작성자 중에 거래자를 선택하도록 한다.
15|도서 등록| 도서 사진, 제목, 저자, 출판사, 가격, 카테고리, 손상도, 흔적, 추가 정보, 거래방법을 입력해 판매 혹은 나눔 글을 등록할 수 있다.
16|고객 문의| 홈페이지 오류, 불편사항 등을 접수할 수 있다.
17|마이페이지| 판매내역, 구매내역, 관심 상품, 프로필 확인과 지역 설정, 고객 문의가 가능하다.
18|판매내역| 판매 현황(판매중 / 예약중 / 판매완료)에 따른 판매 도서를 확인할 수 있다.
19|구매내역| 거래한 도서를 확인할 수 있고 거래후기 작성이 가능하다.
20|프로필| 닉네임, 아이디, 비밀번호, 지역, 거래 후기 내용을 확인할 수 있다.
21|지역 설정| gps를 이용하여 거래 지역을 설정할 수 있다.

 ### 구현중 변경 내용
번호|기능명|제안내용|변경사항
:---:|:---|---|---|
1| 분야별 게시판| 카테고리를 기준으로 도서를 조회할 수 있는 메뉴|불필요한 기능으로 판단하여 삭제
2| 게시판 정렬 필터| 내지역/ 모든 지역/ 가격 순/ 최신 순 필터를 설정해 게시글 정렬| 게시판이 아닌 도서 검색에서 지역 범위를 선택할 수 있도록 변경
3| 판매내역, 구매내역 메뉴| 작성한 글과 거래 목록을 확인할 수 있는 메뉴| 작성한 글은 '내가 쓴 글' 메뉴, 거래 목록은 '거래 내역' 메뉴로 변경
4| 조회수| 제안 내용 없음| 각 게시글에 조회 수 측정 기능 추가
5| 댓글| 댓글을 통해 거래함| 더 원활한 소통을 위해 댓글에 추가 댓글을 작성할 수 있는 대댓글 기능 추가
6| 프로필 메뉴| 마이페이지 > 프로필에서 닉네임, 아이디, 지역, 거래 후기 확인 가능| 마이페이지에서 거래 지역 설정 가능, 프로필 메뉴 삭제
7| 거래 후기| 거래 완료 시 거래 후기 작성 가능| 개발 시간 부족으로 제외
8| 커뮤니티 게시판 세부 카테고리| 유저들이 도서를 서로 추천해주고 생각을 공유하는 장을 제공| 자유/ 서평/ 추천/ 질문 4가지의 세부 카테고리 추가
9| 알림| 좋아요, 댓글, 대댓글이 자신의 게시물에 적용되면 자신에게 알림이 오는 기능| 내 게시글에 댓글이 달리거나 관심 상품으로 설정 시 알림 
10| 메인 페이지 구성| 베너 + 최신 도서 4개로 구성| 베너 + 팝니다, 삽니다, 무료나눔 게시판 최신 등록 글 4개로 변경
11| 메인 페이지 베너| 최신 등록 글, 이용 매너, 인기글| 도서로 이용 매너, 인기글로 변경

 ## 💡 각 라우터 파일 소개
 ### 📂 config 폴더 안 파일
번호|파일명|설명|기능
:---:|:---|---|---|
1|config|프로젝트 설정을 담당한다.| DB설정/타임존/pool 설정

### 📂 route 폴더 안 파일들
번호|파일명|설명|기능
:---:|:---|---|---|
1|auth.js|모든 인증을 담당하고 있는 라우터들의 모임이다.| 회원가입, 로그인, 아이디 비밀번호 찾기
2|comment.js|팝니다, 삽니다, 무료나눔, 커뮤니티 게시판에 해당되는 댓글, 대댓글의 수정 삭제를 담당하고 있는 라우터들의 모임이다.| 대댓글 수정 삭제
3|customer.js|고객문의에 해당되는 기능을 담당하고 있는 라우터들의 모임이다.| 고객문의 등록/삭제/들어가기/수정, 댓글 대댓글 등록/수정/삭제
4|free_community.js|무료나눔에 해당되는 기능을 담당하고 있는 라우터들의 모임이다.| 무료나눔 등록/삭제/들어가기/수정, 댓글 대댓글 등록
5|index.js|초기화면에 들어갈 기능들, 팝니다 카테고리에 있는 기능을 담당하고 있는 라우터들의 모임이다.| 슬라이드 베너 물품 선정, 로그인 회원가입 거래내역 마이페이지 들어가기, 팝니다에 댓글 대댓글 등록/책 등록/좋아요
6|middlewares.js|로그인이 되었는지 안되어 있는지 확인하는 미들웨어의 모임이다.| 로그인 되어 있는지 아닌지 확인
7|mpfunc.js|마이페이지에 있는 기능을 하고 있는 라우터들의 모임이다.| 마이페이지에서 판매내역 삭제/수정, 자신 위치 등록
8|notification.js|알림 기능을 담당하고 있는 라우터들의 모임이다.| 각각의 게시판에서 자신의 게시물에 달리는 댓글/대댓글/좋아요 정보가 알림창에 등록됨, 해당 알림을 클릭하면 해당 화면으로 이동(이동 후 사라짐), '모두삭제' 버튼을 누르면 모든 알림 삭제
9|pages.js|모든 화면을 렌더를 당담하는 기능을 하는 라우터들의 모임이다.| 판매 책/무료나눔/구매 책/커뮤니티/판매내역/관심상품/작성글 목록/아이디찾기/비밀번호찾기/비밀번호변경/검색결과/고객문의 페이지 렌더링
10|search.js|카테고리 검색을 담당하는 기능을 하는 라우터가 있다.| 게시물명/책 제목/책 저자명/출판사명/커뮤니티 제목/전체 카테고리 검색
11|searchLoggedIn.js|로그인 후 카테고리 검색과 거리별 검색을 담당하는 라우터가 있다.| 게시물명/책 제목/책 저자명/출판사명/커뮤니티 제목/전체 카테고리로 검색 + 동/시/도/모든 지역 으로 검색
12|trade.js|팝니다, 삽니다 게시판 물품들을 거래할 때 댓글과 대댓글에 구매적용을 담당하고 있는 라우터들의 모임이다.| 팝니다/삽니다 댓글 대댓글에 구매하기 적용
13|wannabuy.js|삽니다에 해당되는 기능을 담당하고 있는 라우터들의 모임이다.| 삽니다 등록/삭제/(마이페이지에서)삭제/수정/들어가기/댓글 대댓글 등록

### 📂 model 폴더 안 파일
번호|파일명|설명 및 기능
:---:|:---|---|
1|index.js|MySQL과 Node와 sequelize를 연결을 담당한다.
2|community.js|communities 스키마를 설정한다.
3|complain.js|complains 스키마를 설정한다.
4|book.js|books 스키마를 설정한다.
5|post.js|posts 스키마를 설정한다.
6|user.js|users 스키마를 설정한다.
7|who.js|whose 스키마를 설정한다.

### 📂 passport 폴더 안 파일
번호|파일명|설명|기능
:---:|:---|---|---|
1|index.js|serializeUser와 deserializeUser가 있다.| 세션에 저장할 값들 설정하는 serializeUser와 브라우저로 부터 온 세션쿠키를 보고 아이디를 확인하여 req.user를 만드는 deserializeUser역할을 한다.
2|google.js|구글로 로그인 하는 담당을 한다.| 구글이 대신 인증
3|kakao.js|카카오로 로그인 하는 담당을 한다.| 카카오가 대신 인증
4|local.js|로컬로 로그인 하는 담당을 한다.| 이메일과 비밀번호로 

### 📂 public/js 폴더 안 파일
번호|파일명|설명 및 기능
:---:|:---|---|
1|areaRange.js|설정한 지역 범위에 해당하는 게시글을 조회
2|changePostingHistory.js|글 작성 내역을 카테고리별로 표시
3|checkFormat.js|회원가입 페이지에서 비밀번호 일치 여부 확인 및 핸드폰 번호 포맷을 적용
4|ckboxLimit.js|게시글 작성 시 선택할 수 있는 옵션의 갯수를 지정
5|notionEvent.js|알림 클릭 시 알림 창을 popup 함
6|popGuide.js|글 작성에서 등록된 사용자의 위치가 없으면 안내 문구를 표시
7|previewPost.js <br>previewPost2.js|등록한 사진의 미리 보기를 제공
8|showTradeList.js|판매, 구매 내역을 카테고리별로 표시
9|timestamp.js|작성시간과 현재 시간을 계산해 timestamp를 표시
10|topNav.js|페이지 하단의 footer
11|userLocation.js|Geolocation API로 사용자 위치를 받아 지도에 표시

### 📂 views 폴더 안 파일
번호|파일명|설명
:---:|:---|---|
1|bookRequest.html|삽니다 포스팅 리스트를 표시함
2|buyDetail.html|삽니다 상세 페이지
3|changePW.html|PW 변경 페이지
4|community.html|커뮤니티 포스팅 리스트 페이지
5|communityDetail.html|커뮤니티 포스팅 리스트를 표시함
6|csDetail.html|고객문의 상세 페이지
7|csList.html|고객문의 포스팅 리스트를 표시함
8|donationBoard.html|무료나눔 포스팅 리스트를 표시함
9|edit_buyDetail.html|삽니다 게시글 수정 페이지
10|edit_commuDetail.html|커뮤니티 게시글 수정 페이지
11|edit_freeDetail.html|무료나눔 게시글 수정 페이지
12|edit_saleDetail.html|팝니다 게시글 수정 페이지
13|error.html|에러 메세지
14|findID.html|ID 찾기 페이지
15|findPW.html|PW 찾기 페이지
16|index.html|메인 페이지
17|likedProduct.html|관심 상품 페이지
18|login.html|로그인 페이지
19|myPage.html|마이페이지
20|myPostingList.html|내가 쓴 글 페이지
21|registCommunity.html|커뮤니티 글 등록 페이지
22|registDonation.html|무료나눔 글 등록 페이지
23|registerBook.html|팝니다 글 등록 페이지
24|registRequest.html|삽니다 글 등록 페이지
25|saleBoard.html|팝니다 포스팅 리스트를 표시함
26|saleDetail.html|팝니다 상세 페이지
27|searchBox.html|비로그인 페이지 상단의 검색 바, 메뉴 리스트
28|searchBoxLoggedIn.html|로그인 한 경우 페이지 상단의 검색 바, 메뉴 리스트
29|searchList.html|검색 결과 페이지
30|signup.html|회원가입 페이지
31|topNavbar.html|페이지 상단의 도서로 마크, 알림, 메뉴
32|topNavbar2.html|상세 페이지 상단의 도서로 마크, 알림, 메뉴
33|tradeHistory.html|거래내역 페이지

 ### 📂 그 외 파일
번호|파일명|설명 및 기능
:---:|:---|---|
1|app.js|모든 라우터, 환경설정 을 담당하고 있는 서버의 센터
2|server.js|프로젝트 시작 백앤드(배포용)
3|package.js|프로젝트에서 사용된 모듈들 관리
4|.env|프로그램에 필요한 각종 비밀번호가 들어있는 

## 💡 추후 추가 구현할 것들
- [ ] 가격 순, 최신순 필터 적용

- [ ] 거래 후기

- [ ] 프로필 변경
 
 ## 💡 ER Diagram
 ![image](https://user-images.githubusercontent.com/70272679/122011853-83fdda00-cdf7-11eb-8ed9-0e3b5b472cee.png)

 ## 💡 DB 테이블 구조
 ※ 원하시는 테이블을 클릭하시면 링크로 이동합니다.
 
 * [books](https://github.com/Taewoongjung/TeamProject/blob/main/DB_books.md)
 * [users](https://github.com/Taewoongjung/TeamProject/blob/main/DB_users.md)
 * [posts](https://github.com/Taewoongjung/TeamProject/blob/main/DB_posts.md)
 * [communities](https://github.com/Taewoongjung/TeamProject/blob/main/DB_communities.md)
 * [whose](https://github.com/Taewoongjung/TeamProject/blob/main/DB_whose.md)
 * [complains](https://github.com/Taewoongjung/TeamProject/blob/main/DB_complains.md)
 
 
