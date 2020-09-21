/* Class Perso*/
class Perso{
    constructor(name, posx, posy, file, map, pm){
        this.name = name;
        this.posx = posx;
        this.posy = posy;
        this.bloc = map[posy][posx];
        this.file = file;
        this.pm = pm;
    }
    get_pos (bloc){
        this.y = bloc.y;
        this.x = bloc.x;
    }
}
/*END*/

/* Class HUD */
class HUD{
    constructor(game) {
        this.game = game;
        }
    load_hud() {
        this.h_pm = this.game.add.text(width * 0.05, height * 0.80, 'PM :' + act_pers.pm, {
            font: "15px Arial",
            fill: "#008000",
            align: "center"
        });
        this.pass_tour = this.game.add.image(width * 0.08, height * 0.88, 'pass_t').setInteractive().on('pointerdown', () => {
            console.log(act_pers);
        });
    }
    refresh_hud() {
        this.h_pm.destroy();
        this.load_hud();

    }
}

/* Class d'un Bloc */
class bloc{
	constructor(posx, posy, type){
		this.posx = posx;
        this.posy = posy;
		this.type = type;
		switch (this.type){
			case '0':
				this.file = 'iso_0';
				break ;
			case '1':
				this.file = 'iso_2';
                break ;
            case '2':
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
			case '2':
                this.img = game.add.image(posx, posy - hauteur * 0.25, this.file).setDisplaySize(largeur, hauteur).setInteractive();
                this.img.alpha = 0.7;
				break ;
			case '1':
				this.img = game.add.image(posx, posy, this.file).setDisplaySize(largeur, hauteur).setInteractive();
				break ;
        }
        if (this.type != 0)
            this.img.data = [this.posx, this.posy];
    }
}
/*END*/
