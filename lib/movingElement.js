var PF = require('pathfinding');
var movingElement = function (start, end, startDelta, color) {
	this.fps = 10;
	this.startTime = new Date().getTime() / 1000;
	this.speed = 10;
	this.start = {
		x: start.x,
		y: start.y
	}
  	this.end = {
		x:end.x,
		y:end.y
	},
	this.ended = false;
	this.path = [];
  	
  	this.color = color;

}

/**
 * step:
 * find hvorlangt den burgte at være
 * find det punkt
 * start ny path der fra
 */
movingElement.prototype.newPath = function(SocketObj) {
	if (this.ended) {
		return;
	}
	var mistInterval = (new Date().getTime() / 1000) - this.startTime;
	console.log(mistInterval);
	var mistPixels = (mistInterval * SocketObj.interval) * this.speed;
	var newStartPoss = this.getSlotFromPixelLength(SocketObj, mistPixels);
	if (newStartPoss === null) {
		this.ended = true;
	}
	console.log("newStartPoss" + newStartPoss);
	var newStartX = Math.floor(newStartPoss.x / SocketObj.tileSize);
	var newStartY = Math.floor(newStartPoss.y / SocketObj.tileSize);
	if (newStartX != this.start.x || newStartY != this.start.y) {
		this.start.x = Math.floor(newStartPoss.x / SocketObj.tileSize);
		this.start.y = Math.floor(newStartPoss.y / SocketObj.tileSize);
		this.startTime = new Date().getTime() / 1000;
	}
	this.findPath(SocketObj);
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

movingElement.prototype.getSlotFromPixelLength = function(SocketObj, pixels) {
	console.log("pixels: " + pixels);
	var foundLength = 0;
	for (var i = 0; i < this.path.length; i++) {
        if (i != 0) {
        	var obj1 = {x: (this.path[i][0] * SocketObj.tileSize), y:(this.path[i][1] * SocketObj.tileSize)};
        	var obj2 = {x: (this.path[i-1][0] * SocketObj.tileSize), y:(this.path[i-1][1] * SocketObj.tileSize)};
        	var newfoundLength = this.lineDistance(obj2, obj1);
        	if (foundLength + newfoundLength >= pixels) {
        		//return {x: obj2.x, y: obj2.y};
        		var needLengtLeft = pixels - foundLength;
				
        		const distance = Math.sqrt(
        			((obj1.x - obj2.x) * (obj1.x - obj2.x)) + 
        			((obj1.y - obj2.y) * (obj1.y - obj2.y))
        			);

				const t = needLengtLeft / distance;
				const x = ((1 - t) * obj2.x) + (t * obj1.x);
				const y = ((1 - t) * obj2.y) + (t * obj1.y);
				return {x: x, y:y};
        	}else{
        		foundLength += newfoundLength;
        	}
        }
    }
    console.log("at end...");
    return null;
}

movingElement.prototype.lineDistance = function(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y)
}

module.exports = movingElement;