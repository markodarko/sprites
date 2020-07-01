var canvas = document.getElementById('gamewindow'),
    ctx = canvas.getContext('2d');
const GRID = 32;
const GRID_SQUARE = [GRID,GRID];
const GRID_CENTER = [Math.floor(GRID/2),Math.floor(GRID/2)]
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
			gridScale(1,1),
			[gridScale(1,1),gridScale(2,1),gridScale(3,1),gridScale(4,1)]
			),
		player_jump: new ImgRef(
			0,
			gridScale(1,1),
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
	constructor(spriteName, offsetX = 0, offsetY = 0, frameNum = 0){
		this.imgRef = SPRITE_DATA[spriteName];
		this.frameNum = frameNum;
		this.offset = [offsetX,offsetY];
	}
	draw_scale(x,y,scaleX,scaleY){	
		ctx.save();
		ctx.translate(x,y);
		ctx.scale(scaleX,scaleY);
		this.draw(0,0);
		ctx.restore();
	}
	draw_rotate(x,y,angle){
		ctx.save();
		ctx.translate(x,y);
		ctx.rotate(angle);
		this.draw(0,0);
		ctx.restore();
	}
	draw_transform(x,y,scaleX,scaleY,angle){
		ctx.save();
		ctx.translate(x,y);
		ctx.rotate(angle);
		ctx.scale(scaleX,scaleY);
		this.draw(0,0);
		ctx.restore();
	}
	draw(x,y){
		x -= this.offset[0];
		y -= this.offset[1];
		ctx.drawImage(
			SPRITE_PAGES[this.imgRef.page],
			this.imgRef.coord[this.frameNum][0],
			this.imgRef.coord[this.frameNum][1],
			this.imgRef.size[0],
			this.imgRef.size[1],
			x,
			y,
			this.imgRef.size[0],
			this.imgRef.size[1]
		);
	}
}
class Animated_Sprite extends Sprite{
	constructor(spriteName,offsetX=16,offsetY=16,speed = 10,frameNum = 0){
		super(spriteName,offsetX,offsetY,frameNum);
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
var angle  = 0;
	
	

class GameControl{
  constructor(){
  }
  update(){
	  test.update();
	  test2.update();
  }
  draw(){
	  //test.draw_transform(200,300,2,2,angle*(Math.PI/180))
	//test.draw_scale(200,300,2,2)
	test.draw_rotate(200,300,angle*(Math.PI/180))
	test2.draw(300,300)
  }
}

function mainloop(){
requestAnimationFrame(mainloop)
ctx.clearRect(0,0,canvas.width,canvas.height)
GAME.update();
GAME.draw();
angle = (angle+2)%360
}
var GAME = new GameControl()
mainloop()