const { Map } = require('./case.js')

class Game {
	constructor() {
		this.map = new Map();
	}
	ffa_pos = [[0, 0], [0, 1], [13, 0], [13, 13]];
	tvt_pos = [[0, 1], [13, 12], [1, 0], [12, 13]]
	nb_player = 0;
	windowX = 1600;
	windowY = 900;
	map;
	players = [];
	user = [];
	current = 0;
}

class Menu {
	constructor(key, log) {
		this.admin = log;
		this.type = "ffa";
		this.players = new Array(4);
		this.players[0] = log;
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
		this.pseudo = pseudo;
		this.key = undefined;
	}
}

module.exports = {
	Game, Menu, Log,
}