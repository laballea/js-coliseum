
var width = 1600;
var height = 900;

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
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

function click_function(game)
{
    game.input.on('gameobjectdown',function click(pointer,gameObject){   
        let obj;
        if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
			obj = map.t_map[gameObject.data[0]][gameObject.data[1]];
            dst = Math.sqrt(Math.pow(pointer.x - obj.x, 2) + Math.pow(pointer.y - obj.y, 2));
            if (obj.x - pointer.x < 0 && obj.y - pointer.y > 0 && dst >= largeur / 2.15)
                obj = map.t_map[gameObject.data[0] - 1][gameObject.data[1] + (obj.posx % 2)];
            else if (obj.x - pointer.x > 0 && obj.y - pointer.y > 0 && dst >= largeur / 2.15)
            {
                if (obj.posx % 2 == 1)
                    obj = map.t_map[gameObject.data[0] - 1][gameObject.data[1]];
                else
                    obj = map.t_map[gameObject.data[0] - 1][gameObject.data[1] - 1];
            }
            if (obj && obj.type == 1)
            {
                if (act_pers.move(obj) && !act_pers.class.bl_range)
                {
                    act_pers.pm -= 1;
                    hud.refresh_hud();
                    act_pers.init_bloc(act_pers.bloc, game.add);
                }
            }
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

function create() {
    act_pers = pers[0];
    draw_map(this);
    draw_hud(this);
    click_function(this);
    init_pers(this);
}

function update ()
{
}