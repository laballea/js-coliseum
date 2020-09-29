
class Main extends Phaser.Scene {
    socket
    map;
    player;
    path = [];
    preload () {
        this.imageGroup = this.add.group();
        load_hud(this);
        load_map(this);
        load_class(this);
    }
    create () {
        this.socket = io();
        this.socket.on('stateChanged', (state, id, current) =>{
            this.build(state, id, current);
        })
        this.socket.on('end_previsu', (path) =>{
            if (path == undefined)
                return ;
            for (let i = 0; i < path.length; i++)
            {
                this.map.img_bloc[path[i][0]][path[i][1]].img.tint = 0x007700;
                this.path.push(this.map.img_bloc[path[i][0]][path[i][1]]);
            }
        })
    }
	click_function(){
		this.input.on('gameobjectdown', (pointer,gameObject) =>{
            let bloc = gameObject.data;
            if (this.path.length != 0)
            {
                this.player.re_draw(this, this.map.img_bloc[bloc.data.posx][bloc.data.posy]);
                this.map.img_bloc[bloc.data.posx][bloc.data.posy].img.tint = 0x770000;
            }
        });
        this.input.on('gameobjectover', (pointer,gameObject) =>{
            let bloc = gameObject.data;
            if (this.path.length == 0)
			    this.socket.emit("previsu", bloc.data)
        });
        this.input.on('gameobjectout', (pointer,gameObject) =>{
            if (this.path.length != 0)
            {
                for (let i = 0; i < this.path.length; i++)
                    this.path[i].img.tint = undefined;
                this.path = [];
                }
            });
	}
    build (state, id, current) {
		this.map = new Map(state);
		this.map.draw_map(this);
		this.player = new Perso(state, id, this);
		this.click_function();
    }
    update ()
    {
    }
    constructor() {
        super('Main')
    }
}

let config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    scene: Main,
    backgroundColor: '#0x000000'
};

let game = new Phaser.Game(config);
