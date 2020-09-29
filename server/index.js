const express = require('express')
const app = express()
const server = app.listen(3000)
const io = require('socket.io')(server)
const { Game } = require('./game')
const { Map } = require('./case')
const players = require('./players')
const { Player } = require('./players')
var nb_player = 0;
var pos = [[0, 0], [5, 5]]

app.use(express.static('public'))
io.on('connection', (socket) => {
	console.log('a user connected')
	socket.name= "User" + nb_player;
	nb_player++;
	//if (nb_player == 1)
	load_game(socket)
});

function load_game(socket) {
	const game = new Game()
	const board = new Map()
	game.map = board
	game.nbPlayer = nb_player;
	game.players.push(new Player("Iop", "Perso", pos[0], 0, board));
	game.current = 0;
	newJoin(socket, game, 0);
}

function newJoin (socket, game, id)
{
	socket.emit('stateChanged', game, id, 0);
}
