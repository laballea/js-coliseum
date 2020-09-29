/* Pathfinding */
class pf{
    constructor (map) {
        this.map = map;
    }
    get_near(y, x) {
        if (y < 0 || y >= this.map.largeur)
            return (undefined);
        if (x < 0 || x >= this.map.hauteur)
            return (undefined);
        let obj = this.map.t_map[y][x];
        if (obj.empty == true && obj.isPers == undefined)
            return (this.map.t_map[y][x]);
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
        for (let i = 0; i < openset.length; i++)
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
        for (let i = 0; i < openSet.length; i++)
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
    get_path(end) {
        let path = [];
        let tmp = end;
        while (tmp.cameFrom != undefined)
        {
            path.push(tmp);
            tmp = tmp.cameFrom;
        }
        this.map.reset_score();
        return (path.reverse());
    }
    pathfinding(obj, player) {
        let start = player.bloc;
        start.gScore = 0;
        start.fScore = 30;
        let openset = new Array(1);
        let closedset = new Array();
        openset[0] = start;
        let n = -1;
        let max = player.pm * player.pm;
        let current;
        let neighbor;
        while (1 && ++n < max)
        {
            if ((current = this.get_lowest_fscore(openset)) == undefined)
                break;
            openset.splice(this.get_index(openset, current), 1);
            closedset.push(current);
            if (current.posx == obj.posx && current.posy == obj.posy)
                return (this.get_path(obj));
            else
            {
                neighbor = this.get_neighbor(current);
                for (let i = 0; i < neighbor.length; i++)
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

class Enemy{
    constructor(name, state, data, game, map) {
        this.name = name;
        this.state = state;
        this.data = data;
        this.game = game;
        this.group = game.imageGroup;
        this.posx = this.data.pos[0];
        this.posy = this.data.pos[1];
        this.map = map;
        this.bloc = this.map.t_map[this.posx][this.posy];
        this.draw();
    }
    draw(){
        let largeur = this.state.windowX / 28;
        let hauteur = this.state.windowY / 14;
        this.bloc.isPers = this;
        this.y = this.bloc.y;
        this.x = this.bloc.x;
        this.img = this.game.add.image(this.x, this.y - hauteur * 0.45, "Iop").setDisplaySize(89 * (largeur /89), 110 * (hauteur /89));
        this.group.add(this.img);
    }
    act_data(data){
		this.data = data;
		console.log(this.data);
        this.posx = this.data.pos[0];
        this.posy = this.data.pos[1];
        this.bloc = this.map.t_map[this.posx][this.posy];
        this.reload();
    }
    reload(){
        this.img.destroy();
        this.draw();
    }
}

/* Class Perso*/
class Perso{
    constructor(state, game, map, id){
        this.data = state.players[id];
        switch (this.data.classe)  {
            case "Iop":
                this.class = new Iop(game, this);
        }
        this.id = id;
        this.turn = false;
        this.game = game;
        this.map = map;
        this.state = state;
        this.name = "Perso" + id;
        this.posx = this.data.pos[0];
        this.posy = this.data.pos[1];
        this.bloc = map.t_map[this.posx][this.posy];
        this.group = game.imageGroup;
        this.img = 0;
        this.init_bloc(this.bloc, game.add)
        this.pm = 5;
        this.pa = 6;
        this.pv = 100;
        this.pf = new pf(map);
        this.enemy = [];
    }
    set_players() {
        for (let i = 0; i < this.state.nbPlayer; i++)
        {
            if (i != this.id)
                this.enemy.push(new Enemy("Perso" + i, this.state, this.state.players[i], this.game, this.map));
            else
                this.enemy.push(this);
        }
    }
    in_range(po, obj) {
        let min = po[0];
		let max = po[1];
		let nXDifferenceTiles = Math.abs(this.posx - obj.rposx);
        let nYDifferenceTiles = Math.abs(this.posy - obj.rposy);
        let dst = nXDifferenceTiles + nYDifferenceTiles;
		if (dst <= max && dst > min)
			return (obj);
        else
            return (undefined);
    }
	show_range (po, tint) {
		for (let x = 0; x < this.map.largeur; x++) {
			for (let y = 0; y < this.map.hauteur; y++) {
                let obj = this.in_range(po, this.map.t_map[x][y]);
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
        let largeur = this.state.windowX / 28;
        let hauteur = this.state.windowY / 14;
        this.add = add;
        if (this.posy - bloc.rposy == -1)
            this.flipX = 90;
        else
            this.flipX = 0;
        this.bloc.isPers = undefined;
        this.bloc = bloc;
        this.bloc.isPers = this;
        this.y = this.bloc.y;
        this.x = this.bloc.x;
        this.posx = this.bloc.rposx;
        this.posy = this.bloc.rposy;
        if (this.img)
        {
            this.group.remove(this.img);
            this.img.destroy();
        }
        this.img = add.image(this.x, this.y - hauteur * 0.45, "Iop").setDisplaySize(89 * (largeur /89), 110 * (hauteur /89));
        this.group.add(this.img);
		this.img.flipX = this.flipX;
    }
    preshow(obj) {
        let path = this.pf.pathfinding(obj, this);
        if (path == undefined)
            return [];
        if (path.length <= this.pm)
        {
            for (let i = 0; i < path.length; i++)
                path[i].img.tint = 0x007700;
            return path;
        }
    }
    move(path){
        if (path.length == 0)
            return undefined;
        if (path.length <= this.pm)
        {
            var i = 0;
            var id = setInterval(display_move, 50, this.game.add, path, this);
            function display_move(add, path, player) {
                if (i == path.length)
                    clearInterval(id);
                else
                    player.init_bloc(path[i++], add);
            }
        }
        return ([path[path.length - 1].posx, path[path.length - 1].posy]);;
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
    constructor(game, state, player) {
        this.state = state;
        this.game = game;
        this.player = player;
        this.map = player.map;
    }
    load_hud() {
        this.h_name = this.game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.78, this.player.name, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pv = this.game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.80, 'PV :' + this.player.pv, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pm = this.game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.82, 'PM :' + this.player.pm, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pa = this.game.add.text(this.state.windowX * 0.05, this.state.windowY * 0.84, 'PA :' + this.player.pa, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.pass_tour = this.game.add.image(this.state.windowX * 0.065, this.state.windowY * 0.90, 'pass_t').setInteractive().on('pointerdown', () => {
			this.player.pm = 3;
			this.player.pa = 6;
            this.refresh_hud();
        });
        if (this.spell1 == undefined)
        {
            this.spell1 = this.game.add.image(this.state.windowX * 0.12, this.state.windowY * 0.8, this.player.class.spell1.id).setInteractive().on('pointerdown', () => {
                if (this.player.class.bl_range == 0)
                {
                    this.player.class.act_spell = this.player.class.spell1;
                    this.player.show_range(this.player.class.act_spell.po, 0x0F056B);
                    this.spell1.tint = 0xA0A0A0;
                    this.player.class.bl_range = 1;
                }
                else
                {
                    this.map.refresh_map();
                    this.player.class.act_spell = undefined;
					this.player.class.bl_range = 0;
                    this.spell1.tint = undefined;
                }
            });
        }
        this.game.imageGroup.add(this.pass_tour)
        this.game.imageGroup.add(this.h_pa);
        this.game.imageGroup.add(this.h_pm);
        this.game.imageGroup.add(this.h_pv);
        this.game.imageGroup.add(this.h_name);
        this.game.imageGroup.add(this.spell1);
    }
    refresh_hud() {
        this.h_pm.destroy();
        this.h_name.destroy();
        this.h_pv.destroy();
        this.h_pa.destroy();
        this.load_hud();
    }
}

