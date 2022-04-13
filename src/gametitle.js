var gameTitle = function(game){}

gameTitle.prototype = {
    
    init: function() {
        // Listen for arrow keys
        cursors = this.game.input.keyboard.createCursorKeys();
        selected = 0;
        // Also listen for Enter and other keys
        var keys = [Phaser.KeyCode.ENTER,Phaser.KeyCode.Q,Phaser.KeyCode.E,Phaser.KeyCode.I,Phaser.KeyCode.P];
        // Create Phaser.Key objects for listening to the state
        phaserKeys = this.game.input.keyboard.addKeys(keys);
        // Capture these keys to stop the browser from receiving this event
        this.game.input.keyboard.addKeyCapture(keys);    
        // Assign keys to variables
        enterKey = phaserKeys[0];
        zeroKeyLeft = phaserKeys[1];
        oneKeyLeft = phaserKeys[2];
        zeroKeyRight = phaserKeys[3];
        oneKeyRight = phaserKeys[4];
        
    },    
    
  	create: function(){
        //Background
        var sky = this.game.add.sprite(0,this.game.world.height,'sky'); 
        sky.anchor.setTo(0,1);        
        var background = this.game.add.tileSprite(0,0,this.game.world.width,this.game.world.height,'numbersTile'); 
        background.alpha=0.1;
        background.tileScale.setTo(0.5);
        
        //Title splash screen
		var gameTitle = this.game.add.sprite(this.game.world.centerX,240,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
        
        //Buttons to start single- and dual-player games
        var singleSelect = this.game.add.button(this.game.world.centerX,500,"singleselect",this.selectSingle,this);
		singleSelect.anchor.setTo(0.5,0.5);
        var dualSelect = this.game.add.button(this.game.world.centerX,550,"dualselect",this.selectDual,this);
		dualSelect.anchor.setTo(0.5,0.5);
        
        //Selection indicator
        var selector = this.game.add.sprite(this.game.world.centerX-150,500,"banana");
        selector.anchor.setTo(0.5,0.5);
        
        //Tween for moving the selector
        selectorTweendown = this.game.add.tween(selector).to({y:550},300,Phaser.Easing.Linear.None,false,false);
        selectorTweenup = this.game.add.tween(selector).to({y:500},300,Phaser.Easing.Linear.None,false,false);
        
        //Sound when moving the selector
        selectorSound = this.game.add.audio("switch");
        //Sound when selecting game
        enterSound = this.game.add.audio("play");
	},
    
    update: function() {
        
        //Moving between selections
        
        if(cursors.down.justDown){
            if(selected==0){
                selectorTweendown.start();
                selectorSound.play();
                selected=1;
            }
        }
        
        if(cursors.up.justDown) {
            if(selected==1){
                selectorTweenup.start();
                selectorSound.play();
                selected=0;
            }
        }
        
        if(zeroKeyLeft.justDown || zeroKeyRight.justDown){
            if(selected==0){
                selectorTweendown.start();
                selectorSound.play();
                selected=1;
            }
            else if(selected==1){
                selectorTweenup.start();
                selectorSound.play();
                selected=0;
            }
        }
        
        
        //Selecting
        
        if(enterKey.justDown || oneKeyLeft.justDown || oneKeyRight.justDown) {
            if(selected==0){this.selectSingle()}
            if(selected==1){this.selectDual()}
        }
    },
    
    selectSingle: function() {
        enterSound.onStop.add(this.playSingle,this);
        enterSound.play();
    },
    
    selectDual: function() {
        enterSound.onStop.add(this.playDual,this);
        enterSound.play();
    },    
    
	playSingle: function(){
        this.game.state.start("GameSingle");
	},
    
	playDual: function(){
        this.game.state.start("GameDual");
	}    
    
}