/* Class Map */
class Map{
	constructor() {
		this.largeur = 14;
		this.hauteur = 14;
        this.data_map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
					];
		this.t_map;
	}
	parse_file() {
		this.t_map = new Array(this.largeur);
		for (let i = 0; i < this.largeur; i++) {
			this.t_map[i] = new Array(this.hauteur);
		}
		for (let n = 0; n < this.largeur; n++) {
			for (let i = 0; i < this.hauteur; i++) {
				this.t_map[n][i] = new bloc(n, i, this.data_map[n][i]);
			}
		}
	}
	refresh_map() {
		for (let n = 0; n < this.largeur; n++) {
			for (let i = 0; i < this.hauteur; i++) {
                if (this.t_map[n][i].img != undefined)
				    this.t_map[n][i].img.tint = undefined;
			}
		}
	}
}
/*END*/

/* Pathfinding */
class pf{

    get_near(y, x) {
        if (y < 0 || y >= map.largeur)
            return (undefined);
        if (x < 0 || x >= map.hauteur)
            return (undefined);
        let obj = map.t_map[y][x];
        if (obj.empty == true && obj.isPers == undefined)
            return (map.t_map[y][x]);
        else
            return (undefined);
    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
    get_neighbor(obj) {
        let rd_neighbor = [];
        let neighbor = new Array(4);
        neighbor[0] = this.get_near(obj.rposy, obj.rposx - 1);
        neighbor[1] = this.get_near(obj.rposy + 1, obj.rposx);
        neighbor[2] = this.get_near(obj.rposy - 1, obj.rposx);
        neighbor[3] = this.get_near(obj.rposy, obj.rposx + 1);
        return (this.shuffle(neighbor));
    }
    get_lowest_fscore(openset){
        var obj = openset[0];
        var mem;
        if (obj == undefined)
            mem = Infinity;
        else
            mem = obj.fScore;
        for (i = 0; i < openset.length; i++)
        {
            if (openset[i] != undefined && openset[i].fScore < mem)
            {
                mem = openset[i].fScore;
                obj = openset[i];
            }   
        }
        return (obj);
    }
    h(start, obj) {
        let nXDifferenceTiles = Math.round(Math.abs(obj.rposx - start.rposx));
        let nYDifferenceTiles = Math.round(Math.abs(obj.rposy - start.rposy));
        let cost = nXDifferenceTiles + nYDifferenceTiles;
        return (cost);
    }
    get_index(openSet, item) {
        for (i = 0; i < openSet.length; i++)
        {
            if (openSet[i] == item)
                return (i);
        }
        return (undefined);
    }
    in(lst, obj) {
        let i = 0;
        while (i < lst.length)
        {
            if (lst[i] == obj)
                return (1);
            i++;
        }
        return (0);
    }
    init_path(node, obj) {
        if (node.fScore != Infinity) {
            if ((this.h(node, obj) + 1) * 10 < node.fScore)
                return (1);
            else
                return (0);
        }
        return (0);
    }
    get_path(start, end) {
        let path = [];
        let tmp = end;
        while (tmp != start)
        {
            path.push(tmp);
            tmp = tmp.cameFrom;
        }
        return (path.reverse());
    }
    pathfinding(obj) {
        var start = act_pers.bloc;
        var openset = new Array(1);
        var closedset = new Array();
        openset[0] = start;
        var i = -1;
        let max = act_pers.pm * act_pers.pm;
        var current;
        var neighbor;
        while (1 && ++i < max)
        {
            if ((current = this.get_lowest_fscore(openset)) == undefined)
                break ;
            openset.splice(this.get_index(openset, current), 1);
            closedset.push(current);
            if (current == obj)
                return (this.get_path(start, obj));
            else
            {
                neighbor = this.get_neighbor(current);
                for (i = 0; i < neighbor.length; i++)
                {
                    if (neighbor[i] != undefined)
                    {
                        if(this.in(closedset, neighbor[i]))
                            ;
                        else if (this.init_path(neighbor[i], obj) || !this.in(openset, neighbor[i]))
                        {
                            neighbor[i].gScore = 1;
                            neighbor[i].fScore = (this.h(neighbor[i], obj) + neighbor[i].gScore) * 10;
                            neighbor[i].cameFrom = current;
                            if (!this.in(openset, neighbor[i]))
                                openset.push(neighbor[i]);
                        }
                    }
                }
            }
        }
        return (undefined);
    }
}

/* Class Perso*/
class Perso{
    constructor(name, posx, posy, bl, game, classe){
		this.class = classe;
        this.game = game;
        this.name = name;
        this.posx = posx;
        this.posy = posy;
        this.bloc = bl;
        this.cible;
        this.pm = 5;
        this.pa = 6;
        this.pv = 100;
        this.img = 0;
        this.pf = new pf();
        this.path = undefined;
        this.save_path = undefined;
        this.id_path = 0;
        this.begin;
    }
    in_range(po, obj) {
        let min = po[0];
		let max = po[1];
		let nXDifferenceTiles = Math.abs(act_pers.posx - obj.rposx);
        let nYDifferenceTiles = Math.abs(act_pers.posy - obj.rposy);
        let dst = nXDifferenceTiles + nYDifferenceTiles;
		if (dst <= max && dst > min)
			return (obj);
        else
            return (undefined);
    }
	show_range (po, tint) {
		//map.refresh_map();
		for (let x = 0; x < map.largeur; x++) {
			for (let y = 0; y < map.hauteur; y++) {
                let obj = this.in_range(po, map.t_map[x][y]);
				if (obj)
				{
					if (obj.over == false)
						obj.img.tint = tint;
					else
						obj.img.tint = obj.tint;
				}
			}
		}
    }
    init_bloc (bloc, add){
        this.add = add;
        this.bloc.isPers = undefined;
        this.bloc = bloc;
        this.bloc.isPers = this;
        this.y = bloc.y;
        this.x = bloc.x;
        this.posx = bloc.rposx;
        this.posy = bloc.rposy;
        if (this.img)
        {
            this.flipX = this.img.flipX;
            this.img.destroy();
        }
        this.img = add.image(this.x, this.y - hauteur * 0.45, this.class.name).setDisplaySize(89 * (largeur /89), 110 * (hauteur /89));
		this.img.flipX = this.flipX;
    }
    move(obj){
        this.path = this.pf.pathfinding(obj);
        if (this.path == undefined)
            return ;
        if (this.path.length <= this.pm)
        {
            for (i = 0; i < this.path.length; i++)
                this.path[i].img.tint = 0x007700;
        }
    }
}
/*END*/

/* Class AFF */
class AFF {
	constructor(add) {
		this.anim_play = false;
		this.add = add;
	}
	display_dmg(damage, pers, game) {
		this.destroy_img();
		this.begin = game.time.now;
		this.px = 20;
		this.dmg_txt = game.add.text(pers.x, pers.y - 50, "-" + damage, {
				font: this.px + "px Arial",
				fill: "#800000",
				align: "center"
			});
		this.anim_play = true;
	}
	destroy_img() {
		if (this.dmg_txt)
		{	this.dmg_txt.destroy();
			this.anim_play = false;
		}
	}
}
/* END */

/* Class HUD */
class HUD{
    constructor(game) {
        this.game = game;
    }
    load_hud() {
        this.h_name = this.game.add.text(windowX * 0.05, windowY * 0.78, act_pers.name, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pv = this.game.add.text(windowX * 0.05, windowY * 0.80, 'PV :' + act_pers.pv, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pm = this.game.add.text(windowX * 0.05, windowY * 0.82, 'PM :' + act_pers.pm, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pa = this.game.add.text(windowX * 0.05, windowY * 0.84, 'PA :' + act_pers.pa, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.pass_tour = this.game.add.image(windowX * 0.065, windowY * 0.90, 'pass_t').setInteractive().on('pointerdown', () => {
			act_pers.pm = 3;
			act_pers.pa = 6;
            id_pers += 1;
            if (id_pers == nb_pers)
                id_pers = 0;
            act_pers = pers[id_pers];
            this.refresh_hud();
		});
        if (this.spell1 == undefined)
        {
            this.spell1 = this.game.add.image(windowX * 0.12, windowY * 0.8, act_pers.class.spell1.id).setInteractive().on('pointerdown', () => {
                if (act_pers.class.bl_range == 0)
                {
                    act_pers.class.act_spell = act_pers.class.spell1;
                    this.spell1.tint = 0xA0A0A0;
                    act_pers.class.bl_range = 1;
                }
                else
                {
                    map.refresh_map();
                    act_pers.class.act_spell = undefined;
					act_pers.class.bl_range = 0;
                    this.spell1.tint = undefined;
                }
            });
        }
    }
    refresh_hud() {
        this.h_pm.destroy();
        this.h_name.destroy();
        this.h_pv.destroy();
        this.h_pa.destroy();
        this.load_hud();

    }
}

/* Class d'un Bloc */
class bloc{
    gScore = Infinity;
    fScore = Infinity;
    cameFrom;
	constructor(posx, posy, type){
        this.isPers = undefined;
		this.posx = posx;
        this.posy = posy;
        this.rposx = posy;
        this.rposy = posx;
        this.type = type;
		this.over = false;
		this.tint = 0x008000;
		switch (this.type){
			case 0:
				this.file = 'iso_0';
				break ;
			case 1:
				this.file = 'iso_2';
                break ;
            case 2:
                this.file = 'iso_2';
                break ;
        }
        if (this.type)
            this.empty = true;
        else
            this.empty = false;
    }
    draw_bloc (game, posx, posy, largeur, hauteur) {
        this.x = posx;
        this.y = posy;
        let x = 22.5;
        let y = 22.5;
		var polygon = new Phaser.Geom.Polygon([
			x, y - 17.5,
			x + 52 * 0.5, y,
			x + 52 * 0.5, y + 7,
			x, y + 17.5 + 7,
			x - 52 * 0.5, y + 7,
			x - 52 * 0.5, y,
		]);
        if (this.posx % 2 == 0 && this.type != 0)
            this.file = "iso_2_pair";
        switch (this.type){
			case 2:
                this.img = game.add.image(posx, posy, this.file).setDisplaySize(largeur, hauteur).setInteractive();
                this.img.alpha = 0.7;
				break ;
			case 1:
                this.img = game.add.image(posx, posy, this.file).setDisplaySize(largeur, hauteur);
                this.img.setInteractive(polygon, Phaser.Geom.Polygon.Contains);
                this.img.setInteractive();;
				break ;
        }
        if (this.type != 0)
			this.img.data = this;
    }
}
/*END*/
