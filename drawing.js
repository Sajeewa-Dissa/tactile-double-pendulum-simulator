function drawDot(context, x1, y1, size = 6, colour = '#0ff'){
    context.fillStyle = colour;
    context.beginPath();
    context.arc(x1, y1, size, 0, Math.PI * 2, true);
    context.fill();
}

function drawLine(context, xa, ya, xb, yb, size = 2, colour = '#fff'){
    context.strokeStyle = colour;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(xa, ya);
    context.lineTo(xb, yb);
    context.stroke();
}

function drawTrace(context, arr, colour = '#f0f') {
    if(arr.length == 0) return;

    context.strokeStyle = colour;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(arr[0].x, arr[0].y);

    for (var i = 1; i < arr.length; i++) {
        //if the hex value has changed it represents am interrupted trace..
        if(arr[i].hex == arr[i-1].hex){
            context.lineTo(arr[i].x, arr[i].y);
        }
        else {
            context.moveTo(arr[i].x, arr[i].y); //move without drawing trace.
        }
    }
    context.stroke();
}

export { drawDot, drawLine, drawTrace };