class Perso{
	constructor(state, id, game){
		this.perso = state.players[id];
		switch(this.perso.classe)
		{
			case "Iop":
				this.file = "Iop";
		}
		this.bloc = game.map.img_bloc[this.perso.pos[0]][this.perso.pos[1]];
		this.draw_perso(game);
	}
	draw_perso(game){
		this.img = game.add.image(this.bloc.game_pos[0], this.bloc.game_pos[1] - 30, this.file).setDisplaySize(57, 80);
	}
	re_draw(game, bloc){
		this.img.destroy();
		this.bloc = bloc;
		this.draw_perso(game);
	}
}