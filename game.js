const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const characterSelect = document.getElementById('character');

// 이미지 객체 생성
const playerImg = new Image();
const obstacleImg = new Image();
const backgroundImg = new Image();

// 이미지 소스 설정
backgroundImg.src = 'https://png.pngtree.com/background/20221111/original/pngtree-nobody-interface-of-pixel-game-platform-picture-image_1961347.jpg'; // 배경 이미지
obstacleImg.src = 'mushroom2.png'; // 장애물 이미지

let isGameOver = false;
let score = 0;

const player = {
    x: 50,
    y: 300,
    width: 150,
    height: 200,
    velocityY: 0,
    gravity: 0.5,
    isJumping: false
};

const obstacle = {
    x: 800,
    y: window.innerHeight -350,
    width: 100,
    height: 100,
    speed: 10
};


function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // 플레이어 위치 조정
    player.y = canvas.height - player.height - 50; // 땅에서 50px 위
    obstacle.x = canvas.width; // 장애물 시작 위치를 오른쪽 끝으로
    obstacle.y = window.innerHeight -270;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 점프 처리
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !player.isJumping) {
        player.velocityY = -15; // 점프 높이 설정
        player.isJumping = true;
    }
});

// 게임 시작 함수
function startGame() {
    // 선택한 캐릭터 이미지 설정
    playerImg.src = characterSelect.value;
    // 이미지 로드 완료 후 게임 시작
    playerImg.onload = () => {
        // 메뉴 숨기고 캔버스 보이기
        document.getElementById('character-selection').style.display = 'none';
        canvas.style.display = 'block';

        // 게임 시작
        update();
    };

}

function update() {
    if (isGameOver) return;

    // 중력 적용
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // 땅에 닿으면 점프 종료
    if (player.y >= window.innerHeight -380) {
        player.y =  window.innerHeight -380;
        player.isJumping = false;
    }

    // 장애물 이동
    obstacle.x -= obstacle.speed;

    // 장애물이 화면 밖으로 나가면 초기화
    if (obstacle.x < -obstacle.width) {
        obstacle.x = canvas.width;
        score++; // 점수 증가
    }

    // 충돌 감지
    if (
        player.x < obstacle.x + obstacle.width+5 &&
        player.x + player.width > obstacle.x-5 &&
        player.y < obstacle.y + obstacle.height+5 &&
        player.y + player.height > obstacle.y-5
    ) {
        isGameOver = true;
        alert(`게임 오버! 점수: ${score}`);
        return;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    // 배경 그리기
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // 플레이어 그리기
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // 장애물 그리기
    ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // 점수 표시
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}
