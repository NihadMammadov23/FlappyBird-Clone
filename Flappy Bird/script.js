let board;
let boardWidth;
let boardHeight;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX;
let birdY;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -1;
let velocityY = 0;
let gravity = 0.1;

let gameover = false;
let score = 0;

window.onload = function () {
    boardWidth = window.innerWidth - 20;
    boardHeight = window.innerHeight - 21;
    birdX = boardWidth / 8;
    birdY = boardHeight / 2;
    bird.x = birdX;
    bird.y = birdY;
    pipeX = boardWidth;

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board

    //draw the bird
    //context.fillStyle = 'green';
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load the image
    birdImg = new Image();
    birdImg.src = './img/flappybird.png';
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = './img/toppipe.png';

    bottomPipeImg = new Image();
    bottomPipeImg.src = './img/bottompipe.png';

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameover = true;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5
            pipe.passed = true
        }

        if (detectCollision(bird, pipe)){
            gameover = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < 0){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "85px sans-serif";
    context.fillText(score, 45, 90);
}

function placePipes() {
    if(gameover){
        return
    }

    let randomPipeY = pipeY - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe)
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -4;
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}