var canvas = document.getElementById("mycanvas"); //Accceso de canvas
var ctx = canvas.getContext("2d"); //responsable del dibujo dentro del canvas
var ballRadius = 10; 
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var paddleHeight = 15;
var paddleWidth = 70;
var paddleX = (canvas.width-paddleWidth)/2;123;
var rightPressed =  false; // cuando esta en descanso, no apretado, es falso. Se activa cuando apretas la flecha. 
var leftPressed = false;

//Bricks
var brickRowCount = 4;
var brickColumnCount = 7;
var brickWidth = 75;
var brickHeight = 24;
var brickPadding = 10;
var brickOffsetTop = 32;
var brickOffsetLeft = 32;
var bricks = [];
var score = 0;

for( var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for( var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status:1};
    }
}

document.addEventListener ("keydown", keyDownHandler, false); //text ket down, nombre, false ( cuando no esta presionado no funciona)
document.addEventListener ("keyup", keyUpHandler, false);
document.addEventListener ("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) { // Funcion para usar las flechas para mover la barra
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e){ //cuando no esta presionada, up no presionadas
    if(e.keyCode ==39) {
        rightPressed = false;
    }
    else if(e.keyCode ==37){
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath(); //inicio de dibujo
    ctx.arc(x, y, ballRadius, 0, Math.PI*2); // BALL X, Y, Radio, start, end, direccion de para donde se va a dibujar el circulo: clockwise(false) o anticlock(true)
    ctx.fillStyle = "white"; //relleno
    ctx.fill(); //actual color
    ctx.closePath(); //Fin del dibujo
}

function drawPaddle () {
    ctx.beginPath(); //inicio de dibujo
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight); 
    ctx.fillStyle = "lightgreen"; 
    ctx.fill(); //actual color
    ctx.closePath(); //Fin del dibujo
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) { 
        for( var r=0; r<brickRowCount; r++) {
            if (bricks[c][r].status ==1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect (brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#6600cc";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX-canvas.offsetLeft;
        if(relativeX >0 && relativeX <canvas.width){
            paddleX = relativeX - paddleWidth/2;
        }
}

function collisionDetection() {
    for (var c=0; c<brickColumnCount; c++) {
        for (var r=0; r<brickRowCount; r++){
            var b= bricks[c][r];
            if(b.status == 1)  {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score ==brickRowCount*brickColumnCount){
                        alert("Felicitaciones! Segui perdiendo tu tiempo!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore(){
    ctx.font ="18px Arial";
    ctx.fillStyle="lightred";
    ctx.fillText("score:"+score,8,20);
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height); // limpia el recorrido de la pelota: cuatro parametros - x, y top left - x y botomm right
   
    drawBricks();
    drawBall(); //llama a la funcion 
    drawPaddle();
    collisionDetection() ;
    drawScore(); 

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {  // COntrola la pelota
        dx = -dx;
    }
    if(y + dy < ballRadius) { 
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) { // Deteccion de colision
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("GAME OVER LOOSER!!");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
    }

    //CONTROLA LA BARRA
    if(rightPressed && paddleX < canvas.width-paddleWidth) { // mueve la barra - segunda evita que salga del canvas
        paddleX +=7;
    }
    else if(leftPressed && paddleX >0) {
        paddleX -=7;
    }

    x +=dx;
    y +=dy;
}

setInterval(draw, 10) //loop infinito, en milisegundo


