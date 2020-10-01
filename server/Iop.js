class Iop{
	constructor() {
		this.name = "Iop";
		this.file = "Iop";
		this.spells = [];
		this.init_spell();
		this.act_spell = undefined;
		this.spell_show = false;
	}
	init_spell(){
		this.spells.push(new Spell("CaC", 0, "Iop_spell_1", 0, 10, 20, 3, 0));
	}
}

class Spell{
	constructor(name, id, file,min_po, po, dmg, pa) {
		this.name = name;
		this.id = id;
		this.file = file;
		this.pa = pa;
		this.po = [min_po, po];
		this.dmg = dmg;
		this.al_show  = false;
	}
	do(){
		console.log("i attack !")
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
	does_see(pos, obj, player){
		let pos_obj = [obj.posx, obj.posy];
		let vect = [pos_obj[0] - pos[0], pos_obj[1] - pos[1]];
		let pos_current = pos;
		for (let i = 0; i < 50; i++)
		{
			pos_current = [pos_current[0] + vect[0] / 50, pos_current[1] + vect[1] / 50];
			let pos_current_obj = [Math.round(pos_current[0]), Math.round(pos_current[1])];
			let bloc = player.map.t_map[pos_current_obj[0]][pos_current_obj[1]];
			if (bloc.type == 2 || (bloc.isPers != undefined && bloc != player.bloc))
				return (false);
		}
		return (true);
	}
	pre_show(player){
		this.al_show = (this.al_show == false ? true : false);
		player.classe.act_spell = (player.classe.act_spell == undefined ? this : undefined);
		let range = player.get_range(this.po);
		let see_range = [];
		for (let i =0; i < range.length; i++)
		{
			if (this.does_see(player.pos, range[i], player) == true)
				see_range.push(range[i]);
			else
				continue;
		}
		return ([range, see_range]);
	}
	/*action(obj, add) {
		if (this.perso.pa - this.pa >= 0)
		{
			if (obj.isPers)
			{
				let enemy = obj.isPers;
				enemy.pv -= this.dmg;
				aff.display_dmg(this.dmg, enemy, add);
			}
			this.perso.pa -= this.pa;
			hud.refresh_hud();
		}
	}*/
}

module.exports = {
	Iop, Spell
}