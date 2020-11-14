const express = require('express')
const app = express()
const server = app.listen(process.env.PORT || 8000)
const io = require('socket.io')(server)

const { Game } = require('./game')
const game = require('./game')
const { Menu } = require('./game')
const { Log } = require('./game')
const { Player } = require('./players')

let nb_player = 0;
app.use(express.static('public'))
io.on('connection', (socket) => {
	console.log('a user connected')
	let inter = setInterval(() =>{
		if (socket.disconnected)
		{
			socket.removeAllListeners();
			clearInterval(inter);
		}
	}, 1000);
	load_game(socket)
});

function load_game(socket) {
	var user = new User(new Log(rdm_key('INT'), "Player " + nb_player++), socket);
	user.menu();
}

function rdm_key(type) {
	let key = "";
	let a;
	let b;
	if (type == "INT") {
		a = 48;
		b = 9;
	}
	else if (type == "CHAR") {
		a = 65;
		b = 25;
	}
	for (let i = 0; i < 6; i++)
		key += String.fromCharCode(a + Math.floor((Math.random() * b) + 1));
	return (key);
}

var games = new Map();
class User {
	constructor(log, socket) {
		this.log = log;
		this.socket = socket;
		this.game;
		this._menu = new Menu(undefined, log);
	}
	games_id(game)
	{
		for (let i = 0; i < game.nb_player; i++) {
			if (game.players[i].id == this.log.id)
				return (i);
		}
	}
	menu()
	{
		let id = this.log.id;
		this.socket.emit('menu', this._menu, id);
		this.socket.on('rdy_to_host', () => {
			this.log.key = rdm_key('CHAR');
			games.set(this.log.key, [undefined, this._menu]);
			this._menu.solo = false;
			this._menu.host_key = this.log.key;
			this.socket.join(this.log.key);
			this.socket.emit('new_menu', games.get(this.log.key)[1]);
		});
		this.socket.on('type_choice', (type) => {
			this._menu.type = type;
			io.to(this.log.key).emit('change_type', type, this._menu);
		});
		this.socket.on('join_game', (data) =>{
			this.log.key = data;
			this.socket.join(data);
			var lobby = games.get(this.log.key);
			lobby[1].players[lobby[1].nb_player] = this.log;
			lobby[1].nb_player++;
			io.to(this.log.key).emit('new_menu', games.get(this.log.key)[1]);
		});
		this.socket.on('edit_pseudo', (data, i, _menu) =>{
			this.log.pseudo = data;
			if (this.log.key)
				io.to(this.log.key).emit('new_menu', games.get(this.log.key)[1]);
			else
				this.socket.emit("new_menu", this._menu);
		});
		this.socket.on('game_launch', () =>{
			this.game = new Game();
			this.game.current = 0;
			this.game.key = this.log.key;
			this.game.nb_player = this._menu.nb_player;
			games.get(this.log.key)[0] = this.game;
			for (let i = 0; i < this._menu.nb_player; i++) {
				if (this._menu.type == "tvt")
				this.game.players.push(new Player("Iop", this._menu.players[i], (this._menu.type == "tvt" ? this.game.tvt_pos[i] : this.game.ffa_pos[i]), this.game.map, i));
			}
			io.to(this._menu.host_key).emit('rdy_to_launch');	
		});
		this.socket.on('rdy_to_launch', () => {
			this.ft_game(games.get(this.log.key)[0], this.games_id(games.get(this.log.key)[0]));
			this.socket.emit('destroy_menu');
		});
	}
	not_dead(game) {
		let nb = 0;
		for (let i = 0; i < game.players.length; i++) {
			if (game.players[i].dead == false)
				nb++;
		}
		return (nb);
	}
	ft_died(enemys, game) {
		let lst = [];
		for (let i = 0; i < enemys.length; i++) {
			if (game.players[enemys[i]].dead == true) {
				game.players[enemys[i]].bloc.isPers = undefined;
				lst.push(enemys[i]);
			}
		}
		if ((lst.length > 0 ? lst : undefined) != undefined) {
			io.to(game.key).emit('died', game, lst);
			if (this.not_dead(game) <= 1)
				io.to(game.key).emit('end_game');
		}
	}
	ft_game(game, id)
	{
		game.current_player = game.players[0];
		this.socket.emit('stateChanged', game, id, 0);
		this.socket.on('previsu', (data) =>{
			if (game.players[id].dead == false) {
				if (game.players[id].classe.act_spell == undefined && game.players[id].on_move == false)
					this.socket.emit('end_previsu', game.players[id].pf.pathfinding(data, game.players[id]));
			}
		});
		this.socket.on('spell_press', (spell_id) =>{
			if (game.players[id].dead == false) {
				this.socket.emit('preshow_range', game.players[id].classe.spells[spell_id].pre_show(game.players[id], game.map),
					game.players[id].classe.spells[spell_id].al_show, game.players[id]);
			}
		});
		this.socket.on('over_spell', (spell_id, obj)=> {
			if (game.players[id].dead == false) {
				this.socket.emit('previsu_zone', game.players[id].classe.spells[spell_id].spell_zone(obj, game.map, game.players[id]));
			}
		});
		this.socket.on('attack', (obj) =>{
			if (game.players[id].dead == false && game.current_player == game.players[id]) {
				let enemys;
				enemys = game.players[id].get_enemy(game.players[id].classe.act_spell.spell_zone(obj, game.map));
				if (game.players[id].classe.act_spell.do(game.players[id], enemys, game)) {
					io.to(game.key).emit('attacked', game, game.players[id].classe.act_spell, enemys);
					this.ft_died(enemys, game);
				}
			}
		});
		this.socket.on('move', (path) =>{
			if (game.players[id].dead == false) {
				if (game.current_player == game.players[id] && game.players[id].on_move == false)
				{
					var i = 0;
					game.players[id].on_move = true;
					var intID = setInterval(() =>{
						game.players[id].move(path[i].data.posx, path[i].data.posy);
						io.to(game.key).emit('change_pos', game, id);
						if (i == path.length - 1) {
							game.players[id].on_move = false;
							clearInterval(intID);
						}
						i++;
					}, 100);
				}
		}
		});
		this.socket.on('passe_tour', (id) =>{
			if (game.current_player == game.players[id])
			{
				game.players[id].reset();
				let n = id;
				while (game.nb_player > 1 && (game.players[n].dead == true || n == id)) {
					n++;
					if (n >= game.nb_player)
						n = 0;
				}
				if (n == id) {
					io.to(game.key).emit('end_game');
				}
				else {
					game.current_player = game.players[n];
					this.socket.emit('end_tour', game, id);
				}
			}
		});
		this.socket.on('end_game', () =>{
			io.to(game.key).emit('end_game');
		});
		this.socket.on('game_end', (data) =>{
			this._menu.solo = true;
			this._menu.key = undefined;
			this.socket.removeAllListeners();
			this.menu();
		});
	}
}
