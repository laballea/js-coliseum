
class Main extends Phaser.Scene {
    socket
    map;
    player;
	path = [];
	hud;
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
        });
        this.socket.on('end_previsu', (path) =>{
            if (path == undefined)
                return ;
            for (let i = 0; i < path.length; i++)
            {
                this.map.img_bloc[path[i][0]][path[i][1]].img.tint = 0x007700;
                this.path.push(this.map.img_bloc[path[i][0]][path[i][1]]);
            }
        });
        this.socket.on('change_pos', (state, id) =>{
			let tmp = state.players[id];
			if (id == this.player.id)
			{
				this.player.re_draw(this, this.map.img_bloc[tmp.pos[0]][tmp.pos[1]]);
				this.hud.re_draw(state, this);
			}
			else
				this.player.re_draw_enemy(state, this);
			this.map.actualize_map(state);
			
		});
		this.socket.on('new_log', (state) =>{
			this.player.re_draw_enemy(state, this);
			this.map.actualize_map(state);
		});
		this.socket.on('end_tour', (state, id)=>{
			this.hud.re_draw(state, this);
		})
		this.socket.on('preshow_range', (data, al_show, player) =>{
			let range = data[0];
			let see_range = data[1];
			this.player.perso = player;
			if (see_range == undefined || range == undefined)
				return ;
			if (al_show == true)
				this.map.draw_range(range, see_range, 0x000077);
			else
				this.map.draw_range(range, see_range, undefined);
		});
		this.socket.on('attacked', (game) =>{
			this.player.perso = game.players[this.player.id];
			this.hud.re_draw(game, this);
		})
		this.socket.on('previsu_zone', (zone) =>{
			if (zone != undefined)
				this.map.draw_range(zone, zone, 0x770000);
		})
    }
	click_function(){
		this.input.on('gameobjectdown', (pointer,gameObject) =>{
			if (gameObject.type == 1)
            {
				if (this.player.perso.classe.act_spell != undefined && tmp != undefined)
					this.socket.emit("attack", gameObject.data.data)
				else if (this.path.length != 0)
					this.socket.emit('move', this.path);
			}
		});
		var tmp = undefined;
        this.input.on('gameobjectover', (pointer,gameObject) =>{
			if (gameObject.type == 1)
            {
				let bloc = gameObject.data;
				if (this.player.perso.classe.act_spell != undefined)
					this.socket.emit("over_spell", this.player.perso.classe.act_spell.id, bloc.data);
				else if (this.path.length == 0)
					this.socket.emit("previsu", bloc.data);
				if (gameObject.tintBottomLeft == 0x770000)
				{
					gameObject.tint = 0x770000;
					tmp = gameObject;
				}
				else
					tmp = undefined;
			}
        });
        this.input.on('gameobjectout', (pointer,gameObject) =>{
			if (gameObject.type == 1)
			{
				/*if (this.zone.length >0)
				{
					for (let i = 0; i < this.zone.length; i++)
						zone[i].img.tint = undefined;
				}*/	
				if (this.path.length != 0)
				{
					for (let i = 0; i < this.path.length; i++)
						this.path[i].img.tint = undefined;
					this.path = [];
					}
				}
			});
	}
    build(state, id) {
		this.map = new Map(state);
		this.map.draw_map(this);
		this.player = new Perso(state, id, this);
		this.hud = new HUD(state, id);
		this.hud.draw_hud(this);
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
