var gameDual = function(game){
}

gameDual.prototype = {
    
    
    init: function() {
        // List all keys to be listened for
        var keys = [Phaser.KeyCode.Q, Phaser.KeyCode.E, Phaser.KeyCode.I, Phaser.KeyCode.P, Phaser.KeyCode.ESC,Phaser.KeyCode.SPACEBAR];
        // Create Phaser.Key objects for listening to the state
        phaserKeys = this.game.input.keyboard.addKeys(keys);
        // Capture these keys to stop the browser from receiving this event
        this.game.input.keyboard.addKeyCapture(keys);    
        // Assign keys to variables
        zeroKeyLeft = phaserKeys[0];
        oneKeyLeft = phaserKeys[1];
        zeroKeyRight = phaserKeys[2];
        oneKeyRight = phaserKeys[3];
        escKey = phaserKeys[4];
        cheatKey = phaserKeys[5];
    },
    
    
    create: function() {
        //Start a game instance
        dualGame = new gameInstance(this.game);
        //Create a counters for rate animations
        counterLeft = 0;
        counterRight = 0;
        //Create variables indicating when the game is over
        gameOverLeft = false;
        gameOverRight = false;
        gameOverBoth = false;
        //Create holders for the players' random numbers
        rndnumsLeft = [];
        rndnumsRight = [];
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
        
/*        //Toggle score updates
        if(cheatKey.justDown){
            cheat = !cheat;
        }*/
        
        //Always animate background and check for collisions
        dualGame.animateBackground();
        dualGame.checkCollisions();
        
        
        // LEFT PLAYER ROUTINE ////////////////////

        //If the left player is playing
        if(dualGame.startedLeft&&!dualGame.gameOverLeft) {
            //Update counter
            counterLeft++;
            //Periodically update rate and animate the rate meter
            if (counterLeft%10==0) {
                dualGame.rateLeft = rndnumsLeft.length/dualGame.timerLeft.seconds;
                dualGame.animateRateLeft();
            }
            
            //The zero-bit key has been pressed
            if(zeroKeyLeft.justDown){
                dualGame.fireRNGLeft(0);
                rndnumsLeft.push(0);
            }
            
             //The one-bit key has been pressed
            if(oneKeyLeft.justDown){
                dualGame.fireRNGLeft(1);
                rndnumsLeft.push(1);
            }
            
            
        }    
        //If the game has not yet started
        else if(!dualGame.startedLeft) {
            //The zero-bit key has been pressed
            if(zeroKeyLeft.justDown){
                //Start game
                dualGame.startLeft();
                //Fire the RNG
                dualGame.fireRNGLeft(0);
                rndnumsLeft.push(0);
            }
            //The one-bit key has been pressed
            if(oneKeyLeft.justDown){
                //Start game
                dualGame.startLeft();
                //Fire the RNG
                dualGame.fireRNGLeft(1);
                rndnumsLeft.push(1);
            }            
        }    
        //If we are in game over mode
        else if(dualGame.gameOverLeft) {
            //The game just ended for the player
            if(!gameOverLeft) {
                gameOverLeft = true;
                //Start a game over animation
                var bitsupImg = this.game.add.sprite(dualGame.centerLeft,-70,'bitsupMsg');
                bitsupImg.anchor.setTo(0.5,0.5);
                var bitsupTween = this.game.add.tween(bitsupImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true);
                bitsupTween.yoyo(true,1000);
                bitsupTween.onComplete.add(function(){this.markBitsPlayer('left')},this);
                //If this player is the last one to finish, add a delay for the tween to finish
                if(gameOverRight) {
                    //Can't seem to make timed events, work, so use a do-nothing tween instead
                    var donothingTween = this.game.add.tween(donothingSprite).to({x:-10},5000,Phaser.Easing.Linear.None,true);
                    donothingTween.onComplete.add(function(){
                        gameOverBoth=true;
                        //Start a game over animation
                        var anykeyImg = this.game.add.sprite(this.game.world.centerX,-70,'anykeyMsg');
                        anykeyImg.anchor.setTo(0.5,0.5);
                        var anykeyTween = this.game.add.tween(anykeyImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true);
                    },this);                    
                }
            }
        }
        
        // /LEFT PLAYER ROUTINE ///////////////////
        
        
        // RIGHT PLAYER ROUTINE ////////////////////

        //If the right player is playing
        if(dualGame.startedRight&&!dualGame.gameOverRight) {
            //Update counter
            counterRight++;
            //Periodically update rate and animate the rate meter
            if (counterRight%10==0) {
                dualGame.rateRight = rndnumsRight.length/dualGame.timerRight.seconds;
                dualGame.animateRateRight();
            }
            
            //The zero-bit key has been pressed
            if(zeroKeyRight.justDown){
                dualGame.fireRNGRight(0);
                rndnumsRight.push(0);
            }
            
             //The one-bit key has been pressed
            if(oneKeyRight.justDown){
                dualGame.fireRNGRight(1);
                rndnumsRight.push(1);
            }
            
            
        }    
        //If the game has not yet started
        else if(!dualGame.startedRight) {
            //The zero-bit key has been pressed
            if(zeroKeyRight.justDown){
                //Start game
                dualGame.startRight();
                //Fire the RNG
                dualGame.fireRNGRight(0);
                rndnumsRight.push(0);
            }
            //The one-bit key has been pressed
            if(oneKeyRight.justDown){
                //Start game
                dualGame.startRight();
                //Fire the RNG
                dualGame.fireRNGRight(1);
                rndnumsRight.push(1);
            }            
        }    
        //If we are in game over mode
        else if(dualGame.gameOverRight) {
            //The game just ended for the player
            if(!gameOverRight) {
                gameOverRight = true;
                //Start a game over animation
                var bitsupImg = this.game.add.sprite(dualGame.centerRight,-70,'bitsupMsg');
                bitsupImg.anchor.setTo(0.5,0.5);
                var bitsupTween = this.game.add.tween(bitsupImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true);
                bitsupTween.yoyo(true,1000);
                bitsupTween.onComplete.add(function(){this.markBitsPlayer('right')},this);
                //If this player is the last one to finish, add a delay for the tween to finish
                if(gameOverLeft) {
                    //Can't seem to make timed events, work, so use a do-nothing tween instead
                    var donothingTween = this.game.add.tween(donothingSprite).to({x:-10},5000,Phaser.Easing.Linear.None,true);
                    donothingTween.onComplete.add(function(){
                        gameOverBoth=true;
                        //Start a game over animation
                        var anykeyImg = this.game.add.sprite(this.game.world.centerX,-70,'anykeyMsg');
                        anykeyImg.anchor.setTo(0.5,0.5);
                        var anykeyTween = this.game.add.tween(anykeyImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true);
                    },this);                    
                }
            }
        }
        
        // /RIGHT PLAYER ROUTINE ///////////////////
        
        //Both players are done
        if(gameOverBoth) {
            if(zeroKeyLeft.isDown) {this.endGame()}
            if(oneKeyLeft.isDown) {this.endGame()}            
            if(zeroKeyRight.isDown) {this.endGame()}
            if(oneKeyRight.isDown) {this.endGame()}            
        }

    },
    
    markBitsPlayer: function(player) {
        if(player=='left') {
            //Brag about guessing...
            var guessedImg = this.game.add.sprite(dualGame.centerLeft,-70,'guessedMsg');
            guessedImg.anchor.setTo(0.5,0.5);
            var guessedTween = this.game.add.tween(guessedImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true);
            guessedTween.yoyo(true,1000);

            //Highlight the correctly predicted digits
            var predicted = predictive(rndnumsLeft,3,2);
            for(var k=0; k<predicted.length; k++) {
                dualGame.tagAt(predicted[k],'left');
            }  
        }
        else if(player=='right') {
            //Brag about guessing...
            var guessedImg = this.game.add.sprite(dualGame.centerRight,-70,'guessedMsg');
            guessedImg.anchor.setTo(0.5,0.5);
            var guessedTween = this.game.add.tween(guessedImg).to({y:this.game.world.centerY},1000,Phaser.Easing.Elastic.Out,true);
            guessedTween.yoyo(true,1000);

            //Highlight the correctly predicted digits
            var predicted = predictive(rndnumsRight,3,2);
            for(var k=0; k<predicted.length; k++) {
                dualGame.tagAt(predicted[k],'right');
            }  
        }    
    },    
    
    
    endGame: function () {
/*        //Get number of predicted digits for each player
        var guessedleft = predictive(rndnumsLeft,3,2).length;
        var guessedright = predictive(rndnumsRight,3,2).length;
        //Get the Wald-Wolfowitz score for each player (measure of independence)
        var indepleft = getScore(rndnumsLeft);
        var indepright = getScore(rndnumsRight);
        //Get rate for each player
        var rateleft = dualGame.rateLeft;
        var rateright = dualGame.rateRight;*/
        //Load the score board
        this.game.state.start("GameOver",true,false,'dual',dualGame.rateLeft,dualGame.rateRight,rndnumsLeft,rndnumsRight);
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