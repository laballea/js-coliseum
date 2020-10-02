/* HUD */
/* Class HUD */
class HUD{
    constructor(state, id) {
		this.state = state;
		this.spells = [];
		this.id = id;
    }
    draw_hud(game) {
		let player = this.state.players[this.id];
        this.h_name = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.78, player.name, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pv = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.80, 'PV :' + player.pv, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pm = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.82, 'PM :' + player.pm, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pa = game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.84, 'PA :' + player.pa, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.pass_tour = game.add.image(this.state.windowX * 0.065, this.state.windowY * 0.90, 'pass_t').setInteractive().on('pointerdown', () => {
			game.socket.emit("passe_tour", this.id);
		});
		for (let i = 0; i < player.classe.spells.length; i++)
		{
			this.spells[i] = game.add.image(this.state.windowX * 0.12 + i * 55, this.state.windowY * 0.8, player.classe.spells[i].file).setInteractive().on('pointerdown', () => {
				game.socket.emit("spell_press", player.classe.spells[i].id);
			});
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
}/* END */