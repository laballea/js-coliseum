/* HUD */
/* Class HUD */
class HUD{
    constructor(state, id) {
        this.state = state;
        this.img_grp = new Array();
		this.spells = [];
		this.id = id;
    }
    draw_hud(game) {
        let player = this.state.players[this.id];
        if (player.team != undefined) {
            this.img_grp.push(this.team = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.78, "Team #" + player.team, {
                font: "bold 15px Arial",
                fill: "#64524E",
                align: "center"
            }));
        }
        this.img_grp.push(this.h_name = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.76, player.pseudo + "   id : " + player.id, {
            font: "bold 15px Arial",
            fill: "#64524E",
            align: "center"
        }));
        this.img_grp.push(this.h_pv = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.80, 'PV :' + player.pv, {
            font: "bold 15px Arial",
            fill: "#64524E",
            align: "center"
        }));
        this.img_grp.push(this.h_pm = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.82, 'PM :' + player.pm, {
            font: "bold 15px Arial",
            fill: "#64524E",
            align: "center"
        }));
        this.img_grp.push(this.h_pa = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.84, 'PA :' + player.pa, {
            font: "bold 15px Arial",
            fill: "#64524E",
            align: "center"
        }));
        this.img_grp.push(this.end_game = game.add.image(this.state.windowX * 0.8, this.state.windowY * 0.90, 'quitter').setInteractive().on('pointerdown', () => {
			game.socket.emit("end_game");
		}));
        this.img_grp.push(this.pass_tour = game.add.image(this.state.windowX * 0.065, this.state.windowY * 0.90, 'pass_t').setInteractive().on('pointerdown', () => {
			game.socket.emit("passe_tour", this.id);
		}));
		for (let i = 0; i < player.classe.spells.length; i++)
		{
			this.img_grp.push(this.spells[i] = game.add.image(this.state.windowX * 0.20 + i * 55, this.state.windowY * 0.8, player.classe.spells[i].file).setInteractive().on('pointerdown', () => {
				game.socket.emit("spell_press", player.classe.spells[i].id);
			}));
		}
    }
    re_draw(state, game) {
		this.state = state;
        this.h_pm.destroy();
        this.h_name.destroy();
        this.h_pv.destroy();
		this.h_pa.destroy();
		this.pass_tour.destroy();
        this.draw_hud(game);
    }
    win(winners, game) {
        let txt;
        if (winners == 0)
            txt = "U NOOB.";
        else if (winners[0] == "tvt")
            txt = "Team " + winners[1] + " win !";
        else if (winners[0] == "ffa")
            txt = winners[1].pseudo + " win !";
        this.img_grp.push(this.winn = game.add.text(this.state.windowX * 0.4, this.state.windowY * 0.4, txt, {
            font: "100px Arial",
            fill: "red",
            align: "center"
        }));
    }
    disconnected(data, game) {
        this.img_grp.push(game.add.text(this.state.windowX * 0.4, this.state.windowY * 0.4, "Player : " + data.pseudo + " disonnected, game will end soon.", {
            font: "100px Arial",
            fill: "red",
            align: "center"
        }));
    }
    destroy_all() {
        for (let i = 0; i < this.img_grp.length; i++) {
            this.img_grp[i].destroy();
        }
    }
}/* END */