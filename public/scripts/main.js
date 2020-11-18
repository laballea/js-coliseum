
class Main extends Phaser.Scene {
    preload () {
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		preload_img(this);
	}
	socket_menu_handler() {
		this.socket.on('edit_pseudo', (data, id) =>{
			if (id == this._menu.state.player.id)
				this._menu.state.player = data.player;
			this._menu.state.players = data.players;
			this.socket.emit('data_change', this._menu.state);
			this._menu.actualize();
		});
		this.socket.on('destroy_menu', () =>{
			this._menu.delete_menu();
        });
		this.socket.on('new_menu', (data) =>{
			console.log("ok");
			this._menu.actualize(data);
		});
		this.socket.on('change_type', (type, state) => {
			this._menu.change_game_type(type, state);
		})
		this.socket.on('menu', (menu, id) =>{
			this.input.off('gameobjectdown');
			this.input.off('gameobjectover');
			this.input.off('gameobjectout');
            this.menu(menu, id);
		});
		this.socket.on('rdy_to_launch', () =>{
			this.socket.emit('rdy_to_launch');
		});
	}
    create () {
		this.socket = io();
		this.socket.on('qwerty', () =>{
			let latency = Date.now() - this.startTime;
			this.hud.ping(latency, this);
		});
		this.socket_menu_handler();
        this.socket.on('stateChanged', (state, id) =>{
            this.build(state, id);
		});
		this.socket.on('died', (state, lst) =>{
			this.player.update(state, this);
			if (lst.find(ele => ele === this.player.id) != undefined)
				this.map.reset_tint();
        });
        this.socket.on('end_previsu', (path) =>{;
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
				this.player.re_draw(this, this.map.img_bloc[tmp.pos[0]][tmp.pos[1]], state);
				this.hud.re_draw(state, this);
			}
			else
				this.player.re_draw_enemy(state, this);
			this.map.actualize_map(state);
			
		});
		this.socket.on('end_tour', (state, id)=>{
			this.hud.re_draw(state, this);
		});
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
		});
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
		});
		this.socket.on('end_game', (winners) =>{
			let time = 0;
			if (winners != false) {
				this.hud.win(winners, this);
				time = 2500;
			}
			setTimeout( () => {
				this.hud.destroy_all();
				this.player.destroy_all();
				this.map.destroy_all();
				this.socket.emit('game_end');
			}, time);
		});
    }
	click_function(){
		this.input.on('gameobjectdown', (pointer,gameObject) =>{
			if (gameObject.type == 1)
            {
				if (this.player.perso.classe.act_spell != undefined)
					this.socket.emit("attack", gameObject.data.data.pos)
				else if (this.path.length != 0) {
					this.socket.emit('move', this.path);
					this.path = [];
					this.map.reset_tint();
				}
			}
		});
        this.input.on('gameobjectover', (pointer, gameObject) =>{
			if (gameObject.type == 1)
            {
				let bloc = gameObject.data;
				if (this.player.perso.classe.act_spell != undefined)
					this.socket.emit("over_spell", this.player.perso.classe.act_spell.id, bloc.data.pos);
				else if (this.path.length == 0)
					this.socket.emit("previsu", bloc.data.pos);
			}
        });
        this.input.on('gameobjectout', (pointer, gameObject) =>{
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
					for (let i = 0; i < this.path.length; i++) {
						this.path[i].img.tint = undefined;
					}
					this.path = [];
				}
			}});
	}
	menu(state, id) {
		this._menu = new Menu(state, this, id);
	}
    build(state, id) {
		this.aff = new Aff(state);
		this.map = new Map(state);
		this.map.draw_map(this);
		this.player = new Perso(state, id, this);
		this.hud = new HUD(state, id);
		this.hud.draw_hud(this);
		this.click_function();
		setInterval( () => {
			this.startTime = Date.now();
			this.socket.emit('azerty');
		}, 2000);
    }
    update ()
    {
    }
    constructor() {
		super('Main')
		this.startTime;
		this.socket;
		this.map;
		this.player;
		this.aff;
		this.path = [];
		this.zone = [];
		this.hud;
		this._menu;
		
    }
}

let config = {
    type: Phaser.AUTO,
    width: 1600,
	height: 900,
	//autoCenter: true,
    scene: Main,
	backgroundColor: '#0x000000',
    dom: {
        createContainer: true
    },
};

let game = new Phaser.Game(config);
