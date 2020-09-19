var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {preload: preload, create: create, update: update});
var data_map = "0000000000;0111111110;0111111110;0111111110;0111111110;0111111110;0111111110;0111111110;0111111110;0000000000";

function parseFile() {
	part = new Array();
	tab = data_map.split(';');
	map = new Array(tab[0].length);
	for (let i = 0; i < tab.length; i++) {
		map[i] = new Array(tab.length);
	}
	for (let n = 0; n < tab.length; n++) {
		for (let i = 0; i < tab[0].length; i++) {
			map[i][n] = tab[n][i];
		}
	}
}

function preload() {
	handleRemoteImagesOnJSFiddle();
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
	game.stage.backgroundColor = '#eee';
	game.load.image('empty', "img/anaconda.png");
	console.log("hello");
}

function create() {
	parseFile();
	//empty = game.add.sprite(game.world.width*0.5, game.world.height-25, 'empty');
}

function update() {

}

function handleRemoteImagesOnJSFiddle() {
	game.load.baseURL = 'https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/';
	game.load.crossOrigin = 'anonymous';
}