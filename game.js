var canvas = document.getElementById('gamewindow'),
    ctx = canvas.getContext('2d');
const GRID = 32;
const GRID_SQUARE = [GRID,GRID];
const SPRITE_PAGES={
	0:makeImageObj('spriteSheet32.png')
}

const SPRITE_DATA = {
	/* imgRef inputs:
		SPRITE_PAGES #,
		size: array for width and height [width, height], or use gridScale(w,h)
		coord: array of coordinates to locate each image on sprite page based on GRID size, use gridScale(x,y)
	*/
		player_idle: new ImgRef(
			0,
			gridScale(1,2),
			[gridScale(1,0),gridScale(2,0),gridScale(3,0),gridScale(4,0)]
			),
		player_jump: new ImgRef(
			0,
			gridScale(1,2),
			[gridScale(5,0)]
			),
		enemy_walk: new ImgRef(
			0,
			GRID_SQUARE,
			[gridScale(0,2),gridScale(1,2),gridScale(2,2),gridScale(3,2)]
		)
}

function makeImageObj(fileLocation){
	var img = new Image();
	img.src = fileLocation;
	return img;
}

function ImgRef(page,size,coord){
	this.page = page;
	this.size = size;
	this.coord = coord;
}

function gridScale(x,y,scale=GRID){
	return 	[
			x * scale,
			y * scale,
			]
}

class Sprite{
	constructor(spriteName, frameNum = 0){
		this.imgRef = SPRITE_DATA[spriteName];
		this.frameNum = frameNum;
	}
	draw(x,y){
		//ctx.save()
		//ctx.translate(x+GRID,0);
		//ctx.scale(-1,1);
		//x=0
		ctx.drawImage(
			SPRITE_PAGES[this.imgRef.page],
			...this.imgRef.coord[this.frameNum],
			...this.imgRef.size,
			x,
			y,
			...this.imgRef.size
			);
		//ctx.restore()
	}
	
}
class Animated_Sprite extends Sprite{
	constructor(spriteName,speed = 10,frameNum = 0){
		super(spriteName,frameNum);
		this.time = 0;
		this.speed = speed;
		this.maxFrame = this.imgRef.coord.length;
	}
	update(){
		if(this.time == this.speed){
			this.time = 0;
			this.frameNum = (this.frameNum + 1)%this.maxFrame;
		}else this.time++;
	}
}
	
var test = new Animated_Sprite('player_idle');
var test2= new Animated_Sprite('enemy_walk');
	
	
	

class GameControl{
  constructor(){
  }
  update(){
	  test.update();
	  test2.update();
  }
  draw(){
	  test.draw(50,50)
	  test2.draw(100,82)
  }
}

function mainloop(){
requestAnimationFrame(mainloop)
ctx.clearRect(0,0,canvas.width,canvas.height)
GAME.update();
GAME.draw();
}
var GAME = new GameControl()
mainloop()