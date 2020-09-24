
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
var nb_pers = 2;
var id_pers = 0;
var pers = [,];
var act_pers;
var hud;
var largeur = 90;
var hauteur = 90;

function preload ()
{
	map = new Map();
    var pos = [[5, 5], [9, 9]];
	map.parse_file();
    load_hud(this);
	load_map(this);
    for (i = 0; i < nb_pers; i++)
    {
		pers[i] = new Perso("Perso " + i, pos[i][0], pos[i][1], 'perso', map.t_map[pos[i][1]][pos[i][0]], game, new Archer(game));
		pers[i].class.load_class(this);
	}    
}

function draw_map(game)
{
    for (let x = 0; x < map.largeur; x++) {
        for (let y = 0; y < map.hauteur; y++) {
            let bloc = map.t_map[x][y];
            bloc.draw_bloc(game, 50 + (largeur * 0.9) * bloc.posy + (largeur * 0.45) * (bloc.posx % 2), 100 + bloc.posx * hauteur * 0.225, largeur, hauteur);
        }
    }
}

function get_r_obj(gameObject, pointer) {
	let obj = map.t_map[gameObject.data[0]][gameObject.data[1]];
	dst = Math.sqrt(Math.pow(pointer.x - obj.x, 2) + Math.pow(pointer.y - obj.y, 2));
	if (obj.x - pointer.x < 0 && obj.y - pointer.y > 0 && dst >= largeur / 2.15)
	{
		obj = map.t_map[gameObject.data[0] - 1][gameObject.data[1] + (obj.posx % 2)];
	}
	else if (obj.x - pointer.x > 0 && obj.y - pointer.y > 0 && dst >= largeur / 2.15)
	{
		if (obj.posx % 2 == 1)
			obj = map.t_map[gameObject.data[0] - 1][gameObject.data[1]];
		else
			obj = map.t_map[gameObject.data[0] - 1][gameObject.data[1] - 1];
	}
	return (obj);
}

function click_function(game)
{
    game.input.on('gameobjectdown',function click(pointer,gameObject){
		let obj = get_r_obj(gameObject, pointer);
        if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
			obj.img.tint = 0x770077;
            if (obj && obj.type == 1)
            {
                if (act_pers.class.bl_range && act_pers.in_range(act_pers.class.act_spell.po, obj))
                {
                    act_pers.class.act_spell.action(obj);
                }
                else if (act_pers.move(obj))
                {
                    act_pers.pm -= 1;
                    act_pers.init_bloc(act_pers.bloc, game.add);
                    hud.refresh_hud();
                }
            }
        }
	});
	/*var mem_obj;
	game.input.on('gameobjectover',function click(pointer,gameObject){  
		let obj = get_r_obj(gameObject, pointer);
		mem_obj = obj;
		//let obj = map.t_map[gameObject.data[0]][gameObject.data[1]];
        //if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
            if (obj && obj.type == 1)
				obj.img.tint = 0x770077;
        //}
	});
	game.input.on('gameobjectout',function click(pointer,gameObject){
		let obj = mem_obj;
		//let obj = map.t_map[gameObject.data[0]][gameObject.data[1]];
        if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
            if (obj && obj.type == 1)
            {
				obj.img.tint = undefined;
            }
        }
	});*/
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

function create() {
    /*act_pers = pers[0];
    draw_map(this);
    draw_hud(this);
    click_function(this);
	init_pers(this);*/
	let x = 0;
	let y = 0;
	var polygon = new Phaser.Geom.Polygon([
		/*0, 0,
		50, 0,
		50, 50,
		0, 50,*/
        x, y - 50 * 0.5,
        x + 50 * 0.43, y - 50 * 0.25,
        x + 50 * 0.43, y + 50  * 0.25,
		x, y + 50 * 0.5,
		x - 50 * 0.48, y + 50  * 0.26,
        x - 50 * 0.48, y - 50 * 0.26,
	]);
	let xx = 100 - largeur / 2;
	let yy = 150 - largeur / 2;
	var poly = new Phaser.Geom.Polygon([
		/*xx, yy,
		xx + largeur, yy,
		xx +largeur, yy+largeur,
		xx, yy + largeur,*/
        xx, yy - hauteur * 0.5,
        xx + largeur * 0.43, yy - hauteur * 0.25,
        xx + largeur * 0.43, yy + hauteur  * 0.25,
		xx, yy + hauteur * 0.5,
		xx - largeur * 0.48, yy + hauteur  * 0.26,
        xx - largeur * 0.48, yy - hauteur * 0.26,
	]);
	graphics = this.add.graphics(0, 0);
	graphics.lineStyle(5, 0xFF00FF, 1.0);
	graphics.fillStyle(0xFFFFFF, 1.0);
	graphics.fillPoints(poly.points, true);
	var btn = this.add.image(100, 150, 'iso_2');
	btn.alpha = 0.7;
	btn.setInteractive(polygon, Phaser.Geom.Polygon.Contains).setDisplaySize(largeur, hauteur);
	btn.setInteractive();
	btn.on('pointerover', function() {
		console.log('btn pointerup');
	}, this);
	/*var graphics1 = this.add.image(50, 50, 'iso_2').setDisplaySize(largeur, hauteur).setInteractive(polygon, polygon.contains);*/
}

function puertaPulsada(puerta){
	alert("enter")
	}

function update ()
{
}