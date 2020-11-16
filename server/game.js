const { Map } = require('./case.js');
const { Cra } = require('./Iop.js');
const { Iop }= require('./Iop.js');

class Game {
	constructor() {
		this.map = new Map();
	}
	ffa_pos = [[0, 0], [0, 13 ], [13, 0], [13, 13]];
	tvt_pos = [[0, 1], [13, 12], [1, 0], [12, 13]]
	nb_player = 0;
	windowX = 1600;
	windowY = 900;
	map;
	players = [];
	user = [];
	current = 0;
	alive() {
		let tmp = undefined;
		for (let i = 0; i < this.nb_player; i++){
			if (this.players[i].dead == false) {
				if (tmp != undefined) {
					if (tmp != this.players.team)
						return (true);
				}
				tmp = this.players.team;
			}
		}
		return (false);
	}
}

class Menu {
	constructor(key, log) {
		this.admin = log;
		this.type = "ffa";
		this.players = new Array(4);
		this.players[0] = log;
		this.classe = [new Iop(), new Cra()];
		this.host_key = key;
		this.nb_player = 1;
		this.solo = true;
	}
	windowX = 1600
	windowY = 900
}

class Log {
	constructor(id, pseudo) {
		this.id = id;
		this.team = 1;
		this.classe = "Cra";
		this.pseudo = pseudo;
		this.key = undefined;
	}
}

module.exports = {
	Game, Menu, Log,
}