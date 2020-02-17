var gWidth = 500;
var gHeight = 700;
var game;

function setup() {
	createCanvas(gWidth, gHeight);
	textSize(32);
	noStroke();
	background(255);
	fill(0);

	game = new Game();
	game.setup();
	textAlign(CENTER);
}

function draw() {
	game.run();
}

function Game() {
	this.ball = new Ball();
	this.pipes;
	this.playing = false;
	this.points = 0;
	this.setup = () => {
		this.pipes = Array();
		this.pipes.push(new Pipe());
		this.pipes.push(new Pipe());
		this.pipes[1].x = 775;
		this.playing = true;
	}
	this.run = () => {
		if (this.playing) {
			background(255);
			this.ball.run();
			for (var p = 0; p < this.pipes.length; p++) {
				this.pipes[p].run(this.ball);
				this.pipes[p].touched(this.ball.x, this.ball.y);
				this.pipes[p].passed(this.ball.x, this.ball.y);
			}
		}
		else {
			text(">__<", 250, 100);
		}
	}
}

function Ball() {
	this.name = "ball";
	this.size = 100; //diameter
	this.x = 130;
	this.y = 200;
	this.vel = 0;
	this.gravity = 0.4;
	this.physics = () => {
		//change y for gravity
		this.vel += this.gravity;
		this.y += this.vel;
	}
	this.jump = () => {
		if (this.vel > -10) { this.vel = -7; }
	}
	this.show = () => {
		//		fill(255,0,0);
		ellipse(this.x, this.y, this.size / 2)
	}

	this.run = () => {
		this.physics();
		this.show();
	}
}

function Pipe() {
	this.x = gWidth;
	this.y = map(Math.random(), 0, 1, 100, 500);
	this.ySpace = 80;
	this.notPassed = true;
	this.show = () => {
		fill(0);
		rect(this.x, -this.ySpace / 2,
			50, this.y - this.ySpace / 2);
		rect(this.x, this.y + this.ySpace,
			50, gHeight);
		ellipse(this.x + 25,
			this.y - this.ySpace, 50);
		ellipse(this.x + 25,
			this.y + this.ySpace, 50);
		fill(255);
		text(game.points, this.x + 25, this.y);
		fill(0);

	}
	this.move = () => {
		this.x -= 2;
		if (this.x < -50) {
			this.x = gWidth;
			this.notPassed = true;
		}

	}
	this.touched = (ballX, ballY) => {
		//ballX>this.x-25 && ballX<this.x+75 ||
		if ((ballX > this.x - 25 && ballX < this.x + 75 &&
			(ballY < this.y - this.ySpace || ballY > this.y + this.ySpace)) ||
			dist(this.x + 25, this.y - this.ySpace, ballX, ballY) < 50 ||
			dist(this.x + 25, this.y + this.ySpace, ballX, ballY) < 50 ||
			ballY < 25 || ballY > 675) {
			console.log("ʕ •ᴥ•ʔ");
			game.playing = false;
		};
	}
	this.passed = (ballX) => {
		if (this.notPassed && ballX > this.x) {
			game.points += 1;
			console.log(game.points);
			this.notPassed = false;
		}
	}
	this.run = () => {
		this.show();
		this.move();
	}
}

function keyPressed() { game.ball.jump(); }

function touchStarted() {game.ball.jump();}