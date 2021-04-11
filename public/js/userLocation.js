// geolocation API
// 받아온 API 주소를 카카오맵 혹은 구글 맵에 마커표시하는 부분 추가해야함

// 기본적으로 윈도우에서 geolocation을 지원한다. 단, 지도에 표시하는건 맵 API를 가져와야한다.
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
        });
    } else {
        alert('GPS 미지원');
    }
}

// 카카오 맵
function success(position) {
    const mapContainer = document.getElementById('kakao_map');
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const map1 = document.getElementById('map1');
    const map2 = document.getElementById('map2');

    // map1.innerHTML = '<a>' + "나의 위치 : " + latitude + ' / ' + longitude + '</a>';
    mapContainer.style.display = 'block';
    mapOption = { 
        center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
        level: 6
    }
    const map = new kakao.maps.Map(mapContainer, mapOption); 
    // alert("현재위치 : " + latitude + ' / ' + longitude);
}

function error(error) {
    console.error(error);
}

// getLocation();