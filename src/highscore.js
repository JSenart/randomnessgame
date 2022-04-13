
var highScore = function(game){}

highScore.prototype = {
    
    init: function() {
        // Listen for Enter and Esc
        var keys = [Phaser.KeyCode.ESC,Phaser.KeyCode.ENTER, Phaser.KeyCode.Q, Phaser.KeyCode.E, Phaser.KeyCode.I, Phaser.KeyCode.P];
        // Create Phaser.Key objects for listening to the state
        phaserKeys = this.game.input.keyboard.addKeys(keys);
        // Capture these keys to stop the browser from receiving this event
        this.game.input.keyboard.addKeyCapture(keys);    
        // Assign keys to variables
        escKey = phaserKeys[0];
        enterKey = phaserKeys[1];
        zeroKeyLeft = phaserKeys[2];
        oneKeyLeft = phaserKeys[3];
        zeroKeyRight = phaserKeys[4];
        oneKeyRight = phaserKeys[5];        
        
        //For checking if scores are ready and have been written
        scores = [];
        scoresReady = false;
        scoresWritten = false;
    },    
    
  	create: function(){
        //Background
        var sky = this.game.add.sprite(0,this.game.world.height,'sky'); 
        sky.anchor.setTo(0,1);        
        var background = this.game.add.tileSprite(0,0,this.game.world.width,this.game.world.height,'numbersTile'); 
        background.alpha=0.1;
        background.tileScale.setTo(0.5);
        
        //Highscore title
		var title = this.game.add.sprite(this.game.world.centerX,50,"hightitle");
		title.anchor.setTo(0.5,0.5);
        var name = this.game.add.sprite(150,120,"highname");
		name.anchor.setTo(0.5,0.5);
        var rate = this.game.add.sprite(470,120,"highrate");
		rate.anchor.setTo(0.5,0.5);
        var guess = this.game.add.sprite(590,120,"highguess");
		guess.anchor.setTo(0.5,0.5);
        var indep = this.game.add.sprite(720,120,"highindep");
		indep.anchor.setTo(0.5,0.5);       
        var score = this.game.add.sprite(840,120,"highscore");
		score.anchor.setTo(0.5,0.5);               
        
        //Retrieve the stored scores
        // var scoredata = this.getscores();
        var scoredata = this.getlocalscores();
	},
    
    update: function() {
        
        if(scoresReady && !scoresWritten) {
            this.writescores();
            scoresWritten = true;
        }
        
        if(escKey.justDown || enterKey.justDown || zeroKeyLeft.justDown || oneKeyLeft.justDown || zeroKeyRight.justDown || oneKeyRight.justDown){
            this.terminate();
        }
    },
    
    getscores: function() {
        //Create an XMLHttpRequest to call the PHP script that retrieves the stored scores
        //This is necessary as Javascript is client side and does not have access to the file system
        var xmlreq = new XMLHttpRequest();
        
        //Handle to the writescores function
        var fun = this.writescores;
        
        //To be run when the request completes  
        var scoredata = [];
        xmlreq.onreadystatechange = function() {
            if(xmlreq.readyState==4 && xmlreq.status==200) {
                scores = JSON.parse(xmlreq.responseText);
                scoresReady = true;
            }
        }        
        
        xmlreq.open('GET','get_score.php',true);
        xmlreq.send();       
    },

    getlocalscores: function() {
        // Open our database; it is created if it doesn't already exist
        // (see the upgradeneeded handler below)
        const openRequest = window.indexedDB.open('highscores_db', 1);
        
        //Handle to the writescores function
        var fun = this.writescores;
        
        var scoredata = [];

        // error handler signifies that the database didn't open successfully
        openRequest.addEventListener('error', () => console.error('Database failed to open'));

        // success handler signifies that the database opened successfully
        openRequest.addEventListener('success', () => {
            console.log('Database opened successfully');

            // Store the opened database object in the db variable. This is used a lot below
            db = openRequest.result;

            scoresReady = true;
        });

        // Open our object store and then get a cursor - which iterates through all the
        // different data items in the store
        const objectStore = db.transaction('highscores_os').objectStore('highscores_os');
        objectStore.openCursor().addEventListener('success', e => {
            // Get a reference to the cursor
            const cursor = e.target.result;

            // If there is still another data item to iterate through, keep running this code
            if(cursor) {
                scores.push([
                    cursor.value.name,
                    cursor.value.rate,
                    cursor.value.guessed,
                    cursor.value.ww,
                    cursor.value.score,
                ])
                // Iterate to the next item in the cursor
                cursor.continue();
            }
            scoresReady = true;
        });
    },
    
    writescores: function() {
        //Text styling
        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };

        //Text positioning
        var leftName = 100;
        var leftRate = 450;
        var leftGuessed = 550;
        var leftIndep = 700;
        var leftScore = 800;  
        var ystart = 150;
        var inc = 50;
        
        //Max length of name to display
        var maxname = 18;
        
        for(var k=0; k<scores.length; k++) {
            
            var name = (scores[k][0]).substring(0,maxname);
            var rate = scores[k][1];
            var guessed = scores[k][2];
            var indep = scores[k][3];
            var score = scores[k][4];
            
            this.game.add.text(leftName , ystart + k*inc , name , style);
            this.game.add.text(leftRate , ystart + k*inc , rate , style);
            this.game.add.text(leftGuessed , ystart + k*inc , guessed , style);
            this.game.add.text(leftIndep , ystart + k*inc , indep , style);
            this.game.add.text(leftScore , ystart + k*inc , score , style);
        }
    },

    terminate: function() {
        //Clear the game world and return to title screen
        this.game.state.start("GameTitle",true,false);
    }      
    
}
