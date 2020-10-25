/* class affichage */
class Aff{
	constructor(state){
		this.state = state;
	}
	display_dmg(spell, enemy, state, game) {
		let damage = spell.dmg;
		let dmg_txt = [];
		let x = 0;
		let inter = setInterval(() =>{
			this.destroy_img(dmg_txt);
			this.construct_img(dmg_txt, enemy, damage, state, game, x);
			x++;
			if (x == 40)
			{
				clearInterval(inter);
				this.destroy_img(dmg_txt);
			}
		}, 33);
	}
	destroy_img(lst) {
		for (let i = 0; i < lst.length; i++){
			if (lst[i])
				lst[i].destroy();
		}
	}
	construct_img(lst, enemys, damage, state, game, x){
		for (let i = 0; i < enemys.length; i++){
			let enemy = state.players[enemys[i]];
			let pos = game.map.img_bloc[enemy.pos[0]][enemy.pos[1]].game_pos;
			lst.push(game.add.text(pos[0], pos[1] - 50 - x, "-" + damage, {
				font: 30 + "px Arial",
				fill: "#800000",
				align: "center"
			}));
		}
	}
}