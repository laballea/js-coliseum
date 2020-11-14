
class Perso{
	constructor(state, id, game){
		this.perso = state.players[id];
		this.enemys = state.players;
		this.img_enemy = [];
		this.on_move = false;
		this.id = id;
		this.img_grp = new Array();
		this.bloc = game.map.img_bloc[this.perso.pos[0]][this.perso.pos[1]];
		this.draw_perso(game);
		this.draw_enemy(game);
	}
	draw_perso(game){
		if (this.perso.dead == false) {
			this.img = game.add.image(this.bloc.game_pos[0], this.bloc.game_pos[1] - 30, this.perso.classe.file).setDisplaySize(57, 80);
			this.img_grp.push(this.img);
		}
	}
	re_draw(game, bloc){
		this.img.destroy();
		this.bloc = bloc;
		this.draw_perso(game);
	}
	draw_enemy(game){
		for (let i = 0; i < this.enemys.length; i++)
		{
			console.log(this.enemys[i].dead)
			if (i != this.id && this.enemys[i].dead == false)
			{
				let enemy = this.enemys[i];
				let bloc = game.map.img_bloc[enemy.pos[0]][enemy.pos[1]];
				let img = game.add.image(bloc.game_pos[0], bloc.game_pos[1] - 30, this.enemys[i].classe.file).setDisplaySize(57, 80);
				this.img_enemy.push(img);
			}
		}
		this.re_draw(game, this.bloc);
	}
	re_draw_enemy(state, game){
		this.enemys = state.players;
		for (let i = 0; i < this.img_enemy.length; i++)
			this.img_enemy[i].destroy();
		this.draw_enemy(game);
	}
	destroy_all() {
		for (let i = 0; i < this.img_grp.length; i++)
			this.img_grp[i].destroy();
		for (let i = 0; i < this.img_enemy.length; i++)
			this.img_enemy[i].destroy();
	}
	update(state, game) {
		this.perso = state.players[this.id];
		this.enemys = state.players;
		this.re_draw(game, this.bloc);
		this.re_draw_enemy(state, game);
	}
}