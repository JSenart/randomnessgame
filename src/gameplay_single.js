var gameSingle = function(game){
}

gameSingle.prototype = {
    
    
    init: function() {
        // List all keys to be listened for
        var keys = [Phaser.KeyCode.Q, Phaser.KeyCode.E, Phaser.KeyCode.ESC];
        // Create Phaser.Key objects for listening to the state
        phaserKeys = this.game.input.keyboard.addKeys(keys);
        // Capture these keys to stop the browser from receiving this event
        this.game.input.keyboard.addKeyCapture(keys);    
        // Assign keys to variables
        zeroKey = phaserKeys[0];
        oneKey = phaserKeys[1];
        escKey = phaserKeys[2];
    },
    
    
    create: function() {
        //Start a game instance
        singleGame = new gameInstance(this.game);
        //Create a counter for rate animations
        counter = 0;
        //Create variables indicating when the game is over
        playerGameOver = false;
        gameOver = false;
        //Create variable to hold the player's random numbers
        rndnums = [];
        //Create variable to hold the computer's random numbers
        rndnumscomp = [];
        //Can't seemed to make timed events work
        //A do-nothing sprite to work around with tweens
        donothingSprite = this.game.add.sprite(-10,-10,'banana');
        donothingSprite.alpha = 0;
        
	},
    
    
    update: function(){
        
        //If the escape key has been pressed terminate game
        if(escKey.justDown){
            //Terminate game
            this.terminate();
        }
        
        //Always animate background and check for collisions
        singleGame.animateBackground();
        singleGame.checkCollisions();

        //If the game is running
        if(singleGame.startedLeft&&!singleGame.gameOverLeft) {
            //Update counter
            counter++;
            //Periodically update rate and animate the rate meter
            if (counter%10==0) {
                singleGame.rateLeft = rndnums.length/singleGame.timerLeft.seconds;
                singleGame.animateRateLeft();
            }   
            
            //The zero-bit key has been pressed
            if(zeroKey.justDown){
                singleGame.fireRNGLeft(0);
                rndnums.push(0);
            }
            
             //The one-bit key has been pressed
            if(oneKey.justDown){
                singleGame.fireRNGLeft(1);
                rndnums.push(1);
            }
            
            
        }
        
        //If the game has not yet started
        else if(!singleGame.startedLeft) {
            //The zero-bit key has been pressed
            if(zeroKey.justDown){
                //Start game
                singleGame.startLeft();
                //Fire the RNG
                singleGame.fireRNGLeft(0);
                rndnums.push(0);
            }
            //The one-bit key has been pressed
            if(oneKey.justDown){
                //Start game
                singleGame.startLeft();
                //Fire the RNG
                singleGame.fireRNGLeft(1);
                rndnums.push(1);
            }            
        }
        
        //If we are in game over mode
        else if(singleGame.gameOverLeft) {
            //The game just ended for the player
            if(!playerGameOver) {
                playerGameOver = true;
                //Start a game over animation
                var bitsupImg = this.game.add.sprite(singleGame.centerLeft,-70,'bitsupMsg');
                bitsupImg.anchor.setTo(0.5,0.5);
                var bitsupTween = this.game.add.tween(bitsupImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true);
                bitsupTween.yoyo(true,1000);
                bitsupTween.onComplete.add(this.markBitsPlayer,this);
            }
            //The game is over for the computer
            else if(singleGame.gameOverRight) {
                //The game just ended for the computer
                if(!gameOver) {
                    gameOver= true;
                    //Can't seem to make timed events, work, so use a do-nothing tween instead
                    var donothingTween = this.game.add.tween(donothingSprite).to({x:-10},1500,Phaser.Easing.Linear.None,true);
                    donothingTween.onComplete.add(this.markBitsComp,this);                                           
                    //Start a game over animation
                    var anykeyImg = this.game.add.sprite(this.game.world.centerX,-70,'anykeyMsg');
                    anykeyImg.anchor.setTo(0.5,0.5);
                    var anykeyTween = this.game.add.tween(anykeyImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true,1000);
                }
                //End the game when a key is pressed
                else {
                    if(zeroKey.isDown) {this.endGame()}
                    if(oneKey.isDown) {this.endGame()}
                }
            }                        
        }

    },
    
    markBitsPlayer: function() {
        //Brag about guessing...
        var guessedImg = this.game.add.sprite(singleGame.centerLeft,-70,'guessedMsg');
        guessedImg.anchor.setTo(0.5,0.5);
        var guessedTween = this.game.add.tween(guessedImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true);
        guessedTween.yoyo(true,1000);
        
        //Highlight the correctly predicted digits
        var predicted = predictive(rndnums,3,2);
        for(var k=0; k<predicted.length; k++) {
            singleGame.tagAt(predicted[k],'left');
        }
        
        //Can't seem to make timed events, work, so use a do-nothing tween instead
        var donothingTween = this.game.add.tween(donothingSprite).to({x:-10},2000,Phaser.Easing.Linear.None,true);
        donothingTween.onComplete.add(this.startComputer,this);        
    },
    
    markBitsComp: function() {
        var predicted = predictive(rndnumscomp,3,2);
        for(var k=0; k<predicted.length; k++) {
            singleGame.tagAt(predicted[k],'right');
        }
    },
    
    startComputer: function () {
        computerGameStarted = true;
        singleGame.startRight();
        singleGame.rateRight = 15; //max rate...not optimal dependence fix later
        singleGame.animateRateRight();
        //Can't seem to make timed events, work, so use a do-nothing tween instead
        var donothingTween = this.game.add.tween(donothingSprite).to({x:-10},30,Phaser.Easing.Linear.None,true);
        donothingTween.onComplete.add(this.playComputer,this);
    },
    
    playComputer: function () {
        var bit = Math.round(Math.random());
        rndnumscomp.push(bit);
        singleGame.fireRNGRight(bit);
        if(!singleGame.gameOverRight) {
            //Can't seem to make timed events, work, so use a do-nothing tween instead
            var donothingTween = this.game.add.tween(donothingSprite).to({x:-10},30,Phaser.Easing.Linear.None,true);
            donothingTween.onComplete.add(this.playComputer,this);
        }
    },
    
    endGame: function () {
/*        //Get number of predicted digits for player and computer
        var guessedleft = predictive(rndnums,3,2).length;
        var guessedright = predictive(rndnumscomp,3,2).length;
        //Get the Wald-Wolfowitz score for player and computer (measure of independence)
        var indepleft = getScore(rndnums);
        var indepright = getScore(rndnumscomp);
        //Get rate for player and set to infinity for computer
        var rateleft = singleGame.rateLeft;
        var rateright = Infinity;*/
        //Load the score board
        this.game.state.start("GameOver",true,false,'single',singleGame.rateLeft,Infinity,rndnums,rndnumscomp);
    },
    
    terminate: function() {
        //Clear the game world and return to title screen
        this.game.state.start("GameTitle",true,false);
    }  
    
    //For debugging...
/*    render: function() {
        this.game.debug.text('Time: ' + timer.seconds.toString(), 32, 32);
        this.game.debug.text('Bits: ' + rndnums.length.toString(), 32, 48);
        this.game.debug.text('Rate: ' + rate.toString(), 32, 64);
        this.game.debug.text('Rnd: ' + getScore(rndnums).toString(), 32, 74);
    }*/
    
}