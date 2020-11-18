
/* SPELL HELP 
d = droite, g = gauche, b = bas, h = haut
LIGNE
1 = diag g/d bas
2 = diag g/d haut
3 = diag d/g bas
4 = diag d/g haut

DIAG
1 = vertical bas
2 = vertical haut
3 = horizontal gauche
4 =	horizontal droite
//type 0 = cercle; type 1 = ligne; type 2 = diag
*/
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
		this.spells.push(new Spell("Colère de Iop", 0, "Iop_spell_0", [1, 1], true, 100, 6, 0, [0, [0, 0]]));
		this.spells.push(new Spell("Epée destructrice", 1, "Iop_spell_1", [1, 4], true, 50, 4, 1, [1, [0, 1], [[2, 4], [1, 3], [2, 4], [1, 3]], true]));
		this.spells.push(new Spell("Epee céléste", 2, "Iop_spell_2", [0, 4], true, 35, 4, 1, [0, [0, 2]]));
		this.spells.push(new Spell("Epee de Iop", 3, "Iop_spell_3", [1, 10], false, 40, 4, 1, [1, [0, 3], [5], false]));
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
		this.spells.push(new Spell("Flèche enflamée", 0, "Cra_spell_0", [1, 7], true, 35, 4, 1, [1, [0, 5], [[1], [2], [3], [4]], true]));
		this.spells.push(new Spell("Oeil de Taupe", 1, "Cra_spell_1", [5, 8], true, 25, 3, 0, [0, [0, 3]]));
		this.spells.push(new Spell("Flèche harcelante", 2, "Cra_spell_2", [1, 7], false, 15, 3, 0, [0, [0, 0]]));
		this.spells.push(new Spell("Flèche explosive", 3, "Cra_spell_3", [1, 8], true, 50, 4, 0, [0, [0, 2]]));
		this.spells.push(new Spell("Epee de Iop", 4, "Iop_spell_3", [1, 10], false, 40, 4, 1, [1, [0, 3], [5], false]));

	}
}

class Spell{
	constructor(name, id, file, po, ldv, dmg, pa, type, zone) {
		this.name = name;
		this.ldv = ldv;
		this.zone = zone;
		this.type = type; 
		this.id = id;
		this.file = file;
		this.pa = pa;
		this.po = po;
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
	get_rel_pos(a, b) {
		//0 = d/db, 1 = b/bg, 2 = g/gh, 3 = h/hd
		if (a > 0 && b >= 0)
			return(0);
		else if (a < 0 && b <= 0)
			return (2);
		else if (b > 0 && a <= 0)
			return (1);
		else if (b < 0 && a >= 0)
			return(3);
	}
	spell_zone(obj, map, player){
		let zone = [];
		if (this.see_range.find(ele => ele.id === obj.id) != undefined) {
				let rel_pos = this.get_rel_pos(obj.pos[0] - player.pos[0], obj.pos[1] - player.pos[1]);
				if (this.zone[0] == 0)
					zone = this.utils.cercle(this.zone[1], map, obj);
				else if (this.zone[0] == 1)
					zone = this.utils.ligne(this.zone[1], map, obj, true, rel_pos);
				else if (this.zone[0] == 2)
					zone = this.utils.diag(this.zone[1], map, obj, true, rel_pos);
				return (zone);
		}
		return (zone);
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
			if ((bloc.isPers != undefined && bloc != player.bloc && bloc.id == obj.id) || this.ldv == false)
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
		for (let i = 0; i < range.length; i++)
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
		if (dst <= max && dst >= min)
			return (obj);
		else
			return (undefined);
	}
	cercle(po, map, target) {
		let path = [];
		for (let x = 0; x < map.largeur; x++) {
			for (let y = 0; y < map.hauteur; y++) {
				let obj = this.in_range(po, map.t_map[x][y], target);
				if (obj != undefined && obj.type != 2)
					path.push(obj);
			}
		}
		return (path);
	}
	/* END */
	/* LIGNE */
	ajust(a) {
		if (a > 4)
			return(a - 4);
		return (a);
	}
	check_push(map, x, y, lst, id, bool, rel_pos){
		if (map.t_map[x] && map.t_map[x][y] && map.t_map[x][y].type != 2) {
			if (lst.find(ele => ele.id === map.t_map[x][y].id) == undefined) {
				if (this.zone[0] == 0 || bool == false)
					lst.push(map.t_map[x][y]);
				else {
					let tmp = this.zone[2];
					if (this.zone[3])
						tmp = this.zone[2][rel_pos];
					if (tmp.find(ele => this.ajust(ele) === id) != undefined || this.zone[2][0] == 5) {
						lst.push(map.t_map[x][y]);
					}
				}
			}
		}
		return ;
	}
	ligne(po, map, obj, bool, rel_pos){
		let lst = [];
		let pos = obj.pos;
		for (let x = po[0]; x <= po[1]; x++){
			this.check_push(map, pos[0] + x, pos[1], lst, 1, bool, rel_pos);
			this.check_push(map, pos[0], pos[1] + x, lst, 2, bool, rel_pos);
			this.check_push(map, pos[0] - x, pos[1], lst, 3, bool, rel_pos);
			this.check_push(map, pos[0], pos[1] - x, lst, 4, bool, rel_pos);
		}
		return (lst);
	}
	/* END */
	/* DIAG */
	diag(po, map, obj, bool, rel_pos){
		let lst = [];
		let pos = obj.pos;
		for (let x = po[0]; x <= po[1]; x++){
			this.check_push(map, pos[0] + x, pos[1] + x, lst, 1, bool, rel_pos);
			this.check_push(map, pos[0] - x, pos[1] - x, lst, 2, bool, rel_pos);
			this.check_push(map, pos[0] - x, pos[1] + x, lst, 3, bool, rel_pos);
			this.check_push(map, pos[0] + x, pos[1] - x, lst, 4, bool, rel_pos);
		}
		return (lst);
	}
}

module.exports = {
	Cra, Iop, Spell
}