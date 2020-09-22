
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
var test = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

var game = new Phaser.Game(config);
var map;
var nb_pers = 2;
var id_pers = 0;
var pers = [nb_pers];
var act_pers;
var hud;
var largeur = 50;
var hauteur = 50;

function preload ()
{
    var pos = [[5, 5], [9, 17]];
    parse_file();
    load_hud(this);
    load_map(this);
    for (i = 0; i < nb_pers; i++)
        pers[i] = new Perso("Perso " + i, pos[i][0], pos[i][1], 'perso', map[pos[i][1]][pos[i][0]], game);
}

function draw_map(game)
{
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
            let bloc = map[x][y];
            bloc.draw_bloc(game, 50 + (largeur * 0.9) * bloc.posy + (largeur * 0.45) * (bloc.posx % 2), 100 + bloc.posx * hauteur * 0.225, largeur, hauteur);
        }
    }
}

function dist_r (obj) {
    //console.log(Math.abs(act_pers.x - obj.x), Math.abs(act_pers.y - obj.y));
    let po = 4;
    for (let x = 0; x < test.length; x++) {
		for (let y = 0; y < test[0].length; y++) {
            obj_b = map[x][y];
            nXDifferenceTiles = Math.abs(act_pers.x - obj_b.x);
            nYDifferenceTiles = Math.abs(act_pers.y - obj_b.y);
            if (nXDifferenceTiles <= 22.5 * po && nYDifferenceTiles <= 11.25 * po)
                obj_b.img.tint = 0x0000FF;
        }
    }
}

function click_function(game)
{
    game.input.on('gameobjectdown',function click(pointer,gameObject){     
        let obj;
        if (gameObject.texture.key == "iso_2_pair" || gameObject.texture.key == "iso_2"){
            obj = map[gameObject.data[0]][gameObject.data[1]];
            dst = Math.sqrt(Math.pow(pointer.x - obj.x, 2) + Math.pow(pointer.y - obj.y, 2));
            if (obj.x - pointer.x < 0 && obj.y - pointer.y > 0 && dst >= largeur / 2.15)
                obj = map[gameObject.data[0] - 1][gameObject.data[1] + (obj.posx % 2)];
            else if (obj.x - pointer.x > 0 && obj.y - pointer.y > 0 && dst >= largeur / 2.15)
            {
                if (obj.posx % 2 == 1)
                    obj = map[gameObject.data[0] - 1][gameObject.data[1]];
                else
                    obj = map[gameObject.data[0] - 1][gameObject.data[1] - 1];
            }
            if (obj && obj.type == 1)
            {
                dist_r(obj);
                obj.img.tint = 0x777777;
                if (act_pers.move(obj))
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