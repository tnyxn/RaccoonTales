var game = new Phaser.Game(1080, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('bg', 'assets/bg.jpg');
	game.load.image('ground', 'assets/ground.png');
	game.load.image('star', 'assets/star2.png');
	game.load.spritesheet('player', 'assets/ryu.png');
	game.load.spritesheet('rat', 'assets/rat.png', 159, 58, 2);
}

var ground;
var platforms;
var star;
var player;
var rats;

function create() {
	//scaling options
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	//have the game centered horizontally
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;

	game.physics.startSystem(Phaser.Physics.ARCADE);

	//Set up Level
	game.world.setBounds(0, 0, 2000, game.height);
	game.add.image(0,0,'bg');
	ground = game.add.tileSprite(0,game.height-70,game.world.width,70,'ground');

	//Player
	player = game.add.sprite(50, game.height-200, 'player');
	player.anchor.setTo(.5, 1);
	player.animations.add('walk');

	//Platforms
	platforms = game.add.group();
	platforms.enableBody = true;

	var ledge = platforms.create(400, game.height-200, 'ground');
	ledge.scale.x = 5;
	ledge.scale.y = .5;

	ledge.body.immovable = true;

	ledge = platforms.create(150, game.height-350, 'ground');
	ledge.scale.x = 2;
	ledge.scale.y = .5;

	ledge.body.immovable = true;

	ledge = platforms.create(150, game.height-350, 'ground');
	ledge.scale.x = 2;
	ledge.scale.y = .5;

	ledge.body.immovable = true;

	ledge = platforms.create(50, game.height-650, 'ground');
	ledge.scale.setTo(.5,.5);

	ledge.body.immovable = true;

	ledge = platforms.create(300, game.height-475, 'ground');
	ledge.scale.setTo(.5,.5);
	ledge.visible = false;

	ledge.body.immovable = true;

    //Star
    star = game.add.sprite(55, game.height-700, 'star');
    star.enableBody = true;
    game.physics.arcade.enable(star);
    star.body.gravity.y=500;

    //Rats
    rats = game.add.group();
    generateRats();

	//enable physics on the player and ground
	game.physics.arcade.enable(player);
	game.physics.arcade.enable(ground);

	//player gravity
	player.body.gravity.y = 1000;

	//so player can walk on ground
	ground.body.immovable = true;
	ground.body.allowGravity = false;

    //the camera will follow the player in the world
    game.camera.follow(player);

    //move player with cursor keys
    cursors = game.input.keyboard.createCursorKeys();


}

function update() {
	game.physics.arcade.collide([player,star,rats], [ground,platforms]);
	game.physics.arcade.collide(player,rats,collisionHandler);

	player.body.velocity.x = 0;
	player.body.collideWorldBounds = true;

	if (cursors.left.isDown)
	{
        //  Move to the left
        player.body.velocity.x = -450;

        // player.animations.play('walk');
        //player facing left
        player.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 450;

        // player.animations.play('walk');
        //player facing right
        player.scale.x = 1;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
    	player.body.velocity.y = -600;
    }

    //check rat direction
    for (var i = 0; i < rats.children.length; i++) {
    	if (rats.children[i].body.velocity.x < 0) {
    		rats.children[i].scale.x = .65;
    	} else if (rats.children[i].body.velocity.x > 0) {
    		rats.children[i].scale.x = -.65;
    	}
    }
}

function generateRats() {

    //enable physics in them
    rats.enableBody = true;
    rats.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numRats = game.rnd.integerInRange(5, 20);
    var rat;

    for (var i = 0; i < numRats; i++) {
        //add sprite within an area excluding the beginning and ending
        //  of the game world so items won't suddenly appear or disappear when wrapping
        var x = game.rnd.integerInRange(game.width, game.world.width - game.width);
        rat = rats.create(x, game.height/2, 'rat');
        var walk = rat.animations.add('walk');

        rat.body.collideWorldBounds = true;
        rat.body.bounce.setTo(1,0);
        rat.anchor.setTo(.5, 1);
        rat.scale.setTo(.65,.65);
        rat.animations.play('walk', 7, true);
        rat.body.velocity.x = game.rnd.integerInRange(-300,300);

        rat.body.gravity.y = 750;
    }
}

function collisionHandler (player, rat) {
	console.log("collide!");
}














