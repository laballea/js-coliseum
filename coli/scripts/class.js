class Iop{
	constructor(game) {
		this.game = game;
		this.name = "Iop";
		this.spell1 = new Spell("CaC", "Iop_spell_1", 0, 1, 20, 3);
		this.spell1_id = "Iop_spell_1";
		this.bl_range = 0;
		this.act_spell;
	}
	load_class(game) {
		this.img = game.load.image(this.name, 'asset/' + this.name + '.png');
		this.spell1.load(game);
	}
	spell1() {

	}
}

class Spell{
	constructor(name, id,min_po, po, dmg, pa) {
		this.name = name;
		this.id = id;
		this.pa = pa;
		this.po = [min_po, po];
		this.min_po = min_po;
		this.dmg = dmg;
	}
	load(game){
		this.img = game.load.image(this.id, 'asset/' + this.id + '.png');
	}
	action(obj, add) {
		if (act_pers.pa - this.pa >= 0)
		{
			if (obj.isPers)
			{
				let enemy = obj.isPers;
				enemy.pv -= this.dmg;
				aff.display_dmg(this.dmg, enemy, add);
			}
			act_pers.pa -= this.pa;
			hud.refresh_hud();
		}
	}
}