var preload = function(game){}

preload.prototype = {
	preload: function(){ 
        //A loading bar to appear during the preload phase before the splash screen
        var loadingBar = this.add.sprite(160,240,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        // lng = "fr"
        lng = "pt"
        this.load.setPreloadSprite(loadingBar);
        
        //Load graphics - Title screen
		this.game.load.image("gametitle","assets/startsplash_" + lng + ".png"); //Startup splash screen
        this.game.load.image("singleselect","assets/singleplayer_select_" + lng + ".png"); //Menu item for single player
        this.game.load.image("dualselect","assets/dualplayer_select_" + lng + ".png"); //Menu item for dual player
        this.game.load.image("banana","assets/banana.png"); //A banana...
        //this.game.load.image("play","assets/play.png"); 
        
        //Load graphics - in game
        this.game.load.spritesheet("monkey","assets/monkey_spritesheet83x75.png",83,75); //Monkey animation.
        this.game.load.spritesheet("numSheet","assets//number0-9black_spritesheet25x26.png",25,26); //Generated numbers
        this.game.load.image("sky","assets/sky.png");
        this.game.load.image("scroll","assets/paper_scroll.png");
        this.game.load.image("numbersTile","assets/numbers_tile.png");
        this.game.load.image("meter","assets/meter.png");
        this.game.load.image("indicator","assets/indicator.png");
        this.game.load.image("bitsupMsg","assets/outofdigits_" + lng + ".png");
        this.game.load.image("guessedMsg","assets/guessed_" + lng + ".png");
        this.game.load.image("anykeyMsg","assets/anykey_" + lng + ".png");
        
        //Load graphics - scoreboard
        //this.game.load.image("gameover","assets/gameover.png"); //Game over title
        this.game.load.image("scoretitle","assets/score_title_" + lng + ".png");
        this.game.load.image("playerone","assets/score_playerone_" + lng + ".png");
        this.game.load.image("playertwo","assets/score_playertwo_" + lng + ".png");
        this.game.load.image("computer","assets/score_computer_" + lng + ".png");
        this.game.load.image("guessedOne","assets/score_guessed_left_" + lng + ".png");
        this.game.load.image("guessedTwo","assets/score_guessed_right_" + lng + ".png");
        this.game.load.image("indepOne","assets/score_indep_left_" + lng + ".png");
        this.game.load.image("indepTwo","assets/score_indep_right_" + lng + ".png");
        this.game.load.image("rateOne","assets/score_rate_left_" + lng + ".png");
        this.game.load.image("rateTwo","assets/score_rate_right_" + lng + ".png");
        this.game.load.image("totalOne","assets/score_total_left_" + lng + ".png");
        this.game.load.image("totalTwo","assets/score_total_right_" + lng + ".png");
        this.game.load.image("evalCrapLeft","assets/eval_crap_left_" + lng + ".png");
        this.game.load.image("evalCrapRight","assets/eval_crap_right_" + lng + ".png");
        this.game.load.image("evalBadLeft","assets/eval_bad_left_" + lng + ".png");
        this.game.load.image("evalBadRight","assets/eval_bad_right_" + lng + ".png");
        this.game.load.image("evalOKLeft","assets/eval_notbad_left_" + lng + ".png");
        this.game.load.image("evalOKRight","assets/eval_notbad_right_" + lng + ".png");
        this.game.load.image("evalGoodLeft","assets/eval_good_left_" + lng + ".png");
        this.game.load.image("evalGoodRight","assets/eval_good_right_" + lng + ".png");
        this.game.load.image("evalExcellentLeft","assets/eval_excellent.png");
        this.game.load.image("evalExcellentRight","assets/eval_excellent.png");
        
        //Load graphics - highscores
        this.game.load.image("hightitle","assets/highscore_title_" + lng + ".png");
        this.game.load.image("highname","assets/high_name_" + lng + ".png");
        this.game.load.image("highrate","assets/high_rate_" + lng + ".png");
        this.game.load.image("highguess","assets/high_guessed_" + lng + ".png");
        this.game.load.image("highindep","assets/high_indep_" + lng + ".png");
        this.game.load.image("highscore","assets/high_scor_" + lng + ".png");
        
        //Load sounds
        this.game.load.audio("switch","assets/switch.mp3");
        this.game.load.audio("play","assets/play.mp3");
        this.game.load.audio("type1","assets/type1.mp3");
        this.game.load.audio("type2","assets/type2.mp3");
        this.game.load.audio("ding","assets/ding.mp3");
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}