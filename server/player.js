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
	this.add = function(item){
		var added = false;
		var i;
			for(i=0; i<this.slot_list.length; i++){//Add item to existing stack
				var result_slot = this.slot_list[i];
					if(result_slot.item_list.length>0){
						if(result_slot.item_list[0].blueprint.index==item.blueprint.index){
							if(result_slot.item_list.length<item.blueprint.max_stack_size){
								result_slot.item_list.push(item);
								added = true;
								break;
							}
						}
					}
			}
			if(!added){
				for(i=0; i<this.slot_list.length; i++){//Add item to existing stack
					var result_slot = this.slot_list[i];
						if(result_slot.item_list.length==0){
							result_slot.item_list.push(item);
							added = true;
							break;
						}
				}
			}
			if(added){
				return true;
			}else{
				return false;
			}
	}
	this.check = function(item, amount){
		var i;//When stack isn't full add it to item of same type
			for(i=0; i<this.slot_list.length; i++){
				var result_slot = this.slot_list[i];
					if(result_slot.item_list.length>0){
						if(result_slot.item_list[0].blueprint.index==item.blueprint.index){
							amount -= result_slot.item_list.length;
						}
					}
			}
			if(amount>0){
				return false;
			}
		return true;
	}
	this.remove = function(item, amount){
		var i, j;//Remove
			for(i=this.slot_list.length-1; i>=0; i--){
				var result_slot = this.slot_list[i];
					if(result_slot.item_list.length>0 && amount>0){
						if(result_slot.item_list[0].blueprint.index==item.blueprint.index){
							var remove_amount = Math.min(amount, result_slot.item_list.length);
							amount -= remove_amount;

							result_slot.item_list.splice(0, remove_amount);
						}
					}
			}
	}
	this.equip = function(slot_index){
		
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
lostking.item_default_blueprint = function(index, name, max_stack_size, rarity){
	this.index = index;
	this.name = name;
	this.max_stack_size = max_stack_size;
	this.action_index = 0;
	this.rarity = rarity;
}
lostking.item_default = function(blueprint){
	this.blueprint = blueprint;
}