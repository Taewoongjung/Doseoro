function notionClick(tf) {
    const notionList = document.getElementById('notionList');
    console.log("노션클릭");
    if(tf)
        notionList.style.display = 'block';
    else
        notionList.style.display = 'none';
}