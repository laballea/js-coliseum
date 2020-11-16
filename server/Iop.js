//const io = require('socket.io')(server)

class Iop{
	constructor() {
		this.name = "Iop";
		this.rot = [1, 0];
		this.file = ["Iop_3q_dos", "Iop_3q_face", "Iop_dos", "Iop_face", "Iop_profil"]; // 0 1 2 3 4
		this.dim = [125, 205];
		this.fact = 0.45;
		this.spells = [];
		this.init_spell();
		this.act_spell = undefined;
	}
	init_spell(){
		this.spells.push(new Spell("CoCo", 0, "Iop_spell_0", 0, 10, 1000, 4, 0, [0, [-1, 1]]));
		this.spells.push(new Spell("qwe", 1, "Iop_spell_1", 0, 10, 20, 3, 1, [1, [0, 4], [1, 2]]));
		this.spells.push(new Spell("aze", 2, "Iop_spell_2", 0, 10, 20, 3, 2, [2, [0, 4], [1, 2]]));
	}
}

class Cra{
	constructor() {
		this.name = "Cra";
		this.rot = [1, 0];
		this.file = ["Cra_3q_dos", "Cra_3q_face", "Cra_dos", "Cra_face", "Cra_profil"]; // 0 1 2 3 4
		this.dim = [125, 205];
		this.fact = 0.45;
		this.spells = [];
		this.init_spell();
		this.act_spell = undefined;
	}
	init_spell(){
		this.spells.push(new Spell("CoCo", 0, "Iop_spell_0", 0, 10, 1000, 4, 0, [0, [-1, 1]]));
		this.spells.push(new Spell("qwe", 1, "Iop_spell_1", 0, 10, 20, 3, 1, [1, [0, 4], [1, 2]]));
		this.spells.push(new Spell("aze", 2, "Iop_spell_2", 0, 10, 20, 3, 2, [2, [0, 4], [1, 2]]));
	}
}

class Spell{
	constructor(name, id, file, min_po, po, dmg, pa, type, zone) {
		this.name = name;
		this.zone = zone; // type -1 = 1case; type 0 = cercle; type 1 = ligne; type 2 = diag
		this.type = type; //type 0 = cercle; type 1 = ligne; type 2 = diag
		this.id = id;
		this.file = file;
		this.pa = pa;
		this.po = [min_po, po];
		this.dmg = dmg;
		this.utils = new utils(this.zone);
		this.see_range = undefined;
	}
	do(player, enemy, game){
		if (player.pa - this.pa >= 0)
		{
			for (let i = 0; i < enemy.length; i++) {
				if (game.players[enemy[i]] != undefined) {
					game.players[enemy[i]].pv -= this.dmg;
					if (game.players[enemy[i]].pv <= 0)
						game.players[enemy[i]].dead = true;
				}
			}
			player.pa -= this.pa;
			return (true);
		}
		return (false);
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
	spell_zone(obj, map){
		let path = [];
		let zone = undefined;
		for (let i = 0; i < this.see_range.length; i++){
			if (this.see_range[i].id == obj.id){
				if (this.zone[0] == 0)
					zone = this.utils.cercle(this.zone[1], map, obj);
				else if (this.zone[0] == 1)
					zone = this.utils.ligne(this.zone[1], map, obj, true);
				else if (this.zone[0] == 2)
					zone = this.utils.diag(this.zone[1], map, obj, true);
				//zone = this.utils.cercle([-1, 1], map, obj);
				for (let i = 0; i < zone.length; i++)
					path.push(zone[i]);
				return (path);
			}
		}
		return (path);
	}
	does_see(pos, obj, player){
		let pos_obj = [obj.posx, obj.posy];
		let vect = [pos_obj[0] - pos[0], pos_obj[1] - pos[1]];
		let pos_current = pos;
		for (let i = 0; i < 50; i++)
		{
			pos_current = [pos_current[0] + vect[0] / 50, pos_current[1] + vect[1] / 50];
			let pos_current_obj = [Math.round(pos_current[0]), Math.round(pos_current[1])];
			let bloc = player.map.t_map[pos_current_obj[0]][pos_current_obj[1]];
			if (bloc.isPers != undefined && bloc != player.bloc && bloc.id == obj.id)
				return (true);
			if (bloc.type == 2 || (bloc.isPers != undefined && bloc != player.bloc))
				return (false);
		}
		return (true);
	}
	pre_show(player, map){
		player.classe.act_spell = (player.classe.act_spell != this ? this : undefined);
		if (player.classe.act_spell == undefined)
			return (undefined);
		let range;
		if (this.type == 0)
			range = this.utils.cercle(this.po, map, player);
		else if (this.type == 1)
			range = this.utils.ligne(this.po, map, player, false);
		else if (this.type == 2)
			range = this.utils.diag(this.po, map, player, false);
		let see_range = [];
		for (let i =0; i < range.length; i++)
		{
			if (this.does_see(player.pos, range[i], player) == true)
				see_range.push(range[i]);
			else
				continue;
		}
		this.see_range = see_range;
		return ([range, see_range]);
	}

}

class utils{
	constructor(zone) {
		this.zone = zone;
	}
	/* CERCLE */
	in_range(po, obj, player) {
		let min = po[0];
		let max = po[1];
		let nXDifferenceTiles = Math.abs(player.pos[0] - obj.posx);
		let nYDifferenceTiles = Math.abs(player.pos[1] - obj.posy);
		let dst = nXDifferenceTiles + nYDifferenceTiles;
		if (dst <= max && dst > min)
			return (obj);
		else
			return (undefined);
	}
	cercle(po, map, player) {
		let path = [];
		for (let x = 0; x < map.largeur; x++) {
			for (let y = 0; y < map.hauteur; y++) {
				let obj = this.in_range(po, map.t_map[x][y], player);
				if (obj != undefined)
					path.push(obj);
			}
		}
		return (path);
	}
	/* END */
	/* LIGNE */
	check_push(map, x, y, lst, id, zone){
		if (map.t_map[x] && map.t_map[x][y]) {
			if (this.zone[0] == 0 || zone == false)
				lst.push(map.t_map[x][y]);
			else {
				if (this.zone[2].find(ele => ele === id) != undefined || this.zone[2][0] == 5) {
					lst.push(map.t_map[x][y]);
				}
			}
		}
		return ;
	}
	ligne(po, map, player, zone){
		let lst = [];
		let pos = player.pos;
		for (let x = po[0] + 1; x < po[1]; x++){
			this.check_push(map, pos[0] + x, pos[1], lst, 1, zone);
			this.check_push(map, pos[0] - x, pos[1], lst, 2, zone);
			this.check_push(map, pos[0], pos[1] + x, lst, 3, zone);
			this.check_push(map, pos[0], pos[1] - x, lst, 4, zone);
		}
		return (lst);
	}
	/* END */
	/* DIAG */
	diag(po, map, player, zone){
		let lst = [];
		let pos = player.pos;
		for (let x = po[0] + 1; x < po[1]; x++){
			this.check_push(map, pos[0] + x, pos[1] + x, lst, 1, zone);
			this.check_push(map, pos[0] - x, pos[1] + x, lst, 2, zone);
			this.check_push(map, pos[0] + x, pos[1] - x, lst, 3, zone);
			this.check_push(map, pos[0] - x, pos[1] - x, lst, 4, zone);
		}
		return (lst);
	}
}

module.exports = {
	Cra, Iop, Spell
}