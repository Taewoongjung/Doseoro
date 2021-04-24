function popupGuide(tf) {
    const popGuide = document.getElementById('popGuide');
    const popupBox = document.getElementById('popupBox');

    if(tf) 
        popupBox.style.display='table';
    else
        popupBox.style.display='none';
    
    console.log("hover");
}