var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;
var model = require('./lib/model');
var MovingElement = require('./lib/movingElement');
var interval;

app.use("/", express.static(__dirname + '/site/'));
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/site/index.html');
});
var newMovingElement = new MovingElement({x:0,y:0}, {x:19,y:19}, "green");
newMovingElement.findPath(model.SocketObj, 0);
model.SocketObj.movingElements.push(newMovingElement);
console.log("starter server on port "+port);
server.listen(port);
io.sockets.on('connection', function (socket) {
	console.log("New connection");
	
	socket.on('tileClick', function (data) {
		model.SocketObj.clickTile(data);
		io.sockets.emit("update", model.SocketObj);
	})
	
	socket.emit("init", model.SocketObj);
});

//interval = setInterval(startMovingElement, 3000);

function startMovingElement() {
	io.sockets.emit("sme");
}