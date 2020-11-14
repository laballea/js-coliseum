
function preload_img(game) {
	load_class(game);
	load_map(game);
	load_hud(game);
	load_menu(game);
}

/* Charge les images */
function load_hud(game) {
	game.load.image('move', 'asset/hud_move.png');
	game.load.image('pass_t', 'asset/passer_tour.png');

}

function load_menu(game) {
	game.load.image('pen_edit', 'asset/menu_png/pen_edit.png');
	game.load.image('join_game_menu', 'asset/menu_png/join_game_menu.png');
	game.load.image('start_game_menu', 'asset/menu_png/start_game_menu.png');
	game.load.image('host_game_menu', 'asset/menu_png/host_game_menu.png');
	game.load.image('tvt_choice_menu', 'asset/menu_png/tvt_choice.png');
	game.load.image('ffa_choice_menu', 'asset/menu_png/ffa_choice.png');
	game.load.image('cross_menu', 'asset/menu_png/cross.png');
}

function load_map(game) {
    game.load.image('iso_2', 'asset/iso_2.png');
    game.load.image('iso_0', 'asset/iso_0.png');
    game.load.image('iso_2_pair', 'asset/iso_2_pair.png');
}
function load_class(game) {
    game.load.image('Iop', 'asset/Iop.png');
	game.load.image('Iop_spell_0', 'asset/Iop_spell_0.png');
	game.load.image('Iop_spell_1', 'asset/Iop_spell_1.png');
	game.load.image('Iop_spell_2', 'asset/Iop_spell_2.png');
}
/*END*/
