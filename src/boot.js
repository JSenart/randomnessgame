var boot = function(game){
	console.log("%cStarting the randomness game", "color:white; background:red");
};
  
boot.prototype = {
	preload: function(){
        this.game.stage.backgroundColor="#ffffff";
        this.game.load.image("loading","assets/loading.png"); 
	},
  	create: function(){
		this.game.state.start("Preload");
	}
}