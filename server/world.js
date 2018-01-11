lostking.world_list = [];
lostking.find_world = function(name){
	var i;
		for(i=0; i<lostking.world_list.length; i++){
			var result_world = lostking.world_list[i];
				if(result_world.name==name){
					return result_world;
				}
		}
	return null;
}
lostking.world = function(name, chunk_w, chunk_h){
	this.name = name;
	this.chunk_grid = [];
	var i, j;
		for(i=0; i<chunk_w; i++){
			this.chunk_grid[i] = [];
				for(j=0; j<chunk_h; j++){
					this.chunk_grid[i][j] = new lostking.chunk(i, j);
				}
		}
	lostking.world_list.push(this);
}
lostking.chunk_size = 16;
lostking.chunk = function(x, y){
	this.x = x;
	this.y = y;
	this.foliage_grid = [];
	var i, j;
		for(i=0; i<lostking.chunk_size; i++){
			this.foliage_grid[i] = [];
				for(j=0; j<lostking.chunk_size; j++){
					this.foliage_grid[i][j] = new lostking.foliage(this, i, j);
				}
		}
}
lostking.foliage = function(chunk, x, y){
	this.chunk = chunk;
	this.x = x;
	this.y = y;
	this.owner = -1;
}
new lostking.world("Overworld", 4, 4);
new lostking.world("Xp6", 3, 5);
console.log(lostking.world_list[0].chunk_grid);