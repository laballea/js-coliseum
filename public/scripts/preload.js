
function preload_img(game) {
	load_class(game);
	load_map(game);
	load_hud(game);
	load_menu(game);
}

/* Charge les images */
function load_hud(game) {
	game.load.image('pass_t', 'asset/passer_tour.png');
	game.load.image('quitter', 'asset/quitter.png');

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
	load_cra(game);
	load_iop(game);
}
function load_cra(game) {
	game.load.image('Cra_3q_dos', 'asset/Cra/Cra_3q_dos.png');
	game.load.image('Cra_3q_face', 'asset/Cra/Cra_3q_face.png');
	game.load.image('Cra_dos', 'asset/Cra/Cra_dos.png');
	game.load.image('Cra_face', 'asset/Cra/Cra_face.png');
	game.load.image('Cra_profil', 'asset/Cra/Cra_profil.png');
}

function load_iop(game) {
	game.load.image('Iop_3q_dos', 'asset/Iop/Iop_3q_dos.png');
	game.load.image('Iop_3q_face', 'asset/Iop/Iop_3q_face.png');
	game.load.image('Iop_dos', 'asset/Iop/Iop_dos.png');
	game.load.image('Iop_face', 'asset/Iop/Iop_face.png');
	game.load.image('Iop_profil', 'asset/Iop/Iop_profil.png');
	game.load.image('Iop_spell_0', 'asset/Iop/Iop_spell_0.png');
	game.load.image('Iop_spell_1', 'asset/Iop/Iop_spell_1.png');
	game.load.image('Iop_spell_2', 'asset/Iop/Iop_spell_2.png');
}
/*END*/
