import * as Drawing from "./drawing.js";

class Pendulum {
    constructor(
        canvas,
        context,
        rod1Percent,
        bob1Percent 
    ) {
        this.canvas = canvas;
        this.context = context;
        this.x0 = 0.5*canvas.width;
        this.y0 = 0.5*canvas.height;
        // this.xMidBob;
        // this.yMidBob;
        // this.xMainBob;
        // this.yMainBob;
        // this.lastKnownMouseX;
        // this.lastKnownMouseY;
        this.mainBobGrabbed = false;
        this.pendulumsPaused = false;
        
        this.setInitial();
        this.updateProperties(rod1Percent, bob1Percent);
        this.mousemove = this.mouseMoving.bind(this);
        this.mousedown = this.mouseGrabbing.bind(this);
        this.mouseup = this.mouseReleasing.bind(this);
    }

    //generates random hex funcion used to create independent trails.
    generateRandomHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


    setInitial(){
        this.p1 = 5*Math.PI/4; //point p1 direction relative to centre of rotation.
        this.p2 = Math.PI;     //point p2 direction relative to p1.
        
        this.p1v = 0.0;  //p1 velocity.
        this.p2v = 0.0;  //p2 velocity.

        this.trace = [];
        this.randomHex = this.generateRandomHex(4); //reset trail identifier hex.
    }


    updateProperties(rod1Percent, bob1Percent, pauseClicked = false, applyTracing = true){
        if(rod1Percent){
            this.r1 = 200.00*rod1Percent/100.00; //in pixels
            this.r2 = 200.00 - this.r1;
        }

        if(bob1Percent){
            this.m1 = 20.00*bob1Percent/100.00;
            this.m2 = 20.00 - this.m1;
            this.setDotSizes(this.m1, this.m2);// also update the relative sizes of pendulums
        }

        if(pauseClicked){
            this.pendulumsPaused = !this.pendulumsPaused;
        }

        if(applyTracing){
            this.randomHex = this.generateRandomHex(4);  //reset this
        }

        if(this.pendulumsPaused){
            this.drawPendulumShape(); //provide feedback about pendulum position even when paused.
        }
    }


    setDotSizes(m1, m2){
        const ratio = m1/m2;
        switch (true) {
            case (ratio >= 3):
                this.sizeM1 = 9;
                this.sizeM2 = 5;
                break;
            case (ratio > 1):
                this.sizeM1 = 8;
                this.sizeM2 = 6;
                break;
            case (ratio == 1):
                this.sizeM1 = 7;
                this.sizeM2 = 7;
                break;
            case (ratio > 0.333):
                this.sizeM1 = 6;
                this.sizeM2 = 8;
                break;
            default: //ratio of m1 is a third or less
            this.sizeM1 = 5;
            this.sizeM2 = 9;
        }
    }


    //Manual bob positioning functions//////////////////////////////////////////////////////////
    getPerpendicularToMainBobAxis(distanceToMainBob){
        let AD=distanceToMainBob;
        let AB=this.r1;
        let BD=this.r2;    
        let distanceToPerp=(((AB*AB)-(BD*BD)+(AD*AD))/(2*AD) || 0);
        let perpendicular=(Math.sqrt(AB*AB-distanceToPerp*distanceToPerp) || 0);
        return [perpendicular, distanceToPerp];
    }


    getMidBob() {
        let xFromCentre = this.xMainBob - this.x0;
        let yFromCentre = this.yMainBob - this.y0;
        let hypotenuse = Math.sqrt(xFromCentre * xFromCentre + yFromCentre * yFromCentre);
        let theta = Math.atan2(yFromCentre, xFromCentre);
        const [perp, distanceToPerp] = this.getPerpendicularToMainBobAxis(hypotenuse);
    
         //get two possible values of where middle bob coordinates will be.
        let xToPerp = this.x0 + (distanceToPerp) * Math.sin(theta + Math.PI/2);
        let yToPerp = this.y0 - (distanceToPerp) * Math.cos(theta + Math.PI/2);
        let xA = xToPerp + ((Math.cos(theta + Math.PI/2) * perp) || 0);
        let xB = xToPerp - ((Math.cos(theta + Math.PI/2) * perp) || 0);
        let yA = yToPerp + ((Math.sin(theta + Math.PI/2) * perp) || 0);
        let yB = yToPerp - ((Math.sin(theta + Math.PI/2) * perp) || 0);
    
        //choose bob with distance closest to current location.
        let distA = Math.sqrt((xA-this.xMidBob)*(xA-this.xMidBob)+(yA-this.yMidBob)*(yA-this.yMidBob)) || 0.0;
        let distB = Math.sqrt((xB-this.xMidBob)*(xB-this.xMidBob)+(yB-this.yMidBob)*(yB-this.yMidBob)) || 0.0;
    
        if(distA > distB){
            this.xMidBob = xB;
            this.yMidBob = yB;
        }
        else{
            if(distA == distB){ //if both options are equi-distant, collapse the pendulum arms in either direction randomly
                if(Math.floor(Math.random() * 2) == 1){
                    this.xMidBob = xA;
                    this.yMidBob = yA;
                }
                else{
                    this.xMidBob = xB;
                    this.yMidBob = yB;
                }
            }
            else{
                this.xMidBob = xA;
                this.yMidBob = yA;
            }
        } 
    }
    
    
    getMainBob(mouseX, mouseY) {
        //get current position relative to centre:
        let xFromCentre = mouseX - this.x0;
        let yFromCentre = mouseY - this.y0;
        let hypFromCentre = Math.sqrt(xFromCentre * xFromCentre + yFromCentre * yFromCentre); //hypotenuse
        let theta = Math.atan2(yFromCentre, xFromCentre); //get bearing 
    
        if (hypFromCentre > this.r1 + this.r2){
            //get maximum possible distane from centre of rotation
            this.xMainBob = this.x0 + (this.r1 + this.r2) * Math.sin(theta + Math.PI/2); //represent the max possible distance.
            this.yMainBob = this.y0 - (this.r1 + this.r2) * Math.cos(theta + Math.PI/2);
        }
        else{
            if(this.r1 > this.r2 && hypFromCentre < this.r1 - this.r2 ){ //if r1 is greater than r2, there is unreachable space at centre
            //get maximum possible distane from centre of rotation
                this.xMainBob = this.x0 + (this.r1 - this.r2) * Math.sin(theta + Math.PI/2); //represent the max possible distance.
                this.yMainBob = this.y0 - (this.r1 - this.r2) * Math.cos(theta + Math.PI/2);
            }
            else if(this.r1 < this.r2 && hypFromCentre < this.r2 - this.r1 ){
                this.xMainBob = this.x0 + (this.r2 - this.r1) * Math.sin(theta + Math.PI/2); //represent the max possible distance.
                this.yMainBob = this.y0 - (this.r2 - this.r1) * Math.cos(theta + Math.PI/2);
            }
            else{
                this.xMainBob = mouseX;
                this.yMainBob = mouseY;
            }
        }
    }


    drawPendulumShape(){
        this.getMainBob(this.xMainBob, this.yMainBob);
        this.getMidBob();
        this.drawDoublePendulum();
    }


    movePendulum(mouseX, mouseY){
        this.getMainBob(mouseX, mouseY);
        this.getMidBob();

        //reset p1 and p2 while moving pendulum, based on the actual calculated bob coords.
        let vectorX = this.xMidBob - this.x0;
        let vectorY = this.yMidBob - this.y0;
        this.p1 = Math.PI/2 - Math.atan2(vectorY, vectorX);
        vectorX = this.xMainBob - this.xMidBob;
        vectorY = this.yMainBob - this.yMidBob;
        this.p2 = Math.PI/2 - Math.atan2(vectorY, vectorX);

        //set velocity to zero again
        this.p1v = 0.0;  //p1 velocity.
        this.p2v = 0.0;  //p2 velocity.

        this.drawDoublePendulum();
    }


    //Mouse event functions///////////////////////////////////////////////
    mouseMoving(e){
        // Get the local x,y coordinates of the mouse on the canvas and set class variables.
        this.lastKnownMouseX = e.pageX - this.canvas.offsetLeft; //e.clientX etc. will not work as expected if scroll bars etc. occur.
        this.lastKnownMouseY = e.pageY - this.canvas.offsetTop;

        if(this.mainBobGrabbed){
            this.movePendulum(this.lastKnownMouseX, this.lastKnownMouseY);
            return;
        }

        if(Math.abs(this.xMainBob - this.lastKnownMouseX) < 10 && Math.abs(this.yMainBob - this.lastKnownMouseY) < 10){
            this.canvas.classList.add('grabbable');
        }
        else{
            this.canvas.classList.remove('grabbable');
        }
    }
        
        
    mouseGrabbing(e){
        // Get the local x,y coordinates of the mouse on the canvas (independent of last known positions from other events).
        let mouseX = e.pageX - this.canvas.offsetLeft; //e.clientX won't work as expected if scroll bars etc. occur. Use pageX instead.
        let mouseY = e.pageY - this.canvas.offsetTop;
        
        if(Math.abs(this.xMainBob - mouseX) < 10 && Math.abs(this.yMainBob - mouseY) < 10){
            this.canvas.classList.remove('grabbable');
            this.canvas.classList.add('grabbing');
            this.mainBobGrabbed = true;
            this.randomHex = this.generateRandomHex(4);  //reset this
        }
        else{
            this.canvas.classList.remove('grabbable');
            this.canvas.classList.remove('grabbing');
            this.mainBobGrabbed = false;
        }
    }
    
        
    mouseReleasing(e){
        // Get the local x,y coordinates of the mouse on the canvas (independent of last known positions from other events).
        let mouseX = e.pageX - this.canvas.offsetLeft; //e.clientX won't work as expected if scroll bars etc. occur. Use pageX instead.
        let mouseY = e.pageY - this.canvas.offsetTop;
    
        this.mainBobGrabbed = false;
        
        if(Math.abs(this.xMainBob - mouseX) < 10 && Math.abs(this.yMainBob - mouseY) < 10){
            this.canvas.classList.remove('grabbing');
            this.canvas.classList.add('grabbable');
        }
        else{
            this.canvas.classList.remove('grabbable');
            this.canvas.classList.remove('grabbing');
        }
    }
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    drawDoublePendulum(checkToResetMouse = false){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //first clear rectangle
        this.context.fillText('x:' + this.xMainBob.toFixed(0) + ',y:' + this.yMainBob.toFixed(0) , 10, 10); //x,y coordinates as text.

        Drawing.drawTrace(this.context, this.trace); //draw trace first so pendulum is drawn above it.
        
        if(checkToResetMouse){
            //if the pendulum itself moves out of the cursor grab area we must reset mouse cursor independent of mouse move events.
            if(Math.abs(this.xMainBob - this.lastKnownMouseX) < 10 && Math.abs(this.yMainBob - this.lastKnownMouseY) < 10){
                this.canvas.classList.add('grabbable');
            }
            else{
                this.canvas.classList.remove('grabbable');
            }
        }
        //draw the pivot and bobs over the lines
        Drawing.drawLine(this.context, this.x0, this.y0, this.xMidBob, this.yMidBob);
        Drawing.drawLine(this.context, this.xMidBob, this.yMidBob, this.xMainBob, this.yMainBob);
        Drawing.drawDot(this.context, this.x0, this.y0, 4, 'white');
        Drawing.drawDot(this.context, this.xMidBob, this.yMidBob, this.sizeM1);
        Drawing.drawDot(this.context, this.xMainBob, this.yMainBob, this.sizeM2);
    }


    draw(tracing = true, g, damping) {
        if(this.mainBobGrabbed){
            this.drawDoublePendulum();
            return; //return and don't carry out any motion caluculations.
        }

        //calculate acceleration of mid-bob.
        let numerator1 = -g * (2 * this.m1 + this.m2) * Math.sin(this.p1);
        let numerator2 = -this.m2 * g * Math.sin(this.p1 - 2 * this.p2);
        let numerator3 = -2 * Math.sin(this.p1-this.p2)*this.m2;
        let numerator4 = this.p2v*this.p2v*this.r2+this.p1v*this.p1v*this.r1*Math.cos(this.p1-this.p2);
        let denominator = this.r1 * (2*this.m1+this.m2-this.m2*Math.cos(2*this.p1-2*this.p2));
        let p1a = (numerator1 + numerator2 + numerator3*numerator4)/denominator;
    
        //calculate acceleration of main bob.
        numerator1 = 2 * Math.sin(this.p1-this.p2);
        numerator2 = (this.p1v*this.p1v*this.r1*(this.m1+this.m2));
        numerator3 = g * (this.m1 + this.m2) * Math.cos(this.p1);
        numerator4 = this.p2v * this.p2v * this.r2 * this.m2 * Math.cos(this.p1-this.p2);
        denominator = this.r2 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2*this.p1-2*this.p2));
        let p2a = (numerator1 * (numerator2 + numerator3 + numerator4))/denominator;
        
        //damping (only apply if present)
        if(damping){
            this.p1v *= damping;
            this.p2v *= damping;
        }

        this.p1v += p1a;
        this.p2v += p2a;
        this.p1 += this.p1v;
        this.p2 += this.p2v;
        this.xMidBob = this.x0 + this.r1 * Math.sin(this.p1);
        this.yMidBob = this.y0 + this.r1 * Math.cos(this.p1);
        this.xMainBob = this.xMidBob + this.r2 * Math.sin(this.p2);
        this.yMainBob = this.yMidBob + this.r2 * Math.cos(this.p2);
    
        //tracing flag is used to prevent a new trace being drawn only. Existing trace is unaffected.
        if(tracing){
            this.trace.unshift({hex:this.randomHex, x:this.xMainBob, y:this.yMainBob});
            if (this.trace.length > 1024) this.trace.pop();
        }
        else{
            this.trace.pop(); //bleed out the contents of the trail without adding new items.
        }
        this.drawDoublePendulum(true);
    }
}
//Module export///////////////////////////////////////////////////////////////////////
export { Pendulum };