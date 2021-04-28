// 미구현
function changeTimeStamp() {
    // 포스트 한 시간을 받아와 Date형식으로 변환
    const postTime = document.getElementById("postingTime").value;
    let postDate = new Date(postTime);
    const nowDate = new Date();

    // 현재 시간과 포스팅한 시간의 차이를 게산
    let timediff = nowDate - postDate;
    let timediffDay = Math.floor(timediff / (1000 * 3600 * 24));
    let timediffHour = Math.floor((timediff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let timediffMinute = Math.floor((timediff % (1000 * 60 * 60)) / (1000 * 60));
    let timediffSeconds = Math.floor((timediff % (1000 * 60)) / 1000);

    console.log(postDate);
    console.log(nowDate);
    console.log(timediffDay + "일 " + timediffHour + "시 " + timediffMinute + "분 " + timediffSeconds + " 초");

    if (timediffDay > 0 && timediffDay <= 7)
        console.log(timediffDay + "일 전");
    else if (timediffDay == 0 && timediffHour > 0)
        console.log(timediffHour + "시간 전");
    else if (timediffDay == 0 && timediffHour == 0)
        console.log(timediffMinute + "분 전");
    else if (timediffDay == 0 && timediffHour == 0 && timediffMinute == 0)
        console.log("방금전");
    else
        console.log(postTime);
}

// 테스트
function test() {
    // 포스트 한 시간을 받아와 Date형식으로 변환
    // const postTime = document.getElementById(`postingTime${id}`).value;
    const nowDate = new Date();

    const postingLen = `${communities}`;
    const postTime = new Array(postingLen);
    for (let i = 0; i < postingLen; i++) {
        postTime[i] = document.getElementById("postingTime-" + [i]).value;
        let postDate = new Date(postTime);
        console.log(postDate);

        // 현재 시간과 포스팅한 시간의 차이를 게산
        let timediff = nowDate - postDate;
        let timediffDay = Math.floor(timediff / (1000 * 3600 * 24));
        let timediffHour = Math.floor((timediff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let timediffMinute = Math.floor((timediff % (1000 * 60 * 60)) / (1000 * 60));
        let timediffSeconds = Math.floor((timediff % (1000 * 60)) / 1000);

        console.log(postDate);
        console.log(nowDate);
        console.log(timediffDay + "일 " + timediffHour + "시 " + timediffMinute + "분 " + timediffSeconds + " 초");

        // document.getElementById(`edit_it-${id}`).value = `${Com}`;

        if (timediffDay > 0 && timediffDay <= 7)
            console.log(timediffDay + "일 전");
        else if (timediffDay == 0 && timediffHour > 0)
            console.log(timediffHour + "시간 전");
        else if (timediffDay == 0 && timediffHour == 0)
            console.log(timediffMinute + "분 전");
        else if (timediffDay == 0 && timediffHour == 0 && timediffMinute == 0)
            console.log("방금전");
        else
            console.log(postTime);
    }
}
changeTimeStamp();