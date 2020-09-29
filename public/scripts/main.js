
class Main extends Phaser.Scene {
    socket
    map;
    player;
    preload () {
        this.imageGroup = this.add.group();
        load_hud(this);
        load_map(this);
        load_class(this);
    }
    create () {
        this.socket = io();
        this.socket.on('stateChanged', (state, id, current) => {
            this.build(state, id, current);
        })
    }
    draw_hud(game, state, player)
    {
        let hud = new HUD(game, state, player);
        hud.load_hud();
	}
	click_function(){
		this.input.on('gameobjectdown', (pointer,gameObject) =>{
			let bloc = this.map.img_bloc[gameObject.data].img.tint = 0x770000;
		});
	}
    build (state, id, current) {
		this.map = new Map(state);
		this.perso = new Perso(state, id);
		this.map.draw_map(this);
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
