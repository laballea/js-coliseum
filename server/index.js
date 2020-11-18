const express = require('express')
const app = express()
const server = app.listen(process.env.PORT || 8000)
const io = require('socket.io')(server)

const { Game } = require('./game')
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
	var user = new User(new Log(rdm_key('INT', 4), "Player " + nb_player++), socket);
	user.menu();
}

function rdm_key(type, length) {
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
	for (let i = 0; i < length; i++)
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
		if (this.log.key != undefined)
			this.socket.emit('menu', games.get(this.log.key)[1], id);
		else if (this.log.key == undefined)
			this.socket.emit('menu', this._menu, id);
		this.socket.on('rdy_to_host', () => {
			this.log.key = rdm_key('CHAR', 6);
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
		this.socket.on('classe_choice', (data) => {
			this.log.classe = data;
			if (this.log.key)
				io.to(this.log.key).emit('new_menu', games.get(this.log.key)[1]);
			else
				this.socket.emit("new_menu", this._menu);
		});
		this.socket.on('join_game', (data) =>{
			if (games.get(data) != undefined) {
				this.log.key = data;
				this.socket.join(data);
				var lobby = games.get(this.log.key);
				lobby[1].players[lobby[1].nb_player] = this.log;
				this.log.team = (nb_player - 1) % 2 + 1;
				lobby[1].nb_player++;
				io.to(this.log.key).emit('new_menu', games.get(this.log.key)[1]);
			}
			else
				this.socket.emit('game_not_found', data);
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
				this.game.players.push(new Player(this._menu.players[i].classe, this._menu.players[i], (this._menu.type == "tvt" ? this.game.tvt_pos[i] : this.game.ffa_pos[i]), this.game.map, i));
			}
			io.to(this._menu.host_key).emit('rdy_to_launch');	
		});
		this.socket.on('rdy_to_launch', () => {
			this.ft_game(games.get(this.log.key)[0], this.games_id(games.get(this.log.key)[0]));
			this.socket.emit('destroy_menu');
		});
	}
	does_win(game) {
		let lst = [];
		for (let i = 0; i < game.players.length; i++) {
			if (game.players[i].dead == false)
				lst.push(game.players[i]);
		}
		if (lst.length == 0)
			return (0);
		if (this._menu.type == "ffa") {
			if (lst.length == 1)
				return ([this._menu.type, lst[0]]);
			else
				return (undefined);
		}
		else {
			let tmp = undefined;
			for (let i = 0; i < lst.length; i++) {
				if (tmp == undefined)
					tmp = lst[i].team;
				if (tmp != lst[i].team)
					return (undefined);
			}
			return ([this._menu.type, tmp]);
		}
	}
	ft_died(enemys, game) {
		let ret;
		let lst = [];
		for (let i = 0; i < enemys.length; i++) {
			if (game.players[enemys[i]].dead == true) {
				game.players[enemys[i]].bloc.isPers = undefined;
				lst.push(enemys[i]);
			}
		}
		if ((lst.length > 0 ? lst : undefined) != undefined) {
			io.to(game.key).emit('died', game, lst);
			if ((ret = this.does_win(game)) != undefined)
				io.to(game.key).emit('end_game', ret);
		}
	}
	ft_game(game, id)
	{
		game.current_player = game.players[0];
		this.socket.emit('stateChanged', game, id, 0);
		this.socket.on('azerty', () => {
			this.socket.emit('qwerty');
		});
		this.socket.on('previsu', (pos) =>{
			if (game.players[id].dead == false) {
				if (game.players[id].classe.act_spell == undefined && game.players[id].on_move == false) {
					this.socket.emit('end_previsu', game.players[id].pf.pathfinding(game.map.t_map[pos[0]][pos[1]], game.players[id]));
				}
			}
		});
		this.socket.on('spell_press', (spell_id) =>{
			if (game.players[id].dead == false) {
				this.socket.emit('preshow_range', game.players[id].classe.spells[spell_id].pre_show(game.players[id], game.map),
					game.players[id].classe.spells[spell_id].al_show, game.players[id]);
			}
		});
		this.socket.on('over_spell', (spell_id, pos)=> {
			if (game.players[id].dead == false) {
				let start = Date.now();
				this.socket.emit('previsu_zone', game.players[id].classe.spells[spell_id].spell_zone(game.map.t_map[pos[0]][pos[1]], game.map, game.players[id]));
				console.log(Date.now() - start);
			}
		});
		this.socket.on('attack', (pos) =>{
			if (game.players[id].dead == false && game.current_player == game.players[id]) {
				let enemys;
				enemys = game.players[id].get_enemy(game.players[id].classe.act_spell.spell_zone(game.map.t_map[pos[0]][pos[1]], game.map, game.players[id]));
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
				if (game.nb_player > 1) {
					while ((game.players[n].dead == true || n == id)) {
						n++;
						if (n >= game.nb_player)
							n = 0;
					}
				}
				game.current_player = game.players[n];
				this.socket.emit('end_tour', game, id);
			}
		});
		this.socket.on('end_game', () =>{
			io.to(game.key).emit('end_game', false);
		});
		this.socket.on('game_end', () =>{
			this._menu.solo = false;
			this.socket.removeAllListeners();
			this.menu();
		});
	}
}
