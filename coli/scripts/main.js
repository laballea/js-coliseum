
var width = 1600;
var height = 900;

var config = {
    type: Phaser.AUTO,
    width: width,
	height: height,
	physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0
            },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var map;
var aff;
var nb_pers = 2;
var id_pers = 0;
var pers = [,];
var act_pers;
var hud;
var largeur = width / 28;
var hauteur = height / 14;
var time;

function preload ()
{
	map = new Map();
	aff =  new AFF(game.add);
    var pos = [[5, 5], [9, 9]];
	map.parse_file();
    load_hud(this);
	load_map(this);
    for (i = 0; i < nb_pers; i++)
    {
		pers[i] = new Perso("Perso " + i, pos[i][0], pos[i][1], map.t_map[pos[i][1]][pos[i][0]], game, new Iop(game));
		pers[i].class.load_class(this);
	}    
}

function draw_map(game)
{
    for (let x = 0; x < map.largeur; x++) {
        for (let y = 0; y < map.hauteur; y++) {
            let bloc = map.t_map[x][y];
            bloc.draw_bloc(game, 50 + (largeur * 0.97) * bloc.posy + (largeur * 0.49) * (bloc.posx % 2), 100 + bloc.posx * hauteur * 0.25, largeur, hauteur);
        }
    }
}

function click_function(game)
{
    game.input.on('gameobjectdown',function click(pointer,gameObject){
		let obj = gameObject.data;
        if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
            if (obj && obj.type == 1)
            {
				if (act_pers.class.bl_range && act_pers.in_range(act_pers.class.act_spell.po, obj))
					act_pers.class.act_spell.action(obj, game);
                else if (act_pers.move(obj) && !act_pers.class.bl_range)
                {
					act_pers.pm -= 1;
                    act_pers.init_bloc(act_pers.bloc, game.add);
                    hud.refresh_hud();
                }
            }
        }
	});
	game.input.on('gameobjectover',function click(pointer,gameObject){ 
		let obj = gameObject.data;
        if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
		{
			obj.over = true;
            if (act_pers.class.bl_range && act_pers.in_range(act_pers.class.act_spell.po, obj))
				obj.tint = 0xff0000;
			else if (!act_pers.class.bl_range && act_pers.in_range([0, act_pers.pm], obj))
				obj.tint = 0x00FF00;
		}
        }
	});
	game.input.on('gameobjectout',function click(pointer,gameObject){
		let obj = gameObject.data;
        if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
			obj.over =false;
        }
	});
}

function draw_hud(game)
{
    hud = new HUD(game);
    hud.load_hud();
}

function init_pers(game) {
    for (i = 0; i < nb_pers; i++)
        pers[i].init_bloc(pers[i].bloc, game.add);
}

/*function display_time(time,game){
	if (txt != undefined)
		txt.destroy();
	txt = game.add.text(width * 0.05, height * 0.9, Math.round(time.now * 0.001), {
		font: "15px Arial",
		fill: "#008000",
		align: "center"
	});
}*/

function create() {
	act_pers = pers[0];
    draw_map(this);
    draw_hud(this);
    click_function(this);
	init_pers(this);
}

function update ()
{
	if (aff.anim_play)
	{
		aff.dmg_txt.y--;
		if (this.time.now - aff.begin > 500)
			aff.destroy_img();
	}
	if (act_pers.class.bl_range)
		act_pers.show_range(act_pers.class.act_spell.po, 0x0000FF);
	else
		act_pers.show_range([0, act_pers.pm], 0x008000);
}