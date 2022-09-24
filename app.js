// Global selections and variables //
    const colorDivs = document.querySelectorAll(".color");
    const generateBtn = document.querySelector(".generate");
    const sliders = document.querySelectorAll("input[type=range]");
    const currentHexes = document.querySelectorAll(".color h2");
    let initialColors;


// EVENT LISTENERS
//Get each individual slider and attach event listener to input 
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});

//Update Div text
colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
        updateTextUi(index);
    });
});




// Functions //


//  Color generator without library(training)
// function generateHex(){
// const letters = "0123456789ABCDEF";
// let hash = "#";
// for (let i = 0; i < 6; i++){
//     hash += letters[Math.floor(Math.random() * 16)]
// }
//     return hash;    
// }
// let randomHex = generateHex();


//Color generator using Chroma lib
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}


//Assign random color to div and div h2
function randomColors(){
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        //Add the color to bg and text
        div.style.background = randomColor;
        hexText.innerText = randomColor;

        //Check for contrast 
        checkTextContrast(randomColor, hexText);

        //Initial colorize sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });
}


//Check Text Contrast using Chroma lib
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5){
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
};

//Colorize Sliders
function colorizeSliders(color, hue, brightness, saturation){

    //Scale Saturation
    const noSat = color.set("hsl.s",0);
    const fullSat = color.set("hsl.s",1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    //Scale Brightness
    const midBright = color.set("hsl.l",0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]); 
    
    
    //Update Input Colors
    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)}, ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204, 204, 75), rgb(74,204,74), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75, 75) )`
}


//Set Div bg color
function hslControls(e){
    const index = e.target.getAttribute("data-bright") || e.target.getAttribute("data-sat") || e.target.getAttribute("data-hue") ;
    
    let sliders = e.target.parentElement.querySelectorAll("input[type=range]");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = colorDivs[index].querySelector("h2").innerText;


    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    colorDivs[index].style.backgroundColor = color;    
}


//Update text UI
function updateTextUi(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();

    //Check contrast
    checkTextContrast(color, textHex);
    for (icon of icons){
        checkTextContrast(color, icon);
    }
}



//Funtions being called
randomColors(); 