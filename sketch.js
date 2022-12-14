const gameWidth = 320;
const gameHeight = 200;

const gameMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let pos;
let dir;
let cameraPlane;

function setup() {
    var canvas = createCanvas(gameWidth, gameHeight);
    canvas.parent('canvasForHTML');
    noStroke();

    pos = createVector(5, 5);
    dir = createVector(1, -1);
    cameraPlane = createVector(0.66, 0);
}

function draw() {
    dir.rotate(0.01);
    cameraPlane.rotate(0.01)

    //floor and background
    background(120);
    fill(90);
    rect(0, height / 2, width, height / 2);

    //game loop
    for (let pixel = 0; pixel < width; pixel++) {
        const multiplier = 2 * (pixel / width) - 1;
        const cameraPixel = p5.Vector.mult(cameraPlane, multiplier);

        const rayDir = p5.Vector.add(dir, cameraPixel);

        const deltaDistX = abs(1 / rayDir.x);
        const deltaDistY = abs(1 / rayDir.y);

        const mapPos = createVector(floor(pos.x), floor(pos.y));

        let distToSideX;
        let distToSideY;

        let stepX;
        let stepY;

        let perpendicularDist;

        if (rayDir.x < 0) {
            distToSideX = (pos.x - mapPos.x) * deltaDistX;
            stepX = -1;
        } else {
            distToSideX = (mapPos.x + 1 - pos.x) * deltaDistX;
            stepX = 1;
        }

        if (rayDir.y < 0) {
            distToSideY = (pos.y - mapPos.y) * deltaDistY;
            stepY = -1;
        } else {
            distToSideY = (mapPos.y + 1 - pos.y) * deltaDistY;
            stepY = 1;
        }

        let hit = false;
        let hitSide;

        let ddaLineSizeX = distToSideX;
        let ddaLineSizeY = distToSideY;

        let wallMapPos = mapPos.copy();

        while (hit == false) {
            if (ddaLineSizeX < ddaLineSizeY) {
                wallMapPos.x += stepX;
                ddaLineSizeX += deltaDistX;
                hitSide = 0;
            } else {
                wallMapPos.y += stepY;
                ddaLineSizeY += deltaDistY;
                hitSide = 1;
            }

            if (gameMap[wallMapPos.x][wallMapPos.y] > 0) {
                hit = true;
            }
        }

        if (hitSide == 0) {
            perpendicularDist = abs(wallMapPos.x - pos.x + ((1 - stepX) / 2)) / rayDir.x;
        } else {
            perpendicularDist = abs(wallMapPos.y - pos.y + ((1 - stepY) / 2)) / rayDir.y;
        }

        let wallLineHeight = height / perpendicularDist;

        let lineStartY = height / 2 - wallLineHeight / 2;
        let lineEndY = height / 2 + wallLineHeight / 2;

        let color = hitSide ? 255 : 188;

        stroke(0, 100, color);
        line(pixel, lineStartY, pixel, lineEndY);
    }
}