var socket = io.connect();
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var client;
var interval;

socket.on('init', function (data) {
    console.log(data);
    client = new Client(socket, data, canvas);
    client.render();
    interval = setInterval(loop, 1000 /data.interval);
});

socket.on('update', function (data) {
    client.onSocket(data)
});

socket.on('sme', function() {
    // body...
});

canvas.onclick = function(e){
  client.doClick(e.layerX, e.layerY);
};
var Client = function (socket, firstServerEmit, canvas) {
    this.socket = socket;
    this.can = canvas;
    this.ctx = canvas.getContext('2d');
    this.tiles = firstServerEmit.tiles;
    this.width = firstServerEmit.width;
    this.height = firstServerEmit.height;
    this.tileSize = firstServerEmit.tileSize;
    this.movingElements = firstServerEmit.movingElements;
    this.interval = firstServerEmit.interval;
    this.dalta = 0;
    canvas.width = this.width;
    canvas.height = this.height;
    this.onSocket = function (data) {
        this.tiles = data.tiles;
        this.width = data.width;
        this.height = data.height;
        this.tileSize = data.tileSize;
        this.movingElements = data.movingElements;
        canvas.width = this.width;
        canvas.height = this.height;
        this.render();
        console.log("onSocket");
    }
    this.update = function(){
        this.dalta++;
        for (var i = 0; i < this.movingElements.length; i++) {
            this.movingElement(this.movingElements[i]);
        }

    }
    this.render = function() {
        var start = Date.now();
        this.ctx.fillStyle="white";
        this.ctx.save();
        this.ctx.translate(0, 0);
        this.ctx.clearRect(0, 0, this.width, this.height);

            var tileY = Math.floor(this.height / this.tileSize);
            var tileX = Math.floor(this.width / this.tileSize);
            for (var i = 0; i < tileX; i++) {
                for (var ii = 0; ii < tileY; ii++) {
                    var plotTile = this.tiles[((i * tileX) + ii)];
                    this.ctx.beginPath();
                    this.ctx.lineWidth = "1";
                    this.ctx.strokeStyle = plotTile.style;
                    this.ctx.rect(i* this.tileSize,ii * this.tileSize,this.tileSize,this.tileSize);
                    this.ctx.stroke();
                };
            };
            /*
            this.ctx.beginPath();
            this.ctx.arc((this.Path.end.x * this.tileSize) + (this.tileSize / 2), (this.Path.end.y * this.tileSize) + (this.tileSize / 2), (this.tileSize / 2) / 2, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = 'red';
            this.ctx.fill();*/
            for (var i = 0; i < this.movingElements.length; i++) {
                var element = this.movingElements[i];
                this.ctx.beginPath();
                this.ctx.strokeStyle = '#ff0000';
                for (var ii = 0; ii < element.path.length; ii++) {
                    if (ii == 0) {
                        this.ctx.moveTo((element.path[ii][0] * this.tileSize) + (this.tileSize / 2), (element.path[ii][1] * this.tileSize) + (this.tileSize / 2));
                    }else{
                        this.ctx.lineTo((element.path[ii][0] * this.tileSize) + (this.tileSize / 2), (element.path[ii][1] * this.tileSize) + (this.tileSize / 2));
                    }
                }
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(element.x + (this.tileSize / 2), element.y + (this.tileSize / 2), (this.tileSize / 2) / 2, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = 'green';
                this.ctx.fill();
            }


        this.ctx.restore();

        var end = Date.now();
        this.ctx.font = '16px sans-serif'
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Rendered in ' + (end - start) + ' ms', this.can.width / 2, this.can.height - 35);
    }
    this.doClick = function (x, y) {
        var xTiles = Math.floor(x / this.tileSize) * Math.floor(this.height / this.tileSize);
        var yTiles = Math.floor(y / this.tileSize);
        var tile = yTiles + xTiles;
        this.socket.emit('tileClick', tile);
    }
    this.movingElement = function (element) {
        if ("x" in element && "y" in element && "indexTo" in element) {
            console.log(element);
            var s = this.getMovingWay(element, element.path[element.indexTo]);
            console.log(s);
            if (element.x + (s.x * element.speed) > (element.path[element.indexTo][0] * this.tileSize) && element.x + (s.y * element.speed) > (element.path[element.indexTo][1]) * this.tileSize) {
                //move past last pathPoint, now turn
                if(element.path[element.indexTo + 1]){
                    element.indexTo++;
                }else{
                    console.log("element at end");
                }
            }else{
                element.x += (s.x * element.speed);
                element.y += (s.y * element.speed);     
            }
        }else{
            element.x = (element.start.x * this.tileSize);
            element.y = (element.start.y * this.tileSize);
            element.indexTo = 1;
        }
    }
    this.getMovingWay = function(me,to){
        var x,y;
        if (me.x < (to[0] * this.tileSize)) {
            x = 1;
        }else if(me.x > (to[0] * this.tileSize)){
            x = -1;
        }else{
            x = 0;
        }
        if (me.y < (to[1] * this.tileSize)) {
            y = 1;
        }else if (me.y > (to[1] * this.tileSize)) {
            y = -1;
        }else{
            y = 0;
        }
        return {x:x,y:y};
    }

}
function stop() {
    clearInterval(interval);
}
function loop() {
    client.update();
    client.render();
}