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
const geocoder = new kakao.maps.services.Geocoder();

function success(position) {
    const mapContainer = document.getElementById('kakao_map');
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    mapContainer.style.display = 'block';
    mapOption = { 
        center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
        level: 5
    }
    const map = new kakao.maps.Map(mapContainer, mapOption); 

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

        for(var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H'
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = '<a>나의 위치 : </a>' + result[i].address_name;
                getInfo.value = result[i].address_name;
                console.log("getInfo.value = ", getInfo.value);
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