var SocketObj = function () {
	this.tiles = [];
  	this.width = 500;
  	this.height = 500;
  	this.tileSize = 25;
  	this.movingElements = Array();
  	this.io;
}
SocketObj.prototype.update = function(delta) {
	for (var i = 0; i < this.movingElements.length; i++) {
		this.movingElements[i].update(delta);
	}
};
SocketObj.prototype.setSocket = function(io) {
	this.io = io;
};
SocketObj.prototype.clickTile = function(field) {
	var tile = this.tiles[field];
	if (tile.style == "yellow") {
		tile.style = "black";
	}else{
		tile.style = "yellow";
	}
	this.findPath();
}
SocketObj.prototype.findPath = function() {
	for (var i = 0; i < this.movingElements.length; i++) {
		this.movingElements[i].newPath(this);
	}
}
var Tile = function () {
	this.style = "black";
	this.raduis = 15;
}
var MoveElement = function () {
	
}
module.exports = {
	SocketObj: new SocketObj,
	Tile: Tile,
	MoveElement: MoveElement
}

for (var i = 0; i < (500 * 500) /25; i++) {
	module.exports.SocketObj.tiles.push(new Tile());
}