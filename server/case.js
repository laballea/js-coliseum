
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
		this.parse_file();
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
}

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
        this.x;
        this.y;
		this.over = false;
        if (this.type)
            this.empty = true;
        else
            this.empty = false;
    }
}

module.exports = {
	bloc, Map
}