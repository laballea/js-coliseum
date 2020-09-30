/* HUD */
/* Class HUD */
class HUD{
    constructor(state, id) {
		this.state = state;
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
		this.spell1 = game.add.image(this.state.windowX * 0.12, this.state.windowY * 0.8, player.classe.spell1_id).setInteractive().on('pointerdown', () => {
		});
        /*this.game.imageGroup.add(this.pass_tour)
        this.game.imageGroup.add(this.h_pa);
        this.game.imageGroup.add(this.h_pm);
        this.game.imageGroup.add(this.h_pv);
        this.game.imageGroup.add(this.h_name);
        this.game.imageGroup.add(this.spell1);*/
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