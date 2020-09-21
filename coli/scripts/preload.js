/* Parse la map */
function parseFile() {
	part = new Array();
	tab = data_map.split(';');
	map = new Array(tab.length);
	for (let i = 0; i < tab.length; i++) {
		map[i] = new Array(tab[0].length);
	}
	for (let n = 0; n < tab.length; n++) {
		for (let i = 0; i < tab[0].length; i++) {

			map[n][i] = new bloc(n, i, tab[n][i]);
		}
	}
}
/*END*/

/* Charge les images */
function load_hud(game) {
	game.load.image('move', 'asset/hud_move.png');
	game.load.image('pass_t', 'asset/passer_tour.png');
}

function load_map(game) {
    game.load.image('iso_2', 'asset/iso_2.png');
    game.load.image('iso_0', 'asset/iso_0.png');
    game.load.image('iso_2_pair', 'asset/iso_2_pair.png');
    game.load.image('perso', 'asset/perso.png');
}
/*END*/
