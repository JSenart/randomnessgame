var gameOver = function(game){}

// Create an instance of a db object for us to store the open database in
let db;

gameOver.prototype = {
	init: function(type,rateleft,rateright,rndnumsleft,rndnumsright){
        //Game type is 'single' or 'dual'
        gametype = type;
        
        //The strings of 'random' numbers from the game that ended
        rndnumsLeft = rndnumsleft;
        rndnumsRight = rndnumsright;
        
        //The rates from the game that ended
        rateLeft = rateleft;
        rateRight = rateright;
        
        //Compute scores based on the rates and number strings passed from the game that ended
        guessedLeft = predictive(rndnumsLeft,3,2).length;
        guessedRight = predictive(rndnumsRight,3,2).length;
        fracLeft = 100*guessedLeft/156; //note this is for 156 bits. Update if this is changed
        fracRight = 100*guessedRight/156; //note this is for 156 bits. Update if this is changed
        indepLeft = getScore(rndnumsLeft);
        indepRight = getScore(rndnumsRight);
        
        scoreLeft = rateLeft*(indepLeft + (100-2*Math.abs(50-fracLeft))); //For bits
        scoreRight = rateRight*(indepRight + (100-2*Math.abs(50-fracRight))); //For bits
        
        // List all keys to be listened for
        var keys = [Phaser.KeyCode.ESC, Phaser.KeyCode.ENTER, Phaser.KeyCode.Q, Phaser.KeyCode.E, Phaser.KeyCode.I, Phaser.KeyCode.P];
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
	},
    
  	create: function(){
        //Background
        var sky = this.game.add.sprite(0,this.game.world.height,'sky'); 
        sky.anchor.setTo(0,1);        
        var background = this.game.add.tileSprite(0,0,this.game.world.width,this.game.world.height,'numbersTile'); 
        background.alpha=0.1;
        background.tileScale.setTo(0.5);  
        
        //Scoreboard title
        var boardTitle = this.game.add.sprite(this.game.world.centerX,50,'scoretitle');
        boardTitle.anchor.setTo(0.5,0.5);
        //Player titles
        var playerOneTitle = this.game.add.sprite(this.game.world.centerX/2+25,150,'playerone');
        playerOneTitle.anchor.setTo(0.5,0.5);
        if(gametype=='single') {var playerTwoTitle = this.game.add.sprite(3*this.game.world.centerX/2-25,150,'computer');}
        if(gametype=='dual') {var playerTwoTitle = this.game.add.sprite(3*this.game.world.centerX/2-25,150,'playertwo');}
        playerTwoTitle.anchor.setTo(0.5,0.5);
        //Scoreboard fixed text
        var guessedOne = this.game.add.sprite(50,225,'guessedOne');
        var indepOne = this.game.add.sprite(50,275,'indepOne');
        var rateOne = this.game.add.sprite(50,325,'rateOne');
        var totalOne = this.game.add.sprite(50,375,'totalOne');
        var guessedTwo = this.game.add.sprite(this.game.world.centerX+25,225,'guessedTwo');
        var indepTwo = this.game.add.sprite(this.game.world.centerX+25,275,'indepTwo');
        var rateTwo = this.game.add.sprite(this.game.world.centerX+25,325,'rateTwo');
        var totalTwo = this.game.add.sprite(this.game.world.centerX+25,375,'totalTwo');        
        
        
        //Scoreboard score text
        
        var styleOne = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };
        var styleTwo = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };

        var oneleft = guessedOne.x + 250;
        var twoleft = guessedTwo.x + 250;
        
        var guessedOneText = this.game.add.text(oneleft,220,"0", styleOne);
        var indepOneText = this.game.add.text(oneleft,270,"0", styleOne);
        var rateOneText = this.game.add.text(oneleft,320,"0", styleOne);
        var totalOneText = this.game.add.text(oneleft,370,"0", styleOne);
        var guessedTwoText = this.game.add.text(twoleft,220,"0", styleOne);
        var indepTwoText = this.game.add.text(twoleft,270,"0", styleOne);
        if(gametype=='dual') {
            var rateTwoText = this.game.add.text(twoleft,320,"0", styleOne);
            var totalTwoText = this.game.add.text(twoleft,370,"0", styleOne);    
        } else {
            var rateTwoText = this.game.add.text(twoleft,320,"millions / sec", styleOne);
            var totalTwoText = this.game.add.text(twoleft,370,"---", styleOne);            
        }
        
        //Variables to hold values for tweening
        var dispGuessedOne = {};
        var dispIndepOne = {};
        var dispRateOne = {};
        var dispTotalOne = {};
        var dispGuessedTwo = {};
        var dispIndepTwo = {};
        var dispRateTwo = {};
        var dispTotalTwo = {};        
        dispGuessedOne.val = 0;
        dispIndepOne.val = 0;
        dispRateOne.val = 0;
        dispTotalOne.val = 0;
        dispGuessedOne.val = 0;
        dispIndepTwo.val = 0;
        dispRateTwo.val = 0;
        dispTotalTwo.val = 0;        
        
        //Tweens for counting up scores
        var guessedTweenOne = this.game.add.tween(dispGuessedOne).to({val:fracLeft},4000,Phaser.Easing.Exponential.Out);
        var indepTweenOne = this.game.add.tween(dispIndepOne).to({val:indepLeft},4000,Phaser.Easing.Exponential.Out);
        var rateTweenOne = this.game.add.tween(dispRateOne).to({val:rateLeft},4000,Phaser.Easing.Exponential.Out);
        var totalTweenOne = this.game.add.tween(dispTotalOne).to({val:scoreLeft},4000,Phaser.Easing.Exponential.Out);
        var guessedTweenTwo = this.game.add.tween(dispGuessedTwo).to({val:fracRight},4000,Phaser.Easing.Exponential.Out);
        var indepTweenTwo = this.game.add.tween(dispIndepTwo).to({val:indepRight},4000,Phaser.Easing.Exponential.Out);
        if(gametype=='dual') {
            var rateTweenTwo = this.game.add.tween(dispRateTwo).to({val:rateRight},4000,Phaser.Easing.Exponential.Out);
            var totalTweenTwo = this.game.add.tween(dispTotalTwo).to({val:scoreRight},4000,Phaser.Easing.Exponential.Out);
        }
        
        //Updating the score text
        guessedTweenOne.onUpdateCallback(function () {
            guessedOneText.text = (Math.round(10*dispGuessedOne.val)/10).toString() + ' %';
        });
        indepTweenOne.onUpdateCallback(function () {
            indepOneText.text = Math.round(dispIndepOne.val).toString();
        });        
        rateTweenOne.onUpdateCallback(function () {
            rateOneText.text = Math.round(dispRateOne.val).toString() + ' / sec';
        });
        totalTweenOne.onUpdateCallback(function () {
            totalOneText.text = Math.round(dispTotalOne.val).toString();
        }); 
        guessedTweenTwo.onUpdateCallback(function () {
            guessedTwoText.text = (Math.round(10*dispGuessedTwo.val)/10).toString() + ' %';
        });
        indepTweenTwo.onUpdateCallback(function () {
            indepTwoText.text = Math.round(dispIndepTwo.val).toString();
        });
        if(gametype=='dual') {
            rateTweenTwo.onUpdateCallback(function () {
                rateTwoText.text = Math.round(dispRateTwo.val).toString() + ' / sec';
            });
            totalTweenTwo.onUpdateCallback(function () {
                totalTwoText.text = Math.round(dispTotalTwo.val).toString();
            }); 
        }
        
        guessedTweenOne.onComplete.add(this.evalscore,this);
        
        guessedTweenOne.start();
        indepTweenOne.start();
        rateTweenOne.start();
        totalTweenOne.start();
        guessedTweenTwo.start();
        indepTweenTwo.start();
        if(gametype=='dual') {
            rateTweenTwo.start();
            totalTweenTwo.start();
        }
	},
    
    update: function () {
        //If the escape key has been pressed terminate game
        if(escKey.justDown){
            //Terminate game
            this.terminate();
        }   
        //If another key has been pressed, ask if the player wants to store the score
        if(enterKey.justDown || zeroKeyLeft.justDown || oneKeyLeft.justDown || zeroKeyRight.justDown || oneKeyRight.justDown){
            //Prompt for name
            var nameLeft = prompt("Stocker le score de Player One?","John Doe");
            var nameRight = null;
            if(gametype=='dual'){nameRight = prompt("Stocker le score de Player Two?","John Doe");}
            
            //Hard code a max name length
            var maxName = 25;
            
            //Store the scores
            if(nameLeft!=null) {
                nameLeft = nameLeft.substr(0,maxName);
                // this.savescore(nameLeft,rateLeft,fracLeft,indepLeft,scoreLeft,rndnumsLeft)
                this.savescorelocally(nameLeft,rateLeft,fracLeft,indepLeft,scoreLeft,rndnumsLeft)
            }
            if(nameRight!=null) {
                nameRight = nameRight.substr(0,maxName);
                // this.savescore(nameRight,rateRight,fracRight,indepRight,scoreRight,rndnumsRight)
                this.savescorelocally(nameRight,rateRight,fracRight,indepRight,scoreRight,rndnumsRight)
            }
            
            //End game and go to highscore screen
            this.endgame();
        }           
    },
    
    savescore: function (name,rate,frac,indep,score,nums) {
        //Create a FormData object and load it with the data to be stored
        var data = new FormData();
        data.append("name" , name);
        data.append("rate" , Math.round(rate).toString());
        data.append("guessed" , (Math.round(10*frac)/10).toString() + ' %'); //percentage with one digit after the comma
        data.append("ww" , Math.round(indep).toString());
        data.append("score" , Math.round(score).toString());
        data.append("nums" , nums.toString());
        //Create an XMLHttpRequest to call the PHP script that stores the data
        //This is necessary as Javascript is client side and does not have access to the file system
        var xmlreq = new XMLHttpRequest();
        xmlreq.open('POST','save_score.php',true);
        xmlreq.send(data);        
    },

    savescorelocally: function (name, rate, frac, indep, score, nums) {
        // Open our database; it is created if it doesn't already exist
        // (see the upgradeneeded handler below)
        const openRequest = window.indexedDB.open('highscores_db', 1);
        
        // error handler signifies that the database didn't open successfully
        openRequest.addEventListener('error', () => console.error('Database failed to open'));

        // success handler signifies that the database opened successfully
        openRequest.addEventListener('success', () => {
            console.log('Database opened successfully');

            // Store the opened database object in the db variable. This is used a lot below
            db = openRequest.result;
        
            // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
            const newItem = {
                name: name,
                rate: Math.round(rate).toString(),
                guessed: (Math.round(10*frac)/10).toString() + ' %',
                ww: Math.round(indep).toString(),
                score: Math.round(score).toString(),
                nums: nums.toString(),
            };
        
            // open a read/write db transaction, ready for adding the data
            const transaction = db.transaction(['highscores_os'], 'readwrite');
        
            // call an object store that's already been added to the database
            const objectStore = transaction.objectStore('highscores_os');
        
            // Make a request to add our newItem object to the object store
            const addRequest = objectStore.add(newItem);
        
            addRequest.addEventListener('success', () => {
                console.log('Great success!!!');
            });
        
            // Report on the success of the transaction completing, when everything is done
            transaction.addEventListener('complete', () => {
            console.log('Transaction completed: database modification finished.');
            });
        
            transaction.addEventListener('error', () => console.log('Transaction not opened due to error'));
        });

        // Set up the database tables if this has not already been done
        openRequest.addEventListener('upgradeneeded', e => {

            // Grab a reference to the opened database
            db = e.target.result;
        
            // Create an objectStore to store our notes in (basically like a single table)
            // including a auto-incrementing key
            const objectStore = db.createObjectStore('highscores_os', { keyPath: 'id', autoIncrement:true });
        
            // Define what data items the objectStore will contain
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('rate', 'rate', { unique: false });
            objectStore.createIndex('guessed', 'guessed', { unique: false });
            objectStore.createIndex('ww', 'ww', { unique: false });
            objectStore.createIndex('score', 'score', { unique: false });
            
            console.log('Database setup complete');
        });
        

        //Create an XMLHttpRequest to call the PHP script that stores the data
        //This is necessary as Javascript is client side and does not have access to the file system
        // var xmlreq = new XMLHttpRequest();
        // xmlreq.open('POST','save_score.php',true);
        // xmlreq.send(data);        
    },
    
    evalscore: function() {
        //Bounds for different catergories of evaluation
        var bcrap = 200;
        var bbad = 700;
        var bok = 1000;
        var bgood = 1600;
        
        var posXleft = this.game.world.centerX/2;
        var posXright = 3*this.game.world.centerX/2;
        
        //Select which sprites to show based on the score
        if(scoreLeft<=bcrap) {var leftEval = this.game.add.sprite(posXleft,-70,'evalCrapLeft');}
        if((scoreLeft>bcrap)&&(scoreLeft<=bbad)) {var leftEval = this.game.add.sprite(posXleft,-70,'evalBadLeft');}
        if((scoreLeft>bbad)&&(scoreLeft<=bok)) {var leftEval = this.game.add.sprite(posXleft,-70,'evalOKLeft');}
        if((scoreLeft>bok)&&(scoreLeft<=bgood)) {var leftEval = this.game.add.sprite(posXleft,-70,'evalGoodLeft');}
        if(scoreLeft>bgood) {var leftEval = this.game.add.sprite(posXleft,-70,'evalExcellentLeft');}
        
        leftEval.anchor.setTo(0.5,0.5);
        
        var leftEvalTween = this.game.add.tween(leftEval).to({y:this.game.world.height-100},1000,Phaser.Easing.Elastic.Out,true,1000);
        
        leftEvalTween.start();
        
        if(gametype=='dual') {
            if(scoreRight<=bcrap) {var rightEval = this.game.add.sprite(posXright,-70,'evalCrapRight');}
            if((scoreRight>bcrap)&&(scoreRight<=bbad)) {var rightEval = this.game.add.sprite(posXright,-70,'evalBadRight');}
            if((scoreRight>bbad)&&(scoreRight<=bok)) {var rightEval = this.game.add.sprite(posXright,-70,'evalOKRight');}
            if((scoreRight>bok)&&(scoreRight<=bgood)) {var rightEval = this.game.add.sprite(posXright,-70,'evalGoodRight');}
            if(scoreRight>bgood) {var rightEval = this.game.add.sprite(posXright,-70,'evalExcellentRight');}

            rightEval.anchor.setTo(0.5,0.5);

            var leftRightTween = this.game.add.tween(rightEval).to({y:this.game.world.height-100},1000,Phaser.Easing.Elastic.Out,true,1000);

            leftRightTween.start();
        }
        
        
    },
    
    endgame: function(){
        this.game.state.start("HighScore");
    },
        
	terminate: function(){
		this.game.state.start("GameTitle");
	},
}
