
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
		let classe =  this.perso.classe;
		if (this.perso.dead == false) {
			this.img = game.add.image(this.bloc.game_pos[0], this.bloc.game_pos[1] - 40, classe.file[classe.rot[0]]).setDisplaySize(classe.dim[0] * classe.fact, classe.dim[1] * classe.fact);
			if (classe.rot[1])
				this.img.flipX = true;
			this.img_grp.push(this.img);
		}
	}
	re_draw(game, bloc, state){
		this.update_data(state);
		this.img.destroy();
		this.bloc = bloc;
		this.draw_perso(game);
	}
	re_draw_enemy(state, game){
		this.update_data(state);
		console.log(state);
		for (let i = 0; i < this.img_enemy.length; i++)
			this.img_enemy[i].destroy();
		this.draw_enemy(game);
	}
	draw_enemy(game){
		for (let i = 0; i < this.enemys.length; i++)
		{
			if (i != this.id && this.enemys[i].dead == false)
			{
				let enemy = this.enemys[i];
				let classe = enemy.classe;
				let bloc = game.map.img_bloc[enemy.pos[0]][enemy.pos[1]];
				let img = game.add.image(bloc.game_pos[0], bloc.game_pos[1] - 40, classe.file[classe.rot[0]]).setDisplaySize(classe.dim[0] * classe.fact, classe.dim[1] * classe.fact);
				if (classe.rot[1])
					img.flipX = true;
				this.img_enemy.push(img);
			}
		}
		this.re_draw(game, this.bloc);
	}
	destroy_all() {
		for (let i = 0; i < this.img_grp.length; i++)
			this.img_grp[i].destroy();
		for (let i = 0; i < this.img_enemy.length; i++)
			this.img_enemy[i].destroy();
	}
	update(state, game) {
		this.update_data();
		this.re_draw(game, this.bloc, state);
		this.re_draw_enemy(state, game);
	}
	update_data(state) {
		if (state != undefined) {
			this.perso = state.players[this.id];
			this.enemys = state.players;
		}
	}
}