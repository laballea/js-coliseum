
var windowX = 1600;
var windowY = 900;

var config = {
    type: Phaser.AUTO,
    width: windowX,
	height: windowY,
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
var largeur = windowX / 28;
var hauteur = windowY / 14;
var time;

function preload ()
{
	map = new Map();
	aff = new AFF(game.add);
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
    /*for (let x = 0; x < map.largeur; x++) {
        for (let y = 0; y < map.hauteur; y++) {
            let bloc = map.t_map[x][y];
            bloc.draw_bloc(game, 50 + (largeur * 0.97) * bloc.posy + (largeur * 0.49) * (bloc.posx % 2), 100 + bloc.posx * hauteur * 0.25, largeur, hauteur);
        }
    }*/
    let tileWidthHalf = largeur * 0.5;
    let tileHeightQuarter = hauteur * 0.25;
    let centerX = (windowX - (map.largeur * largeur)) / 2;
    let centerY = windowY * 0.125;
    for (let y = 0; y < map.largeur; y++)
    {
        for (let x = 0; x < map.hauteur; x++)
        {
            let bloc = map.t_map[y][x];
            let tx = (map.largeur * tileWidthHalf) + (x - y) * tileWidthHalf;
            let ty = y * tileHeightQuarter + x * tileHeightQuarter;
            bloc.draw_bloc(game, centerX + tx, centerY + ty, largeur, hauteur);
            let text1 = game.add.text(centerX + tx - 25, centerY + ty - 10, `${x},${y}`);
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
                if (!act_pers.class.bl_range)
                    act_pers.save_path = act_pers.path;
				else if (act_pers.class.bl_range && act_pers.in_range(act_pers.class.act_spell.po, obj))
					act_pers.class.act_spell.action(obj, game);
            }
        }
	});
	game.input.on('gameobjectover',function click(pointer,gameObject){
        let obj = gameObject.data;
        if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
                obj.over = true;
                if (!act_pers.class.bl_range)
                    act_pers.move(obj);
                else if (act_pers.class.bl_range && act_pers.in_range(act_pers.class.act_spell.po, obj))
                    obj.tint = 0xff0000;
        }
	});
	game.input.on('gameobjectout',function click(pointer,gameObject){
        let obj = gameObject.data;
        if (act_pers.path != undefined && !act_pers.class.bl_range)
        {
            for (i = 0; i < act_pers.path.length; i++)
                act_pers.path[i].img.tint = undefined;
        }
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
    {
        act_pers.show_range(act_pers.class.act_spell.po, 0x0000FF);
    }
    else if (act_pers.save_path != undefined && act_pers.id_path <= act_pers.save_path.length)
    {
        act_pers.save_path[act_pers.id_path].img.tint = 0x770000;
        act_pers.init_bloc(act_pers.save_path[act_pers.id_path], this.add);
        act_pers.save_path[act_pers.id_path].gScore = Infinity;
        act_pers.save_path[act_pers.id_path].fScore = Infinity;
        act_pers.save_path[act_pers.id_path].cameFrom = undefined;
        act_pers.id_path++;
        if (act_pers.id_path == act_pers.save_path.length)
        {
            act_pers.save_path = undefined;
            act_pers.id_path = 0;
        }
    }
}