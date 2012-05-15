window.onload = function() {
	//initialize objects
	var canvas = null;
	var stage = null;
	var screen_width = null;
	var screen_hight = null;
	var blockSpriteSheetAsset = new Image();
	var blockSS = null;
	var testPill = null;
	var testGrid = null;
	var tempBorder = null;
	var gameSpeed = 2,
		playerSpeed = .1;
	
	//key events
	var keyPress = {
		left: false,
		right: false,
		up: false,
		down: false,
		a: false,
		s: false,
		shouldMove: true,
		shouldTurn: true,
		s: false
	};
	window.onkeydown = function(e) {
		keyPress.shouldMove = true;
		switch (e.keyCode) {
			case 37:
				keyPress.left = true;
				break;
			case 38:
				keyPress.up = true;
				break;
			case 39:
				keyPress.right = true;
				break;
			case 40:
				keyPress.down = true;
				break;
			case 65:
				keyPress.shouldTurn = true;
				keyPress.a = true;
				break;
			case 83:
				keyPress.shouldTurn = true;
				keyPress.s = true;
				break;
		}
	}
	
	window.onkeyup = function(e) {
		switch (e.keyCode) {
			case 37:
				keyPress.left = false;
				break;
			case 38:
				keyPress.up = false;
				break;
			case 39:
				keyPress.right = false;
				break;
			case 40:
				keyPress.down = false;
				break;
			case 65:
				keyPress.a = false;
				break;
			case 83:
				keyPress.s = false;
				break;
		}
	}		
	function init() {
		canvas = document.getElementById("gameCanvas");

		blockSpriteSheetAsset.onload = handleImageLoad;
		blockSpriteSheetAsset.onerror = handleImageError;
		blockSpriteSheetAsset.src = "assets/block.png";

	}
	
	function handleImageLoad(e) {
		console.log(e.target.src + " loaded")
		startGame();
	}
	
	function handleImageError(e) {
		console.log("Error Loading Image : " + e.target.src);
	}
	
	function startGame() {
		
		stage = new Stage(canvas);
		screen_width = canvas.width;
		screen_height = canvas.height;
		
		blockSS = new SpriteSheet({
			images:[blockSpriteSheetAsset],
			frames: {width:20, height:20, regX:10, regY:10, numFrames:6},
			animations: {
				red: [0],
				yellow: [1],
				blue: [2],
				red_virus: [3],
				yellow_virus: [4],
				blue_virus: [5]
			}
		});
		//create temp game border
		var g = new Graphics();
		g.beginStroke(Graphics.getRGB(0,0,0)).drawRect(0,0,160,320);
		tempBorder = new Shape(g);
		tempBorder.x = 220;
		tempBorder.y = 140;

		//create grid
		testGrid = new Grid(230,150);
		testGrid.initViruses(0,blockSS);
		stage.addChild(testGrid);
		stage.update();
		testGrid.print();
		
		//create test pill
		testPill = new Pill(blockSS,290,150,"red","blue");
		stage.addChild(tempBorder,testPill);
		stage.update();
		
		Ticker.useRAF = true;
		Ticker.setFPS(60);
		Ticker.addListener(window);
	}
	
	function tick() {
		//pill moving/turning logic
		//console.log(testGrid.getGridValue(testPill.x, testPill.y));
		if (testPill.canMoveDown(testGrid)) {
			if (keyPress.shouldMove) {
				if (keyPress.left && testPill.canMoveLeft(testGrid)) {
					testPill.moveLeft();
					keyPress.shouldMove = false;
				}
				if (keyPress.right && testPill.canMoveRight(testGrid)) {
					testPill.moveRight();
					keyPress.shouldMove = false;
				}
				if (keyPress.down) {
					testPill.moveDown();
					keyPress.shouldMove = false;
				}
			}
			if (keyPress.shouldTurn) {
				if (keyPress.s && testPill.canTurnCW(testGrid)) {
					testPill.turnCW(testGrid);
					keyPress.shouldTurn = false;
				}
				if (keyPress.a && testPill.canTurnCCW(testGrid)) {
					testPill.turnCCW(testGrid);
					keyPress.shouldTurn = false;
				}
			}
		}

		else {
			var writePill = testPill.writeToGrid(testGrid);
			stage.addChild(writePill);
			testPill.x = 290;
			testPill.y = 150;
		}
		stage.update();
		//console.log(testPill.x + ', ' + testPill.y);
	}
	
	window.tick = tick;
	init();

};