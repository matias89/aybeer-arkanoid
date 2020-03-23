const canvas = document.getElementById('app');
const width = window.innerWidth - 5;
const height = window.innerHeight - 5;
canvas.height = (height * 70) / 100;
canvas.width = width;
const ctx = canvas.getContext('2d');
let ballColor = '#F5A510'; // '#0095DD';
const paddleColor = '#00BDEF';
let brickColor = '#FFDF43';
let fontColor = '#FEF7E9';
let speed = 2;
let dx = speed;
let dy = -speed;
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
const paddleHeight = 20;
const paddleWidth = 74;
const moveValue = 5;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const brickRowCount = 6;
const brickColumnCount = 4;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 5;
const brickWidth = Math.floor(width / brickColumnCount) - brickPadding;

let stageScore = 0;
let totalScore = 0;
let lives = 3;
let stage = 1;
let counter = 2;

const bricks = [];
const resetBricks = () => {
for(c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
};
resetBricks();

const buildStyles = () => {
    if (counter >= 3) {
        counter = 0;
    }
    const brickColors = ['FFDF43', '000000', 'AA020F']; // Golden - porter - red
    const backgroundColors = ['AA020F', 'FFDF43', '000000'];
    const ballColors = ['F5A510', '3B0103', 'F5A510'];
    const fontColors = ['F5A510', '3B0103', 'F5A510'];
    const background = document.getElementById('game');
    background.style.backgroundColor = `#${backgroundColors[counter]}`;
    brickColor = `#${brickColors[counter]}`;
    ballColor = `#${ballColors[counter]}`;
    fontColor = `#${fontColors[counter]}`;
    counter++;
};
buildStyles();

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
};

const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
};

const drawBricks = () => {
    for(c = 0; c < brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawScore();
    drawStage();
    drawLives();
    collisionDetection();
    drawBricks();
    drawBall();
    
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > (canvas.height - ballRadius - paddleHeight)) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = speed;
                dy = -speed;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    x += dx;
    y += dy;

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += moveValue;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= moveValue;
    }
    requestAnimationFrame(draw);
};

const keyDownHandler = e => {
    if(e.keyCode === 39) {
        rightPressed = true;
    }
    else if(e.keyCode === 37) {
        leftPressed = true;
    }
};

const keyUpHandler = e => {
    if(e.keyCode === 39) {
        rightPressed = false;
    }
    else if(e.keyCode === 37) {
        leftPressed = false;
    }
};

const moveToLeft = () => {
    leftPressed = true;
};

const StopToLeft = () => {
    leftPressed = false;
};

const moveToRight = () => {
    rightPressed = true;
};

const StopToRight = () => {
    rightPressed = false;
};

const mouseMoveHandler = e => {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
};

const collisionDetection = () => {
    for(c = 0; c < brickColumnCount; c++) {
        for(r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    stageScore += 1;
                    totalScore += 1;
                    if(stageScore === brickRowCount * brickColumnCount) {
                        alert('Nivel completado :)');
                        changeStage();
                        resetBricks();
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        stage += 1;
                        buildStyles(stage);
                        stageScore = 0;
                    }
                }
            }
        }
    }
};

const drawScore = () => {
    ctx.font = '16px Arial';
    ctx.fillStyle = fontColor;
    ctx.fillText(`Puntaje: ${totalScore}`, 5, 20);
};

const drawLives = () => {
    ctx.font = '16px Arial';
    ctx.fillStyle = fontColor;
    ctx.fillText(`Vidas: ${lives}`, canvas.width - 65, 20);
};

const drawStage = () => {
    ctx.font = '16px Arial';
    ctx.fillStyle = fontColor;
    ctx.fillText(`Nivel: ${stage}`, (canvas.width / 2) - 28, 20);
} 

const changeStage = () => {
    speed += 2;
    dx = speed;
    dy = -speed;
};

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
// document.addEventListener('mousemove', mouseMoveHandler, false);
document.getElementById('left').addEventListener('touchstart', moveToLeft, false);
document.getElementById('left').addEventListener('touchend', StopToLeft, false);
document.getElementById('right').addEventListener('touchstart', moveToRight, false);
document.getElementById('right').addEventListener('touchend', StopToRight, false);
// document.addEventListener('mouseup', StopToLeft, false);
draw();