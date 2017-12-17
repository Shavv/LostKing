eval(fs.readFileSync('equipment_data.js')+'');
eval(fs.readFileSync('item_data.js')+'');

lostking = new Object;
lostking.player_list = new Array;
lostking.player = function(hnet_object, name){
	this.hnet_object = hnet_object;
	
	this.id = hnet_object.id;
	this.world = -1;
	this.permission = 0;//0 = Regular player, 1 = Moderators, 2 = Developers, 3 = Admin
	this.name = name;
	this.x = 500;
	this.y = 500;
	this.hp = 100;
	this.sp = 100;//Mana bar
	this.shld = 100;
	
	this.inventory = new lostking.inventory(this);
	this.equipment = new lostking.equipment(this);
	lostking.player_list.push(this);
}
lostking.inventory = function(player_object){
	this.player_object = player_object;
	
	this.slot_amount = 30;
	this.slot_list = [];
	var i;
		for(i=0; i<this.slot_amount; i++){
			this.slot_list.push(new lostking.item_slot());
		}
	this.equip = function(i){
		
	}
}
lostking.equipment = function(player_object){
	this.player_object = player_object;
	
	this.slot_amount = 25;
	this.slot_list = [];
	var i;
		for(i=0; i<this.slot_amount; i++){
			this.slot_list.push(new lostking.item_slot());
		}
}
lostking.item_slot = function(){
	this.item_list = [];
}
lostking.item = function(type){
	this.type = type;
}