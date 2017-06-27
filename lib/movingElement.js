var PF = require('pathfinding');
var movingElement = function (start, end, color, SocketObj) {
	this.fps = 10;
	this.startTime = new Date().getTime() / 1000;
	this.speed = 10;
	this.start = {
		x: start.x,
		y: start.y
	}
  	this.end = {
		x: end.x,
		y: end.y
	},
	this.poss = {
		x: start.x,
		y: start.y,
		indexTo: 1
	},
	this.ended = false;
	this.path = [];
  	
  	this.color = color;
  	this.SocketObj = SocketObj;
}

movingElement.prototype.update = function(){
	this.movingElement();
}
movingElement.prototype.movingElement = function () {

        var x,y;
        if (this.poss.x < (this.path[this.poss.indexTo][0] * this.SocketObj.tileSize)) {
            x = 1;
        }else if(this.poss.x > (this.path[this.poss.indexTo][0] * this.SocketObj.tileSize)){
            x = -1;
        }else{
            x = 0;
        }
        if (this.poss.y < (this.path[this.poss.indexTo][1] * this.SocketObj.tileSize)) {
            y = 1;
        }else if (this.poss.y > (this.path[this.poss.indexTo][1] * this.SocketObj.tileSize)) {
            y = -1;
        }else{
            y = 0;
        }
        if (this.poss.x + (x * this.speed) > (this.path[this.poss.indexTo][0] * this.SocketObj.tileSize) && this.poss.x + (y * this.speed) > (this.path[this.poss.indexTo][1]) * this.SocketObj.tileSize) {
            //move past last pathPoint, now turn
            if(this.path[this.poss.indexTo + 1]){
                this.poss.indexTo++;
            }else{
                console.log("element at end");
            }
        }else{
            this.poss.x += (x * this.speed);
            this.poss.y += (y * this.speed);     
        }
    }
movingElement.prototype.findPath = function(SocketObj) {
	
	var tileHeight = SocketObj.height / SocketObj.tileSize;
	var tileWidth = SocketObj.width / SocketObj.tileSize;
	
	var matrix = new Array(tileWidth);
	for (var i = 0; i < matrix.length; i++) {
		matrix[i] = new Array(tileHeight);
	}
	var index = 0;
	for (var ii = 0; ii < matrix.length; ii++) {
		for (var iii = 0; iii < matrix[ii].length; iii++) {
			//console.log(iii + " "+ ii);
			matrix[iii][ii] = SocketObj.tiles[index].style == "black" ? 0 : 1; 
			index++;
		};
	};
	//console.log(matrix);
	var grid = new PF.Grid(tileWidth, tileHeight, matrix);
    
    var finder = new PF.AStarFinder({
        allowDiagonal: true,
        dontCrossCorners: true
    });

    var path = finder.findPath(this.start.x, this.start.y, this.end.x, this.end.y, grid);
    var newPath = PF.Util.compressPath(path);
    console.log(newPath);
    this.path = newPath;
}


module.exports = movingElement;