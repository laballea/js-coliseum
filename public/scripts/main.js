
class Main extends Phaser.Scene {
    socket
    map;
	player;
	aff;
	path = [];
	zone = [];
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
			this.player.perso = player;
			if (data == undefined)
			{
				this.map.reset_tint();
				return ;
			}
			let range = data[0];
			let see_range = data[1];
			if (see_range == undefined || range == undefined)
				return ;
			this.map.reset_tint();
			this.map.draw_range(range, see_range, 0x000077);
		});
		this.socket.on('attacked', (game, spell, enemys) =>{
			this.player.perso = game.players[this.player.id];
			this.hud.re_draw(game, this);
			this.aff.display_dmg(spell, enemys, game, this);
		})
		this.socket.on('previsu_zone', (zone) =>{
            if (zone == undefined)
				return ;
			for (let i = 0; i < zone.length; i++)
			{
				let bloc =  this.map.img_bloc[zone[i].posx][zone[i].posy];
				if (bloc.img)
               	{
				   bloc.img.tint = 0x770000;
				   this.zone.push(this.map.img_bloc[zone[i].posx][zone[i].posy]);
			   	}
            }
		})
    }
	click_function(){
		this.input.on('gameobjectdown', (pointer,gameObject) =>{
			if (gameObject.type == 1)
            {
				if (this.player.perso.classe.act_spell != undefined)
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
			}
        });
        this.input.on('gameobjectout', (pointer,gameObject) =>{
			if (gameObject.type == 1)
			{
				if (this.zone.length != 0)
				{
					for (let i = 0; i < this.zone.length; i++)
						this.zone[i].img.tint = this.zone[i].tint;
					this.zone = [];
				}	
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
		this.aff = new Aff(state);
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
