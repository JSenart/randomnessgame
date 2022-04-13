//Creates an instance of the randomness game with two players. Sets the stage, and provides handles to animate the background,
//move the monkeys, update the meters etc. Can be used both for single and dual-player games.
function gameInstance(game) {
    
    //Public variables
    this.startedLeft = false;
    this.startedRight = false;
    this.gameOverLeft = false;
    this.gameOverRight = false;
    this.rndScoreLeft = 0;
    this.rndScoreRight = 0;
    this.rateLeft = 0;
    this.rateRight = 0;
    this.timerLeft = null;
    this.timerRight = null;
    this.centerLeft = 0;
    this.centerRight = 0;
    
    //Initialise animation counter
    var counter = 0;
    
    //Set up timers
    this.timerLeft = game.time.create(false);
    this.timerRight = game.time.create(false);
    
    //////////////////////////////////////////
    //  Set up the game stage elements
    /////////////////////////////////////////
    
    //Enable P2 Physics
    game.physics.startSystem(Phaser.Physics.P2JS);
    //Default restitution for collisions
    game.physics.p2.restitution = 0.3;
    //Enable gravity
    game.physics.p2.gravity.y = 300;
    
    //Background
    var sky = game.add.sprite(0,game.world.height,'sky'); 
    sky.anchor.setTo(0,1);        
    var background = game.add.tileSprite(0,0,game.world.width,game.world.height,'numbersTile'); 
    background.alpha=0.1;
    background.tileScale.setTo(0.5);
    
    //Containers where the numbers collect (paper scrolls)
    var collectorLeft = game.add.sprite(Math.round(game.world.centerX/2)-50,120,'scroll'); 
    collectorLeft.anchor.setTo(0.5,0);
    this.centerLeft = collectorLeft.x;
    var collectorRight = game.add.sprite(game.world.centerX+Math.round(game.world.centerX/2)+50,120,'scroll'); 
    collectorRight.anchor.setTo(0.5,0);
    this.centerRight = collectorRight.x;
    
    //Floor for numbers to stand on
    var numFloor = game.add.sprite(game.world.width/2,collectorLeft.bottom-56);
    numFloor.anchor.setTo(0.5,0);
    numFloor.width = game.world.width;
    numFloor.height = 10;
    game.physics.p2.enable(numFloor);
    numFloor.body.setRectangleFromSprite();
    numFloor.body.static=true;
    //Make the floor visible for debugging
    //numFloor.body.debug=true;
    
    //Add physics groups to hold the number sprites
    var numsLeft = game.add.physicsGroup(Phaser.Physics.P2JS);
    var numsRight = game.add.physicsGroup(Phaser.Physics.P2JS);
    //Create 156 number sprites per player; they are not visible yet but they are there for later use
    numsLeft.createMultiple(156,'numSheet');
    numsRight.createMultiple(156,'numSheet');
    //Prevent the numbers from rotating and give them a rectangular body based on the graphics
    numsLeft.setAll('body.fixedRotation',true);
    numsRight.setAll('body.fixedRotation',true);
    numsLeft.callAll('body.setRectangleFromSprite','body');    
    numsRight.callAll('body.setRectangleFromSprite','body');
    
    //Put the player avatars (RNG devices) on the scene
    //movement bounds
    var avatarLeftmin = collectorLeft.left+25;
    var avatarLeftmax = collectorLeft.right-35;
    var avatarRightmin = collectorRight.left+25;
    var avatarRightmax = collectorRight.right-35;
    //create avatar
    var avatarLeft = game.add.sprite(avatarLeftmax,collectorLeft.top-30,'monkey',0);
    var avatarRight = game.add.sprite(avatarRightmax,collectorRight.top-30,'monkey',0);
    avatarLeft.anchor.setTo(0.5,0.5);
    avatarRight.anchor.setTo(0.5,0.5);    
    //add typing animations
    avatarLeft.animations.add('typeleft',[2,0],10);
    avatarLeft.animations.add('typeright',[1,0],10);
    avatarLeft.animations.add('type',[1,2]);
    avatarRight.animations.add('typeleft',[2,0],10);
    avatarRight.animations.add('typeright',[1,0],10);
    avatarRight.animations.add('type',[1,2]);    
    //Add typing sounds
    var returnSound = game.add.audio("ding");
    var typeleftSound = game.add.audio("type1");
    var typerightSound = game.add.audio("type2");    

    //Add meters for the rate
    //meters
    var rateMeterLeft = game.add.sprite(collectorLeft.right+40,collectorLeft.bottom-30,'meter');
    rateMeterLeft.anchor.setTo(0.5,1);
    var rateMeterRight = game.add.sprite(collectorRight.left-40,collectorRight.bottom-30,'meter');
    rateMeterRight.anchor.setTo(0.5,1);
    //indicator movement bounds
    var rateIndicatorLeftMin = rateMeterLeft.bottom-20;
    var rateIndicatorLeftMax = rateMeterLeft.top+20;
    var rateIndicatorRightMin = rateMeterRight.bottom-20;
    var rateIndicatorRightMax = rateMeterRight.top+20;
    //indicators
    var rateIndicatorLeft = game.add.sprite(rateMeterLeft.x,rateIndicatorLeftMin,'indicator');
    rateIndicatorLeft.anchor.setTo(0.5,0.5);      
    var rateIndicatorRight = game.add.sprite(rateMeterRight.x,rateIndicatorRightMin,'indicator');
    rateIndicatorRight.anchor.setTo(0.5,0.5);      
    
    
    ///////////////////////////////////////////////////////////
    //  Define public functions to control the game dynamics
    ///////////////////////////////////////////////////////////
    
    //Animate background (take the animation one step forward)
    this.animateBackground = function () {
        counter++;
        background.tilePosition.x += 1*Math.sin(counter/70);
        background.tilePosition.y += 1;
        background.tileScale.setTo(0.5+0.1*Math.cos(counter/100));
    }
    
    //Implement collisions between the numbers, and with the floor
    this.checkCollisions = function () {
        //Make sure numbers collide with each other and with the floor
        game.physics.arcade.collide(numsLeft,numsLeft);
        game.physics.arcade.collide(numsRight,numsRight);
        game.physics.arcade.collide(numsLeft,numFloor);
        game.physics.arcade.collide(numsRight,numFloor);
    }
    
    //Start the left player
    this.startLeft = function () {
        this.timerLeft.start();
        this.startedLeft = true;
    }
    
    //Start the right player
    this.startRight = function () {
        this.timerRight.start();
        this.startedRight = true;
    }
    
    //Fire the left player RNG with a given value. 
    this.fireRNGLeft = function(val) {        
        // Get the first inactive number sprite, by passing 'false' as a parameter
        var num = numsLeft.getFirstExists(false);
        if (num) {
            //Frame 0 displays zero, frame 1 displays one
            num.frame=val;
            // If we have a number sprite, set it to the position of the RNG device
            num.reset(avatarLeft.x, avatarLeft.y+25);
            // Give it a downward velocity
            num.body.velocity.y = 200;
            //Move the RNG device
            avatarLeft.x = avatarLeft.x-25;
            if(val==0){avatarLeft.animations.play('typeleft');}else{avatarLeft.animations.play('typeright');}
            if(val==0){typeleftSound.play();}else{typerightSound.play()}
            //Carriage return...
            if(avatarLeft.x<avatarLeftmin) {
                avatarLeft.x=avatarLeftmax;
                returnSound.play();
            };
        } else {
            //If there are no more number sprites left, game over the player
            this.gameOverLeft = true;
        }
    }
    
    //Fire the right player RNG with a given value.
    this.fireRNGRight = function(val) {
        // Get the first inactive number sprite, by passing 'false' as a parameter
        var num = numsRight.getFirstExists(false);
        if (num) {
            //Frame 0 displays zero, frame 1 displays one
            num.frame=val;
            // If we have a number sprite, set it to the position of the RNG device
            num.reset(avatarRight.x, avatarRight.y+25);
            // Give it a downward velocity
            num.body.velocity.y = 200;
            //Move the RNG device
            avatarRight.x = avatarRight.x-25;
            if(val==0){avatarRight.animations.play('typeleft');}else{avatarRight.animations.play('typeright');}
            if(val==0){typeleftSound.play();}else{typerightSound.play()}
            //Carriage return...
            if(avatarRight.x<avatarRightmin) {
                avatarRight.x=avatarRightmax;
                returnSound.play();
            };
        } else {
            //If there are no more number sprites left, game over the player
            this.gameOverRight = true;
        }
    }
    
    //Tween the left player rate meter to the current value
    this.animateRateLeft = function (){
        //Tween settings
        var duration = 300;
        var easing = Phaser.Easing.Exponential.Out;        
        //Set the max rate of the meter
        var maxrate = 15;
        //Transform the rate to a meter reading
        var reading = rateIndicatorLeftMin - Math.min(1,this.rateLeft/maxrate)*(rateIndicatorLeftMin-rateIndicatorLeftMax);
        //Create tween and autostart it
        var indicatorTween = game.add.tween(rateIndicatorLeft).to({y:reading},duration,easing,true);                
    }
    
    //Tween the right player rate meter to the current value
    this.animateRateRight = function (){
        //Tween settings
        var duration = 300;
        var easing = Phaser.Easing.Exponential.Out;        
        //Set the max rate of the meter
        var maxrate = 15;
        //Transform the rate to a meter reading
        var reading = rateIndicatorRightMin - Math.min(1,this.rateRight/maxrate)*(rateIndicatorRightMin-rateIndicatorRightMax);
        //Create tween and autostart it
        var indicatorTween = game.add.tween(rateIndicatorRight).to({y:reading},duration,easing,true);                
    }
    
    //Highlight a number at a given position in the string of generated numbers for a given player
    this.tagAt = function (k,player){        
        if(player=='left') {
            //game.add.tween(numsLeft.getAt(k)).to({alpha:0.5},1000,Phaser.Easing.Linear.None,true,0,-1,true);
            numsLeft.getAt(k).alpha=0.5;
        }
        if(player=='right') {
            numsRight.getAt(k).alpha=0.5;
        }
    }
    
    ///////////////////////////////////////////////////////////
    //  Define private functions
    ///////////////////////////////////////////////////////////
    
    
}