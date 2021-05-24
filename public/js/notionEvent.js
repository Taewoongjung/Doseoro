function notionClick(tf) {
    const notionList = document.getElementById('notionList');
    if(tf)
        notionList.style.display = 'block';
    else
        notionList.style.display = 'none';
}