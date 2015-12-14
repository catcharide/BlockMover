function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};
$(function(){
	console.log("Main init called");
	init();
});

var blocks = [];

var moveQueue = new Queue();

function Block(startX,startY,width,height,color,name){

	this.startX = startX;
	this.startY = startY;
	this.width = width;
	this.height = height;
	this.color = color;
	this.name = name;
	this.finalX = startX;
	this.finalY = startY;
}

function putOn(blockA,blockB){
	console.log("putOn",blockA.color,blockB.color);
	
	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");

	var width = canvas.width;

	var height = canvas.height;
	var newX = blockB.startX;
	var newY = blockB.startY - blockA.height;

	clearTop(blockB);

	clearTop(blockA);

	var blockAIndex = 0;
	for(var i=0;i<blocks.length;i++){
		if(blocks[i].name == blockA.name){
			blockAIndex = i;
			blockA = blocks[i];
		}
		if(blocks[i].name == blockB.name){
			blockB = blocks[i];
		}
	}

	blocks[blockAIndex].finalX = blockB.finalX ;
	blocks[blockAIndex].finalY = blockB.finalY - blockA.height ;

	console.log("Enqueuing here",blocks[blockAIndex].color);
	moveQueue.enqueue(blocks[blockAIndex]);

	console.log("Sort here");

	blocks.sort(function(bA,bB){
		var val = bA.finalX - bB.finalX ;
		if(val != 0 ) return val;
		return bB.finalY - bA.finalY ;
	});

	for(var i=0;i<blocks.length;i++){
		console.log(blocks[i].color);
	}

	var moveUp = true;
	var moveSideways = true;
	var moveDown = true;

	console.log("Finally Here");

	//console.log(moveQueue);

	var timer = setInterval(function(){
		if(!moveQueue.isEmpty()){

			block = moveQueue.peek();
			var whichSide = ( block.startX < block.finalX ) ? 1 : -1;
			if(block.startX == block.finalX && block.startY == block.finalY){
				moveQueue.dequeue();
				console.log("Dequeue them",block.color);
				moveUp = true;
				moveDown = true;
				moveSideways = true;
			}else{
				if( block.startY > height/20 && moveUp){
					block.startY = block.startY-1;
					moveMahAss(block,block.startX,block.startY);
				}
				else{
					moveUp = false;

					if(block.startX != block.finalX && moveSideways ){

						block.startX = block.startX + whichSide;
						moveMahAss(block,block.startX,block.startY);
					}else{
						moveSideways = false;
						if(block.startY != block.finalY){
							block.startY = block.startY + 1;
							moveMahAss(block,block.startX,block.startY);
						}else{
							moveDown = false;
						}
					}
				}
			}
		}else{
			clearInterval(timer);
		}
	},15);

}

// checks if blocks top is clear or if not 
function checkIfTopIsClear(block){

	console.log("checkIfTopIsClear",block.color);

	for(var i=0;i<blocks.length;i++){
		console.log(blocks[i].color);
	}

	for(var i=0;i<blocks.length-1;i++){

		if(blocks[i].name == block.name){

			if(blocks[i].finalY == (blocks[i+1].finalY + blocks[i+1].height)){

				if(blocks[i].finalX == blocks[i+1].finalX){

					return false;

				}

				break;

			}

		}

	}

	return true;
}

function onTop(block){

	//console.log("onTop",block.color);
	for(var i=0;i<blocks.length-1;i++){

		if(blocks[i].name == block.name){

			return blocks[i+1];

		}

	}

	// unreachable .. :)   *,...,*
	return false;
}

function clearTop(block){

	console.log("clearTop",block.color);

	if(!checkIfTopIsClear(block)){

		clearTop(onTop(block));
		return putOnTable(onTop(block));

	}

	return "We are done";
}

function putOnTable(block){

	console.log("putOnTable",block.color);

	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");

	var width = canvas.width;

	var height = canvas.height;

	var startX = width/10;
	var startY = 3*height/4;
	var len = 8*width/10;

	//check if already on table
	var myIndex = 0;
	for(var i=0;i<blocks.length;i++){
		if(block.name == blocks[i].name){
			block = blocks[i];
			if(blocks[i].finalY + blocks[i].height == startY)
				return true;
			break;
		}


	}

	var newX = startX;
	var newY = startY - block.height;

	if(startX + block.width > blocks[0].startX){
		for(var i=0;i<blocks.length-1;i++){

			if(blocks[i].finalX + blocks[i].width + block.width <= blocks[i+1].finalX){
				newX = blocks[i].finalX + blocks[i].width;
				break;
			}

		}
	}

	if( blocks[blocks.length-1].finalX + blocks[blocks.length-1].width + block.width <= startX + len){
		newX = blocks[blocks.length-1].finalX + blocks[blocks.length-1].width;
	}

	console.log("block Final Pos",block.color,newX,newY);

	for(var i=0;i<blocks.length;i++){
		if(blocks[i].name == block.name){
			myIndex = i;
			break;
		}
	}

	blocks[myIndex].finalX = newX;
	blocks[myIndex].finalY = newY;

	console.log("Enqueuing ",blocks[myIndex].color);
	moveQueue.enqueue(blocks[myIndex]);

	blocks.sort(function(bA,bB){
		var val = bA.finalX - bB.finalX ;
		if(val != 0 ) return val;
		return bB.finalY - bA.finalY ;
	});

	console.log("After sort");

	for(var i=0;i<blocks.length;i++){
		console.log(blocks[i].color);
	}
}

function moveMahAss(block,newX,newY){

	//console.log("moveMahAss",block.name,newX,newY);

	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");

	var width = canvas.width;

	var height = canvas.height;

	var startX = width/10;
	var startY = 3*height/4;
	var len = 8*width/10;
	var breadth = height/15;


	for(var i=0;i<blocks.length;i++){

		if(blocks[i].name == block.name){
			blocks[i].startX = newX;
			blocks[i].startY = newY;
			break;
		}

	}

	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

	drawTable(startX,startY,len,breadth);

	for(var i=0;i<blocks.length;i++){
		//console.log("Draw Block",blocks[i].width,blocks[i].height,blocks[i].name);
		drawBlock(blocks[i]);
		if(blocks[i].name == block.name){
			drawPicker(blocks[i]);
		}

	}
}

function init(){

	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");

	var width = canvas.width;

	var height = canvas.height;

	var startX = width/10;
	var startY = 3*height/4;
	var len = 8*width/10;
	var breadth = height/15;


	drawTable(startX,startY,len,breadth);

	// initialising position of blocks on table

	var boxWidth = (2*width/20);

	var boxHeight = (2*height/20);



	var blockA = new Block(startX+len/10,startY - boxHeight,boxWidth,boxHeight,"blue","A");
	console.log("BlockA",blockA.startX,blockA.startY);

	var blockB = new Block(startX+len/10,startY - 2*boxHeight,boxWidth,boxHeight,"yellow","B");

	var blockE = new Block(startX+len/10,startY - 3*boxHeight,boxWidth,boxHeight,"red","E");

	var blockF = new Block(startX+len/10,startY - 4*boxHeight,boxWidth,boxHeight,"pink","F");


	var blockC = new Block(startX+4*len/10,startY - boxHeight,boxWidth,boxHeight,"green","C");

	var blockD = new Block(startX+4*len/10,startY - 2*boxHeight,boxWidth,boxHeight,"orange","D");




	blocks = [blockA,blockB,blockC,blockD,blockE,blockF];
	blocks.sort(function(bA,bB){
		var val = bA.finalX - bB.finalX ;
		if(val != 0 ) return val;
		return bB.finalY - bA.finalY ;
	});

	for(var i=0;i<blocks.length;i++){
		//console.log("Draw Block",blocks[i].width,blocks[i].height,blocks[i].name);
		drawBlock(blocks[i]);

	}
}

function drawBlock(block){
	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.rect(block.startX,block.startY, block.width,block.height);
    ctx.fillStyle = block.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawTable(x,y,len,height){
	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");
	ctx.beginPath();

	ctx.rect(x,y, len,height);
    ctx.fillStyle = 'brown';
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.beginPath();
    
    ctx.rect(x+len/8,y+height,len/8,len/10);
    ctx.fillStyle = 'brown';
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.beginPath();

    ctx.rect(x+len-len/4,y+height,len/8,len/10);
    ctx.fillStyle = 'brown';
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawPicker(block){
	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");
	ctx.beginPath();

	ctx.rect(block.startX+(block.width/3),0,(block.width/3),block.startY);
	ctx.fillStyle = 'black';
	ctx.fill();

	ctx.beginPath();

	ctx.rect(block.startX+(block.width/4),block.startY - (block.height/3),block.width/2,block.height/3);
	ctx.fillStyle = 'black';
	ctx.fill();
}