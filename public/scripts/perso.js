
class Perso{
	constructor(state, id, game){
		this.perso = state.players[id];
		this.enemys = state.players;
		this.img_enemy = [];
		this.id = id;
		this.bloc = game.map.img_bloc[this.perso.pos[0]][this.perso.pos[1]];
		this.draw_perso(game);
		this.draw_enemy(game);
	}
	draw_perso(game){
		this.img = game.add.image(this.bloc.game_pos[0], this.bloc.game_pos[1] - 30, this.perso.classe.file).setDisplaySize(57, 80);
	}
	re_draw(game, bloc){
		this.img.destroy();
		this.bloc = bloc;
		this.draw_perso(game);
	}
	draw_enemy(game){
		for (let i = 0; i < this.enemys.length; i++)
		{
			if (i != this.id)
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
}