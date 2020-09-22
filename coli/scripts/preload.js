/* Parse la map */

function parse_file() {
	map = new Array(test.length);
	for (let i = 0; i < test.length; i++) {
		map[i] = new Array(test[0].length);
	}
	for (let n = 0; n < test.length; n++) {
		for (let i = 0; i < test[0].length; i++) {
			map[n][i] = new bloc(n, i, test[n][i]);
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
