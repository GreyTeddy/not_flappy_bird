var gWidth;
var gHeight;
var game;
var cheat;
var released = true;

function setup() {
	gWidth = windowWidth;
	gHeight = windowHeight;
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
	this.pipe_gap = 275
	this.setup = () => {
		this.pipes = Array();
		this.pipes.push(new Pipe());
		let last_index = this.pipes.length - 1;
		let last_pipe_x = this.pipes[last_index].x
		while (this.pipes[last_index].x < gWidth * 2 - this.pipe_gap) {
			this.pipes.push(new Pipe());
			this.pipes[last_index + 1].x = last_pipe_x + this.pipe_gap;
			last_pipe_x = this.pipes[last_index + 1].x
			last_index = this.pipes.length - 1;
		}
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
			text(">__<", gWidth/2, 100);
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
	this.y = map(Math.random(), 0, 1, 100, gHeight - 100);
	this.ySpace = 80;
	this.notPassed = true;
	this.width = 50
	this.show = () => {
		fill(0);
		rect(this.x, -this.ySpace / 2,
			this.width, this.y - this.ySpace / 2);
		rect(this.x, this.y + this.ySpace,
			this.width, gHeight);
		ellipse(this.x + this.width / 2,
			this.y - this.ySpace, this.width);
		ellipse(this.x + this.width / 2,
			this.y + this.ySpace, this.width);
		fill(255);
		text(game.points, this.x + this.width / 2, this.y);
		fill(0);
	}
	this.move = () => {
		this.x -= 2;
		if (this.x < -50) {
			this.x = gWidth + game.pipe_gap - this.width;
			this.y = map(Math.random(), 0, 1, 100, gHeight - 100);
			this.notPassed = true;
		}

	}
	this.touched = (ballX, ballY) => {
		if ((ballX > this.x - 25 && ballX < this.x + 75 &&
			(ballY < this.y - this.ySpace || ballY > this.y + this.ySpace)) ||
			dist(this.x + 25, this.y - this.ySpace, ballX, ballY) < 50 ||
			dist(this.x + 25, this.y + this.ySpace, ballX, ballY) < 50 ||
			ballY < 25 || ballY > gHeight + 128) {
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

function keyPressed() {
	if (game.playing == true) { game.ball.jump(); }
	else {
		game = new Game();
		game.setup();
	}
}

// https://github.com/processing/p5.js/issues/1815
function mousePressed() {
	if(!released){
		return;
	}
	released = false;

	if (game.playing == true) { game.ball.jump(); }
	else {
		game = new Game();
		game.setup();
	}
}

function mouseReleased(){
	released = true;
	return false;
}