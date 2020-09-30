const express = require('express')
const app = express()
const server = app.listen(8000)
const io = require('socket.io')(server)
const { Game } = require('./game')
const { Map } = require('./case')
//const players = require('./players')
const { Player } = require('./players')

var nb_player = 0;
var pos = [[0, 0], [5, 5]]
var game = new Game();
var board = new Map();
app.use(express.static('public'))
io.on('connection', (socket) => {
	console.log('a user connected')
	socket.name= "User" + nb_player;
	load_game(socket)
});

function load_game(socket) {
	game.map = board;
	game.nbPlayer = nb_player;
	game.players.push(new Player("Iop", "Perso", pos[nb_player], nb_player, board));
	game.current = 0;
	newJoin(socket, game, nb_player++);
}

function newJoin (socket, game, id)
{
	game.current_player = game.players[0];
	socket.emit('stateChanged', game, id, 0);
	if (id >= 1)
		io.emit("new_log", game);
	socket.on('previsu', (data) =>{
		socket.emit('end_previsu', game.players[id].pf.pathfinding(data, game.players[id]));
	});
	socket.on('move', (path) =>{
		if (game.current_player == game.players[id])
		{
			var i = 0;
			var intID = setInterval(() =>{
				game.players[id].move(path[i].data.posx, path[i].data.posy);
				io.emit('change_pos', game, id);
				if (i == path.length - 1)
					clearInterval(intID);
				i++;
			}, 100);
		}
	});
	socket.on('passe_tour', (id) =>{
		if (game.current_player == game.players[id])
		{
			game.players[id].reset();
			let n = id;
			if (n + 1 == nb_player)
				n = 0;
			else
				n++;
			game.current_player = game.players[n];
			socket.emit('end_tour', game, id);
		}
	})
}
