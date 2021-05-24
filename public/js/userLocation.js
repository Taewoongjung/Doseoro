// geolocation API

// 기본적으로 윈도우에서 geolocation을 지원한다. 단, 지도에 표시하는건 맵 API를 가져와야한다.
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, {
            // enableHighAccuracy 정확성 향상, 핸드폰 이용시 배터리소모량 커짐
            enableHighAccuracy : true,
            maximumAge: 0,
            timeout: 1000*10
        });
    } else {
        alert('Geolocation 미지원');
    }
}

// 카카오 맵

// 좌표를 주소로 변환하는 라이브러리 불러옴
const geocoder = new kakao.maps.services.Geocoder();

// geolocation 성공 코드
function success(position) {
    const mapContainer = document.getElementById('kakao_map');

    // 위도, 경도를 getLocation에서 가져옴
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // 카카오맵을 block형태로 표시
    mapContainer.style.display = 'block';
    mapOption = { 
        center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
        level: 4
    }
    const map = new kakao.maps.Map(mapContainer, mapOption); 

    // 좌표정보를 토대로 마커표시
    let markerPosition = new kakao.maps.LatLng(latitude, longitude);
    let marker = new kakao.maps.Marker({position:markerPosition});
    marker.setMap(map);

    // 주소정보값을 불러옴
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
}

// 좌표로 주소 검색
function searchAddrFromCoords(coords, callback) {
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
}

function redirection(address) {
    window.location.href=`/location?address=${address}`;
}

// 주소정보를 표시
function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        const infoDiv = document.getElementById('myAddr');
        const getInfo = document.getElementById('getMyAddr');
        const getInfo1 = document.getElementById('getFirstAddr');
        const getInfo2 = document.getElementById('getSecondAddr');
        const getInfo3 = document.getElementById('getThirdAddr');
        const getInfoAll = document.getElementById('getAllAddr');

        for(var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H'
            if (result[i].region_type === 'H') {

                infoDiv.innerHTML = '<a>나의 위치 : </a>' + result[i].address_name;
                getInfo.value = result[i].address_name;

                const getInfo_region_1 = result[i].region_1depth_name; // 시 도
                const getInfo_region_2 = result[i].region_2depth_name; // 구
                const getInfo_region_3 = result[i].region_3depth_name; // 면
                const getInfo_region_All = result[i].address_name; // 전체 주소
                getInfo1.value = getInfo_region_1;
                getInfo2.value = getInfo_region_2;
                getInfo3.value = getInfo_region_3;
                getInfoAll.value = getInfo_region_All;

                // - 출력 -
                console.log("getInfo.value = ", getInfo.value);
                console.log("getInfo1 = ", result[i].region_1depth_name);
                console.log("getInfo2 = ", result[i].region_2depth_name);
                console.log("getInfo3 = ", result[i].region_3depth_name);
                console.log("getInfoAll = ", result[i].address_name);
                alert("'위치설정하기' 버튼을 꼭 눌러주세요");
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.style.display = "block";

                redirection(getInfo.value);
                return
            }
        }
    }
}

function error(error) {
    console.error(error);
}

// getLocation();