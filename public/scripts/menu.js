
class Menu{
	constructor(state, game, id) {
		this.id = id;
		this.state = state;
		this.game = game;
		this.choice = undefined;
		this.choice_png;
		this.grp = new Array();
		this.draw_menu();
	}
	draw_menu() {
		this.grp.push(this.player_select = this.game.add.rectangle(0.5 * this.state.windowX, 0.4 * this.state.windowY, 0.8 * this.state.windowX, 0.5 * this.state.windowY, 0xC0C0C0));
		if (this.state.solo == true)
			this.solo();
		else
			this.multiple();
	}
	draw(key, i, player) {
		let width = 0.19 * this.state.windowX;
		let height = 0.45 * this.state.windowY;
		let posx = (0.2) * this.state.windowX + (i * 0.2 * this.state.windowX);
		let posy = (0.4) * this.state.windowY;
		switch (key){
			case "JOIN_GAME" : {
				this.grp.push(this.game.add.image(0.14 * this.state.windowX, 0.11 * this.state.windowY, "join_game_menu").setDisplaySize(100, 100).setInteractive().on('pointerdown', () => {
					this.game.socket.emit('join_game', prompt("Please enter room's key", "key..."));
				})); break }
			case "HOST_GAME" : {
				this.grp.push(this.game.add.image(0.21 * this.state.windowX, 0.11 * this.state.windowY, "host_game_menu").setDisplaySize(100, 100).setInteractive().on('pointerdown', () => {
					this.game.socket.emit('rdy_to_host');
				})); break }
			case "PLAY_CARD" : {
				this.grp.push(this.game.add.rectangle(posx, posy, width, height,  0xF0F0F0)); break }
			case 'PEN_EDIT' : {
				this.grp.push(this.pen_edit = this.game.add.image(posx + player.pseudo.length * 7, posy * 0.52, "pen_edit").setDisplaySize(10, 20).setInteractive().on('pointerdown', () => {
					let name = prompt("Please enter your name", "name");
					if (name)
						this.game.socket.emit('edit_pseudo', name, i, this.state);
				}));
				this.pen_edit.rotation += 45; break }
			case 'SKIN' : {
				this.grp.push(this.game.add.image(posx, posy, player.classe + "_face").setDisplaySize(125, 204));
				break ;}
			case 'PSEUDO' : {
				let fy = 0.5;
				let col;
				if (player.id == this.id)
					col = "#008000";
				else
					col = "#000000";
				if (this.state.type == "tvt") {
					fy = 0.47;
					this.grp.push(this.game.add.text(posx * 0.9, posy * 0.53, "TEAM #" + player.team, {
						font: "bold 10px Arial",
						fill: "#000000",
						align: "left"
					}));}
				this.grp.push(this.game.add.text(posx * 0.9, posy * fy, player.pseudo, {
					font: "20px Arial",
					fill: col,
					align: "left"
				})); break }
			case 'START_GAME' : {
				this.grp.push(this.game.add.image(0.8 * this.state.windowX, 0.8 * this.state.windowY, "start_game_menu").setDisplaySize(200, 200).setInteractive().on('pointerdown', () => {
					this.game.socket.emit('game_launch', name, i, this.state);
				}));
				break ;}
			case 'KEY' : {
				this.grp.push(this.game.add.text(0.1 * this.state.windowX, 0.05 * this.state.windowY, "Host key : " + this.state.host_key, {
					font: "20px Arial",
					fill: "#FFFFFF",
					align: "center"
				})); break }
			case 'ADMIN' : {
				this.grp.push(this.game.add.text(posx * 0.9, posy * 0.62, 'ADMIN', {
					font: "20px Arial",
					fill: "#FF0000",
					align: "center"
				})); break }
			case 'TYPE_CHOICE' : {
				this.grp.push(this.game.add.image(0.43 * this.state.windowX, 0.7 * this.state.windowY, "ffa_choice_menu").setDisplaySize(175, 175).setInteractive().on('pointerdown', () => {
					if (this.choice != 'ffa') {
						this.choice = "ffa";
						this.game.socket.emit('type_choice', "ffa");
					}
				}));
				this.grp.push(this.game.add.image(0.57 * this.state.windowX, 0.7 * this.state.windowY, "tvt_choice_menu").setDisplaySize(175, 175).setInteractive().on('pointerdown', () => {	
					if (this.choice != 'tvt') {
						this.choice = "tvt";
						this.game.socket.emit('type_choice', "tvt");
					}
				}));
			}
			case 'CROSS' : {
				if (this.state.type == "tvt")
					this.grp.push(this.choice_png = this.game.add.image(0.57 * this.state.windowX + 59, 0.7 * this.state.windowY, "cross_menu").setDisplaySize(150, 150));
				else
					this.grp.push(this.choice_png = this.game.add.image(0.43 * this.state.windowX + 59, 0.7 * this.state.windowY, "cross_menu").setDisplaySize(150, 150));
			}
			case 'CHOOSE_CLASSE' : {
				for (let i = 0; i < this.state.classe.length; i++) {
					let classe = this.state.classe[i];
					this.grp.push(this.game.add.rectangle(posx * 0.9 + i * classe.dim[0] * 0.35, posy * 1.40, classe.dim[0] * 0.3, classe.dim[1] * 0.3, 0xC0C0C0).setInteractive().on('pointerdown', () => {	
						this.game.socket.emit('classe_choice', classe.name);
					}));
					this.grp.push(this.game.add.image(posx * 0.9 + i * classe.dim[0] * 0.35, posy * 1.40, classe.file[3]).setDisplaySize(classe.dim[0] * 0.3, classe.dim[1] * 0.3));
				}
			}
		}
	}
	multiple() {
		if (this.state.admin.id == this.id) {
			this.draw('START_GAME', 0, this.state.admin);
			this.draw('TYPE_CHOICE', 0, this.state.admin);
		}
		else {
			this.grp.push(this.game.add.image(0.43 * this.state.windowX, 0.7 * this.state.windowY, "ffa_choice_menu").setDisplaySize(175, 175));
			this.grp.push(this.game.add.image(0.57 * this.state.windowX, 0.7 * this.state.windowY, "tvt_choice_menu").setDisplaySize(175, 175));
		}
		this.draw('CROSS', 0, this.state.admin);
		for (let i = 0; i < this.state.nb_player; i++) {
			this.draw("PLAY_CARD", i, this.state.players[i]);
			this.draw("SKIN", i, this.state.players[i]);
			if (this.id == this.state.players[i].id) {
				this.draw("PEN_EDIT", i, this.state.players[i]);
				this.draw("CHOOSE_CLASSE", i, this.state.players[i]);
			}
			this.draw("PSEUDO", i, this.state.players[i]);
			if (i == 0)
				this.draw('ADMIN', i, this.state.players[i]);
		}
		this.draw('KEY', 0, this.state.players[this.id]);
	}
	solo() {
		this.draw("HOST_GAME", 0, this.state.admin);
		this.draw("JOIN_GAME", 0, this.state.admin);
		this.draw("PLAY_CARD", 0, this.state.admin);
		this.draw("CHOOSE_CLASSE", 0, this.state.admin);
		this.draw("SKIN", 0, this.state.admin);
		this.draw("PEN_EDIT", 0, this.state.admin);
		this.draw("PSEUDO", 0, this.state.admin);
	}
	delete_menu(){
		for (let i = 0; i < this.grp.length; i++)
			this.grp[i].destroy();
	}
	actualize(state){
		console.log(state);
		this.delete_menu();
		if (state)
			this.state = state;
		this.draw_menu();
	}
	change_game_type(type, state) {
		this.actualize(state)
	}
}
