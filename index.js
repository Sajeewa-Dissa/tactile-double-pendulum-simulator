import * as Pndlm from "./pendulum.js";
import * as ControlPanel from "./controlPanel.js";


//set initial state.
let g = 0.100;  //g should be 9.81 but SI units don't work easily as we are using pixel lengths and ticks instead of metres and seconds.
let damping = 0.9994;
let applyTracing = true;

//main (LHS) canvas.
const canvasL = document.querySelector('#canvasLeft'); 
let contextL = canvasL.getContext('2d');
let pendulumL = new Pndlm.Pendulum(canvasL, contextL, 50, 50); //the initial values used by the class ~ctor.

//duplicate (RHS) canvas.
const canvasR = document.querySelector('#canvasRight'); 
let contextR = canvasR.getContext('2d');
let pendulumR = new Pndlm.Pendulum(canvasR, contextR, 50, 50); //the initial values used by the class ~ctor.

///Control panel events and funcs//////////////////////////////////////////////////////////////

//Credits and Discussion dialog and funcs//////
const creditsDialog = document.querySelector("#creditsDialog")

function closeCreditsDialog() {
    creditsDialog.close();
    creditsDialog.classList.remove('show');
    document.querySelector('.modal-overlay').classList.remove('show');
    animate();
}
    
document.querySelector("#closeDialog").addEventListener('click', closeCreditsDialog);
creditsDialog.addEventListener('cancel', closeCreditsDialog);
document.querySelector('.modal-overlay').addEventListener('click', closeCreditsDialog);
///////////////////////////////////////////////

ControlPanel.chkTracing.addEventListener("change", function(){
    if (ControlPanel.chkTracing.checked) {
        applyTracing = true;
        updatePendulumProperties(pendulumL, null, null, null, true);
        updatePendulumProperties(pendulumR, null, null, null, true);
    } else {
    applyTracing = false;
    }
});

ControlPanel.chkDamping.addEventListener("change", resetDampingValue);

ControlPanel.sliderDamp.addEventListener("input", resetDampingValue);

function resetDampingValue() {
    if(ControlPanel.chkDamping.checked){
        damping = ControlPanel.hiddenDamp.value;
    } else {
        damping = null;
    }
}

ControlPanel.sliderGrav.addEventListener("input", function() {
  g = ControlPanel.hiddenGrav.value;
});

ControlPanel.sliderC1Mass.addEventListener("input", function() {
    updatePendulumProperties(pendulumL, null, this.value, null, null);
});

ControlPanel.sliderC1Length.addEventListener("input", function() {
    updatePendulumProperties(pendulumL, this.value, null), null, null;
});

ControlPanel.sliderC2Mass.addEventListener("input", function() {
    updatePendulumProperties(pendulumR, null, this.value, null, null);
});

ControlPanel.sliderC2Length.addEventListener("input", function() {
    updatePendulumProperties(pendulumR, this.value, null, null, null);
});

ControlPanel.btnRefresh.addEventListener("click", function() {
    pendulumL.setInitial(); 
    pendulumR.setInitial(); 
});

ControlPanel.btnPlayPause.addEventListener("click", function() {
    updatePendulumProperties(pendulumL, null, null, true, null);
    updatePendulumProperties(pendulumR, null, null, true, null);
    requestAnimationFrame(animate);
});

ControlPanel.btnReset.addEventListener("click", function() {
    updatePendulumProperties(pendulumL, 50, 50, false, true);
    updatePendulumProperties(pendulumR, 50, 50, false, true);
    applyTracing = true;
    resetDampingValue();
    g = 0.100;  //g should be 9.81 but SI units don't work easily as we are using pixel lengths and ticks instead of metres and seconds.
    damping = 0.9994;
});

function updatePendulumProperties(pendulum, rodPercent, bobPercent, pauseClicked, applyTracing, applyDamping){
    pendulum.updateProperties(rodPercent, bobPercent, pauseClicked, applyTracing, applyDamping);
}

//Mouse events/////////////////////////////////////////////////////////////////////////////////////////
canvasL.addEventListener('mousemove', pendulumL.mousemove);
canvasL.addEventListener('mousedown', pendulumL.mousedown);
canvasL.addEventListener('mouseup', pendulumL.mouseup);
canvasL.addEventListener('mouseout', pendulumL.mouseup);

canvasR.addEventListener('mousemove', pendulumR.mousemove);
canvasR.addEventListener('mousedown', pendulumR.mousedown);
canvasR.addEventListener('mouseup', pendulumR.mouseup);
canvasR.addEventListener('mouseout', pendulumR.mouseup);
///////////////////////////////////////////////////////////////////////////////////////////////////////

function animate() {
    if(!ControlPanel.pendulumsPaused && !ControlPanel.creditsPageShown){
        pendulumL.draw(applyTracing, g, damping);
        if(ControlPanel.secondBobShown){
            pendulumR.draw(applyTracing, g, damping);
        }
        requestAnimationFrame(animate);
    }
}

requestAnimationFrame(animate); //tells the browser to calls a specified function to update an animation right before the next repaint.











