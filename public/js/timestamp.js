// 미구현
function changeTimeStamp() {
    // 포스트 한 시간을 받아와 Date형식으로 변환
    const postTime = document.getElementById("postingTime").value;
    const dateText = document.getElementById("getPostingDate");
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
        dateText.innerText = timediffDay + '일 전';
    else if (timediffDay == 0 && timediffHour > 0)
        dateText.innerText = timediffHour + '시간 전';
    else if (timediffDay == 0 && timediffHour == 0 && timediffMinute > 0)
        dateText.innerText = timediffMinute + '분 전';
    else if (timediffDay == 0 && timediffHour == 0 && timediffMinute == 0)
        dateText.innerText = '방금전';
    else
        dateText.innerText = postTime;
}
changeTimeStamp();