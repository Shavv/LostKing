asantia = new Object;
asantia.player_list = new Array;
asantia.player = function(hnet_object, name){
	this.hnet_object = hnet_object;
	
	this.id = hnet_object.id;
	this.name = name;
	this.x = 500;
	this.y = 500;
	
	asantia.player_list.push(this);
}