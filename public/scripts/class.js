class Iop{
	constructor(game, perso) {
		this.perso = perso;
		this.game = game;
		this.name = "Iop";
		this.spell1 = new Spell("CaC", "Iop_spell_1", 0, 1, 20, 3, perso);
		this.spell1_id = "Iop_spell_1";
		this.bl_range = 0;
		this.act_spell;
	}
}

class Spell{
	constructor(name, id,min_po, po, dmg, pa, perso) {
		this.perso = perso;
		this.name = name;
		this.id = id;
		this.pa = pa;
		this.po = [min_po, po];
		this.min_po = min_po;
		this.dmg = dmg;
	}
	action(obj, add) {
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
	}
}