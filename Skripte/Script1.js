var colors = ["Azure", "Blue", "Aquamarine", "DarkBlue", "LightBlue", "DarkSeaGreen","CornflowerBlue",
                "CadetBlue","DarkSlateBlue","DodgerBlue","LightSeaGreen","MidnightBlue","Navy"];
            var i = 1;
    
window.setInterval(function(){
    document.body.style.backgroundColor = colors[i];
    i++;
    if (i === colors.length){
        i=0;
    }
            
}, 18000);
