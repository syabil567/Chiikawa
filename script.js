
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
const chiikawaImgs = [];
const monsterImgs = [];
const chiikawaPositions = [];
const monsters = [];

const loadImage = (src) => {
    return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
    });
};

const loadAssets = async () => {
    for (let i = 1; i <= 7; i++) {
        chiikawaImgs.push(await loadImage(`img/chiikawa${i}.png`));
    }
    for (let i = 1; i <= 3; i++) {
        monsterImgs.push(await loadImage(`img/monster${i}.png`));
    }

    for (let i = 0; i < chiikawaImgs.length; i++) {
        chiikawaPositions.push({ x: 100 + i * 90, y: 500 });
    }

    spawnMonster();
    draw();
};

const spawnMonster = () => {
    const index = Math.floor(Math.random() * monsterImgs.length);
    monsters.push({
        img: monsterImgs[index],
        x: Math.random() * 750,
        y: 0,
        speed: 2 + Math.random() * 2
    });
};

canvas.addEventListener("click", () => {
    chiikawaPositions.forEach(p => p.y -= 30);
    const audio = new Audio("sound/jump.mp3");
    audio.play();
});

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    chiikawaPositions.forEach((pos, i) => {
        ctx.drawImage(chiikawaImgs[i], pos.x, pos.y, 50, 50);
    });

    monsters.forEach(monster => {
        monster.y += monster.speed;
        ctx.drawImage(monster.img, monster.x, monster.y, 60, 60);

        chiikawaPositions.forEach((chiikawa, i) => {
            if (monster.y > chiikawa.y && monster.y < chiikawa.y + 50 &&
                monster.x > chiikawa.x && monster.x < chiikawa.x + 50) {
                score += 10;
                monster.y = 600;
                const audio = new Audio("sound/hit.mp3");
                audio.play();
            }
        });
    });

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    if (Math.random() < 0.01) {
        spawnMonster();
    }

    requestAnimationFrame(draw);
};

loadAssets();
