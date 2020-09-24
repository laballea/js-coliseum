/* Class Map */
class Map{
	constructor() {
		this.largeur = 14;
		this.hauteur = 14;
		this.data_map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
				this.t_map[n][i].img.tint = undefined;
			}
		}
	}
}
/*END*/

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
        this.pm = 3;
        this.pa = 6;
        this.pv = 100;
        this.img = 0;
    }
    in_range(po, obj) {
        let min = po[0];
        let max = po[1];
        let nXDifferenceTiles = Math.abs(act_pers.x - obj.x);
        let nYDifferenceTiles = Math.abs(act_pers.y - obj.y);
        if (nXDifferenceTiles <= largeur / 2 * max && nYDifferenceTiles <= hauteur / 4 * max && nXDifferenceTiles > largeur / 2 * min && nYDifferenceTiles >= hauteur / 4 * min)
            return (obj);
        else
            return (undefined);
    }
	show_range (po) {
		map.refresh_map();
		for (let x = 0; x < map.largeur; x++) {
			for (let y = 0; y < map.hauteur; y++) {
                let obj;
				if (obj = this.in_range(po, map.t_map[x][y]))
					obj.img.tint = 0x0000FF;
			}
		}
	}
    init_bloc (bloc, add){
        this.add = add;
        this.bloc.isPers = this;
        this.y = bloc.y;
        this.x = bloc.x;
        if (this.img)
        {
            this.flipX = this.img.flipX;
            this.img.destroy();
        }
        this.img = add.image(this.x - 5, this.y - 60, this.class.name);
        this.img.flipX = this.flipX;
    }

    check_move(obj){
        if (this.posx - Math.abs((this.posy % 2 - 1)) == obj.rposx && this.posy - 1 == obj.rposy)
            return (1);
        else if (this.posx + (this.posy % 2) == obj.rposx && this.posy + 1 == obj.rposy)
        {
            this.img.flipX = false;
            return (2);
        }
        else if (this.posx - Math.abs((this.posy % 2 - 1)) == obj.rposx && this.posy + 1 == obj.rposy)
        {
            this.img.flipX = true;
            return (3);
        }
        else if (this.posx + (this.posy % 2) == obj.rposx && act_pers.posy - 1 == obj.rposy)
            return (4);
        else
            return (-1);
    }
    move(obj){
        if (this.check_move(obj) != -1 && act_pers.pm - 1 >= 0 && obj.isPers == undefined)
        {
            this.bloc.isPers = undefined;
            this.bloc = obj;
            this.posx = this.bloc.posy;
            this.posy = this.bloc.posx;
            return (1)
        }
        else
            return (0);
    }
}
/*END*/

/* Class HUD */
class HUD{
    constructor(game) {
        this.game = game;
        }
    load_hud() {
        this.h_name = this.game.add.text(width * 0.05, height * 0.77, act_pers.name, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pv = this.game.add.text(width * 0.05, height * 0.785, 'PV :' + act_pers.pv, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pm = this.game.add.text(width * 0.05, height * 0.80, 'PM :' + act_pers.pm, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_pa = this.game.add.text(width * 0.05, height * 0.80, 'PA :' + act_pers.pa, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.pass_tour = this.game.add.image(width * 0.065, height * 0.84, 'pass_t').setInteractive().on('pointerdown', () => {
            act_pers.pm = 3;
            id_pers += 1;
            if (id_pers == nb_pers)
                id_pers = 0;
            act_pers = pers[id_pers];
            this.refresh_hud();
        });
        if (this.spell1 == undefined)
        {
            this.spell1 = this.game.add.image(width * 0.12, height * 0.8, act_pers.class.spell1.id).setInteractive().on('pointerdown', () => {
                if (act_pers.class.bl_range == 0)
                {
                    act_pers.class.act_spell = act_pers.class.spell1;
                    act_pers.show_range(act_pers.class.spell1.po);
                    this.spell1.tint = 0xA0A0A0;
                    act_pers.class.bl_range = 1;
                }
                else
                {
                    act_pers.class.act_spell = undefined;
                    map.refresh_map();
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
	constructor(posx, posy, type){
        this.isPers = undefined;
		this.posx = posx;
        this.posy = posy;
        this.rposx = posy;
        this.rposy = posx;
        this.type = type;
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
    }
    draw_bloc (game, posx, posy, largeur, hauteur) {
        this.x = posx;
        this.y = posy;
        let x = 22.5;
        let y = 22.5;
        var polygon = new Phaser.Geom.Polygon([
            x, y - 50 * 0.5,
            x + 50 * 0.43, y - 50 * 0.25,
            x + 50 * 0.43, y + 50  * 0.25,
            x, y + 50 * 0.5,
            x - 50 * 0.48, y + 50  * 0.26,
            x - 50 * 0.48, y - 50 * 0.26,
        ]);
        if (this.posx % 2 == 0 && this.type != 0)
            this.file = "iso_2_pair";
        switch (this.type){
			case 2:
                this.img = game.add.image(posx, posy - hauteur * 0.25, this.file).setDisplaySize(largeur, hauteur).setInteractive();
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
