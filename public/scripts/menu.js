
class Menu{
	constructor(state) {
		this.state = state;
	}
	draw_menu() {
		floor = new Phaser.Rectangle(0, 550, 800, 50);
		game.debug.geom(floor,'#0fffff');
	}
}
