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
    constructor(name, posx, posy, file, bl, game, classe){
		this.class = classe;
        this.game = game;
        this.name = name;
        this.posx = posx;
        this.posy = posy;
        this.bloc = bl;
        this.file = file;
        this.pm = 3;
        this.img = 0;
	}
	show_range (po) {
		map.refresh_map();
		for (let x = 0; x < map.largeur; x++) {
			for (let y = 0; y < map.hauteur; y++) {
				let obj_b = map.t_map[x][y];
				let nXDifferenceTiles = Math.abs(act_pers.x - obj_b.x);
				let nYDifferenceTiles = Math.abs(act_pers.y - obj_b.y);
				if (nXDifferenceTiles <= largeur / 2 * po && nYDifferenceTiles <= hauteur / 4 * po)
					obj_b.img.tint = 0x0000FF;
			}
		}
	}
    init_bloc (bloc, add){
        this.bloc.isPers = 1;
        this.y = bloc.y;
        this.x = bloc.x;
        if (this.img)
            this.img.destroy();
        this.img = add.image(this.x, this.y - 32.5, 'perso');
    }

    check_move(obj){
        if (this.posx - Math.abs((this.posy % 2 - 1)) == obj.rposx && this.posy - 1 == obj.rposy)
            return (1);
        else if (this.posx + (this.posy % 2) == obj.rposx && this.posy + 1 == obj.rposy)
            return (1);
        else if (this.posx - Math.abs((this.posy % 2 - 1)) == obj.rposx && this.posy + 1 == obj.rposy)
            return (1);
        else if (this.posx + (this.posy % 2) == obj.rposx && act_pers.posy - 1 == obj.rposy)
            return (1);
        else
            return (-1);
    }
    move(obj){
		console.log(this.check_move(obj) != -1, act_pers.pm - 1 >= 0, obj.isPers == 0);
        if (this.check_move(obj) != -1 && act_pers.pm - 1 >= 0 && obj.isPers == 0)
        {
            this.bloc.isPers = 0;
            act_pers.bloc = obj;
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
		this.spell1 = this.game.add.image(width * 0.12, height * 0.8, act_pers.class.spell1.id).setInteractive().on('pointerdown', () => {
			if (act_pers.class.bl_range == 0)
			{
				act_pers.show_range(act_pers.class.spell1.po);
				this.spell1.tint = 0xA0A0A0;
				act_pers.class.bl_range = 1;
			}
			else
			{
				map.refresh_map();
				act_pers.class.bl_range = 0;
				this.spell1.tint = undefined;
			}
		});
        this.h_pm = this.game.add.text(width * 0.05, height * 0.80, 'PM :' + act_pers.pm, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.h_name = this.game.add.text(width * 0.05, height * 0.77, act_pers.name, {
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
    }
    refresh_hud() {
        this.h_pm.destroy();
        this.h_name.destroy();
        this.load_hud();

    }
}

/* Class d'un Bloc */
class bloc{
	constructor(posx, posy, type){
        this.isPers = 0;
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
        if (this.posx % 2 == 0 && this.type != 0)
            this.file = "iso_2_pair";
        switch (this.type){
			case 2:
                this.img = game.add.image(posx, posy - hauteur * 0.25, this.file).setDisplaySize(largeur, hauteur).setInteractive();
                this.img.alpha = 0.7;
				break ;
			case 1:
				this.img = game.add.image(posx, posy, this.file).setDisplaySize(largeur, hauteur).setInteractive();
				break ;
        }
        if (this.type != 0)
			this.img.data = [this.posx, this.posy];
    }
}
/*END*/
