class Archer{
	constructor(game) {
		this.game = game;
		this.name = "Archer";
		this.spell1 = new Spell("Wob", "Archer_spell_1", 5, 10);
		this.spell1_id = "Archer_spell_1";
		this.bl_range = 0
	}
	load_class(game) {
		this.spell1.load(game);
	}
	spell1() {

	}
}

class Spell{
	constructor(name, id, po, dmg) {
		this.name = name;
		this.id = id;
		this.po = po;
		this.dmg = dmg;
	}
	load(game){
		this.img = game.load.image(this.id, 'asset/' + this.id + '.png');
	}
}