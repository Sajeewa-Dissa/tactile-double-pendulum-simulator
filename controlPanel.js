import * as SlidingCanvas from "./slidingCanvas.js";

const optionalCanvas = document.querySelector("#optionalCanvasContainer");
const toggleBtn = document.querySelector('#showHideToggle');

const chkTracing = document.querySelector('#tracingEnable');
const chkDamping = document.querySelector('#dampingEnable');
const displayDamp = document.querySelector('#displayDamp');
const hiddenGrav = document.querySelector('#gravId');
const sliderGrav = document.querySelector('#rangeGrav');
const displayGrav = document.querySelector('#displayGrav');
const hiddenDamp = document.querySelector('#dampId');
const sliderDamp = document.querySelector('#rangeDamp');

const sliderC1Mass = document.querySelector('#rangeC1Mass');
const displayC1Mass = document.querySelector('#displayC1Mass');
const sliderC1Length = document.querySelector('#rangeC1Length');
const displayC1Length = document.querySelector('#displayC1Length');

const sliderC2Mass = document.querySelector('#rangeC2Mass');
const displayC2Mass = document.querySelector('#displayC2Mass');
const sliderC2Length = document.querySelector('#rangeC2Length');
const displayC2Length = document.querySelector('#displayC2Length');

const btnRefresh = document.querySelector('#btnRefresh');
const btnPlayPause = document.querySelector('#btnPlayPause');
const btnReset = document.querySelector('#btnReset');

let pendulumsPaused = false;
let creditsPageShown = false;

//Duplicate canvas///////////////////////////////////////////////////////////////////////////
optionalCanvas.style.display = "none";
let secondBobShown = false;

toggleBtn.addEventListener("click", function() {
  const secondPendulumCard = document.querySelector('#secondPendulumCard');
  SlidingCanvas.slideToggle(optionalCanvas); //will toggle automatically based on window computed style

  secondBobShown = !secondBobShown;
  if(secondBobShown){
    toggleBtn.textContent = "Hide Duplicate";
    secondPendulumCard.classList.remove("invisible");
    secondPendulumCard.classList.add("visible");
  }
  else{
    toggleBtn.textContent = "Show Duplicate";
    secondPendulumCard.classList.add("invisible");
    secondPendulumCard.classList.remove("visible");
  }
});

//Credits and Discussion dialog///////////////////////////////////////////////////////////////////////////
document.querySelector('#credits').addEventListener('click', showCreditsDialog);
const creditsDialog = document.querySelector("#creditsDialog")

//show dialog modally.
function showCreditsDialog() {
  creditsDialog.showModal();
  creditsDialog.classList.add('show');
  document.querySelector('.modal-overlay').classList.add('show');
  creditsPageShown = true;
}

function closeCreditsDialog() {
    creditsPageShown = false;
}
    
document.querySelector("#closeDialog").addEventListener('click', closeCreditsDialog);
creditsDialog.addEventListener('cancel', closeCreditsDialog);

//Mouse grabbing info message/////////////////////////////////////////////////////////////
window.onload = function() {
  window.setTimeout(fadeIn, 4000);
}

function fadeIn() {
  document.getElementById('fadeInOut').classList.remove('fade');
  window.setTimeout(fadeOut, 8000);
}

function fadeOut() {
  document.getElementById('fadeInOut').classList.add('fade');
}

//Icon buttons code///////////////////////////////////////////////////////////////////////
btnPlayPause.addEventListener("click", function() {
  //disable refresh button when paused to avoid complications with re-animation.
  pendulumsPaused = !pendulumsPaused;
  if(pendulumsPaused){
    btnPlayPause.innerHTML = "&#x23F5;";//play icon
    btnRefresh.disabled = true;
  }
  else{
    btnPlayPause.innerHTML = "&#x23F8;"; //pause icon
    btnRefresh.disabled = false;
  }
});


btnReset.addEventListener("click", function() {
  chkTracing.checked = true;
  chkDamping.checked = true;
  sliderGrav.value = 5;
  hiddenGrav.value = 0.10;
  displayGrav.innerHTML = '0.10';
  sliderDamp.value = 5;
  hiddenDamp.value = 0.99940;
  displayDamp.innerHTML = '0.99940';
  sliderC1Mass.value = 50;
  displayC1Mass.innerHTML = 50;
  sliderC1Length.value = 50;
  displayC1Length.innerHTML = 50;
  sliderC2Mass.value = 50;
  displayC2Mass.innerHTML = 50;
  sliderC2Length.value = 50;
  displayC2Length.innerHTML = 50;
});

//Slider code///////////////////////////////////////////////////////////////////////////////////////
let getGrav = oneFiftieth(sliderGrav.value);
hiddenGrav.value = getGrav;
document.querySelector('#displayGrav').innerHTML = getGrav;


sliderGrav.addEventListener("input", function() {
  hiddenGrav.value = oneFiftieth(this.value);
  displayGrav.innerHTML = oneFiftieth(this.value);
});


function oneFiftieth(num){ //gravity g should be 9.81 but SI units don't work here as we are using pixel lengths and frame ticks instead of metres and seconds.
  return (num/50).toFixed(2);
}


let getDamp = arbitraryLogFunc(sliderDamp.value);
hiddenDamp.value = getDamp;
displayDamp.innerHTML = getDamp;


sliderDamp.addEventListener("input", function() {
  hiddenDamp.value = arbitraryLogFunc(this.value);
  displayDamp.innerHTML = arbitraryLogFunc(this.value);
});


function arbitraryLogFunc(num){
  //function converts 1 to 0.99999 and 10 to 0.9 and everything in between proportionally via a power function.
  const x = (4 * (num-1) / 9) - 5;
  return  (1 - 10 ** x).toFixed(5);
}


let getC1Mass = sliderC1Mass.value;
displayC1Mass.innerHTML = getC1Mass;

sliderC1Mass.addEventListener("input", function() {
  displayC1Mass.innerHTML = this.value;
});


let getC1Length = sliderC1Length.value;
displayC1Length.innerHTML = getC1Length;

sliderC1Length.addEventListener("input", function() {
  displayC1Length.innerHTML = this.value;
});


let getC2Mass = sliderC2Mass.value;
displayC2Mass.innerHTML = getC2Mass;

sliderC2Mass.addEventListener("input", function() {
  displayC2Mass.innerHTML = this.value;
});


let getC2Length = sliderC2Length.value;
displayC2Length.innerHTML = getC2Length;

sliderC2Length.addEventListener("input", function() {
  displayC2Length.innerHTML = this.value;
});

//Module export///////////////////////////////////////////////////////////////////////
export { btnRefresh, btnPlayPause, btnReset, chkTracing, chkDamping, hiddenGrav, sliderGrav, hiddenDamp, sliderDamp, sliderC1Mass, 
    sliderC1Length, sliderC2Mass, sliderC2Length, secondBobShown, pendulumsPaused, creditsPageShown};


