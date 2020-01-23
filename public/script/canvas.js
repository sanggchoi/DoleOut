console.log("canvas loaded")

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

const x = Math.random() * canvas.width;
const dx = (Math.random() - 0.5) * 10;
const y = Math.random() * canvas.height;
const dy = (Math.random() - 0.5) * 10;
const radius = 30;
const leftBorder = 0;
const numCircles = 20;
const speed = 10;

var black = "#eee";
var grey = "#ddd";
var lightgrey = "#ddd";
var darkgrey = "#eee";
var accent = "#2979ff";
var colors = [accent, black, grey, darkgrey, lightgrey];


function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    // this.color = "rgba(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() + ")"
    this.color = colors[Math.ceil(Math.random() * 5 - 1)]

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color
        c.fillStyle = this.color
        c.stroke();
        c.fill();
    }

    this.update = function() {
        // if (this.x + this.radius > innerWidth || this.x - this.radius < leftBorder) {
        //     this.dx *= -1;
        // }
        // if (this.y + this.radius > innerHeight || this.y - this.radius < 0){
        //   this.dy *= -1;
        // }

        this.x += this.dx;
        this.y += this.dy;

        if (this.y > canvas.height + this.radius + 500) {
            this.y -= (canvas.height + this.radius * 2 + 500);
        }

        if (this.x > canvas.width + this.radius + 500){
            this.x -= (canvas.width + this.radius * 2 + 500);
        }

        this.draw();
    }
}
addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});

let circleArray;

function init() {
    
    circleArray = [];
    for (let i = 0; i < numCircles; i++) {
        const radius = (Math.random() * 2) + 6;
        // const x = Math.max(Math.random() * ((canvas.width - radius * 2) - leftBorder) + (radius + leftBorder), 0);
        const x =  - (Math.random() * 1000);
        const dx = (Math.random() * 1)  + speed;
        const y = Math.random() * (2 * canvas.height - radius * 2) + radius - canvas.height;
        const dy = (Math.random() * 2) + .5 + speed;

        circleArray.push(new Circle(x, y, dx, dy, radius));
    }
    for (let x = 0; x < 100; x++){
        for (let i = 0; i < circleArray.length; i++) {
            circleArray[i].update();
        }
    }
    c.fillStyle = 'rgba(255,255,255, 1)';
    c.fillRect(0, 0, innerWidth + 2000, innerHeight + 2000);
    
}

function animate() {

    requestAnimationFrame(animate);
    c.fillStyle = 'rgba(255,255,255, .2)';
    c.fillRect(0, 0, innerWidth + 2000, innerHeight + 2000);

    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }

}
init();
animate();
