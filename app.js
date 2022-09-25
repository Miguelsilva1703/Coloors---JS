// Global selections and variables //
    const colorDivs = document.querySelectorAll(".color");
    const generateBtn = document.querySelector(".generate");
    const sliders = document.querySelectorAll("input[type=range]");
    const currentHexes = document.querySelectorAll(".color h2");
    const popup = document.querySelector('.copy-container');
    const adjustButton = document.querySelectorAll(".adjust");
    const lockButton = document.querySelectorAll(".lock");
    const closeAdjustments = document.querySelectorAll(".close-adjustment");
    const sliderContainers = document.querySelectorAll(".sliders");
    let initialColors;


// EVENT LISTENERS

//Generate random palete button
generateBtn.addEventListener("click", randomColors);

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

//Copy hex to clipboard
currentHexes.forEach(hex => {
    hex.addEventListener('click', () => {
        copyToClipboard(hex);
    })
})
popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popup.classList.remove('active');
    popupBox.classList.remove('active');
})
//Open adjustment panel(toggle)
adjustButton.forEach((button, index) => {
    button.addEventListener("click", () => {
        openAdjustmentPanel(index);
    })
})
//Close adjustment panel(x)
closeAdjustments.forEach((button, index) => {
    button.addEventListener("click", () =>{
        closeAdjustmentPanel(index)
    })
})

lockButton.forEach((button, index) => {
    button.addEventListener("click", e => {
      lockLayer(e, index);
    });
  });






// Functions //

//Color generator using Chroma lib
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}

//Assign random color to div and div h2
function randomColors() {
    //Set Initial colors array
    initialColors = [];

    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();
        const icons = colorDivs[index].querySelectorAll(".controls button")

        //Adding/pushing colors(hex) to array
        if(div.classList.contains("locked")){
            initialColors.push(hexText.innerText);
            return;
        }else{
            initialColors.push(chroma(randomColor).hex());
        }
        

        //Add the color to bg and text
        div.style.background = randomColor;
        hexText.innerText = randomColor;

        //Check for contrast for both text and buttons
        checkTextContrast(randomColor, hexText);
       
       
        //Initial colorize sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });

    
    //Check for button contrast
    adjustButton.forEach((button, index) => {
    checkTextContrast(initialColors[index], button);
    checkTextContrast(initialColors[index], lockButton[index]);
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

    hue.value = color.hsl()[0];
    brightness.value = color.hsl()[2];
    saturation.value = color.hsl()[1];
}


//Set Div bg color
function hslControls(e){
    const index = e.target.getAttribute("data-bright") || e.target.getAttribute("data-sat") || e.target.getAttribute("data-hue") ;
    
    let sliders = e.target.parentElement.querySelectorAll("input[type=range]");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = initialColors[index];


    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    colorDivs[index].style.backgroundColor = color;
    
    colorizeSliders(color, hue, brightness, saturation);
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


function copyToClipboard(hex){
    navigator.clipboard.writeText(hex.innerText);

    //Pop up animation
    const popupBox = popup.children[0]; 
    popup.classList.add('active');
    popupBox.classList.add('active');


}


function openAdjustmentPanel(index){
    sliderContainers[index].classList.toggle('active');
}

function closeAdjustmentPanel(index){
    sliderContainers[index].classList.remove('active');
}

function lockLayer(e, index) {
    const lockSVG = e.target.children[0];
    const activeBg = colorDivs[index];
    activeBg.classList.toggle("locked");
  
    if (lockSVG.classList.contains("fa-lock-open")) {
      e.target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
      e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
  }


//Funtions being called
randomColors(); 