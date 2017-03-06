var PF = require('pathfinding');
var SocketObj = function () {
    this.tiles = [];
    this.width = 500;
    this.height = 500;
    this.tileSize = 25;
    this.movingElements = Array();
}
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
    var tileHeight = this.height / this.tileSize;
    var tileWidth = this.width / this.tileSize;
    
    var matrix = new Array(tileWidth);
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(tileHeight);
    }
    var index = 0;
    for (var ii = 0; ii < matrix.length; ii++) {
        for (var iii = 0; iii < matrix[ii].length; iii++) {
            //console.log(iii + " "+ ii);
            matrix[iii][ii] = this.tiles[index].style == "black" ? 0 : 1; 
            index++;
        };
    };
    console.log(matrix);
    var grid = new PF.Grid(tileWidth, tileHeight, matrix);
    
    var finder = new PF.AStarFinder({
        allowDiagonal: true,
        dontCrossCorners: true
    });

    var path = finder.findPath(this.Path.start.x, this.Path.start.y, this.Path.end.x, this.Path.end.y, grid);
    var newPath = PF.Util.compressPath(path);
    console.log(newPath);
    this.Path.path = newPath;
}
var Tile = function () {
    this.style = "black";
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