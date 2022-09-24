// Global selections and variables //
    const colorDivs = document.querySelectorAll(".color");
    const generateBtn = document.querySelector(".generate");
    const sliders = document.querySelectorAll("input[type=range]");
    const currentHexes = document.querySelectorAll(".color h2");
    let initialColors;








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
    });
}
randomColors();

//Check Text Contrast using Chroma lib

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5){
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
};



