
var width = 800;
var height = 600;

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
var data_map = "1111111111;1111111111;1101111211;1001112211;1101111211;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111;1111111111";
var game = new Phaser.Game(config);
var map;
var pers = [2];
var act_pers;
var hud;

function preload ()
{
    var pos = [[0, 0], [18, 9]];
    parseFile();
    load_hud(this);
    load_map(this);
    for (i = 0; i < pers.length; i++)
        pers[i] = new Perso("test" + i, pos[i][0], pos[i][1], 'perso', map, 3);
}

function draw_map(game)
{
    var largeur = width / map[0].length;
    var hauteur = (height / map.length) * 2.5;
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
            let bloc = map[x][y];
            bloc.draw_bloc(game, 50 + (largeur * 0.9) * bloc.posy + (largeur * 0.45) * (bloc.posx % 2), 100 + bloc.posx * hauteur * 0.225, largeur, hauteur);
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
            if (obj.x - pointer.x < 0 && obj.y - pointer.y > 28 && dst >= 35)
            {
                if (obj.posx % 2 == 1)
                    obj = map[gameObject.data[0] - 1][gameObject.data[1] + 1];
                else
                    obj = map[gameObject.data[0] - 1][gameObject.data[1]];
            }
            else if (obj.x - pointer.x > 9 && obj.y - pointer.y > 28 && dst >= 35)
            {
                if (obj.posx % 2 == 1)
                    obj = map[gameObject.data[0] - 1][gameObject.data[1]];
                else
                    obj = map[gameObject.data[0] - 1][gameObject.data[1] - 1];
            }
            if (obj && obj.type == 1)
                act_pers.bloc = obj;
        }
    });
}

function draw_hud(game)
{
    hud = new HUD(game);
    hud.load_hud();
}

function init_pers(game) {
    for (i = 0; i < pers.length; i++)
    {
        pers[i].get_pos(pers[i].bloc)
        pers[i].img = game.add.image(pers[i].x, pers[i].y - 32.5, pers[i].file);
    }
}

function create() {
    draw_map(this);
    act_pers = pers[0];
    draw_hud(this);
    click_function(this);
    init_pers(this);
}

function update ()
{
    if (move_t_r(act_pers) || move_t_l(act_pers) || move_b_l(act_pers) || move_b_r(act_pers))
    {
        act_pers.pm -= 1;
        hud.refresh_hud();
        act_pers.get_pos(act_pers.bloc);
        if (act_pers.img)
            act_pers.img.destroy();
        act_pers.img = this.add.image(act_pers.x, act_pers.y - 32.5, 'perso');
    }
}