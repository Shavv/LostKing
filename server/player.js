eval(fs.readFileSync('equipment_data.js')+'');

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
		var i;//Remove
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
	this.count = function(item){
		var count = 0;
		var i;//Count amount of items with index of item
			for(i=0; i<this.slot_list.length; i++){
				var result_slot = this.slot_list[i];
					if(result_slot.item_list.length>0){
						if(result_slot.item_list[0].blueprint.index==item.blueprint.index){
							count += result_slot.item_list.length;
						}
					}
			}
		return count;
	}
	this.count_empty = function(){
		var count = 0;
		var i;//Counts amount of empty slots
			for(i=0; i<this.slot_list.length; i++){
				var result_slot = this.slot_list[i];
					if(result_slot.item_list.length==0){
						count++;
					}
			}
		return count;
	}
	this.drag = function(origin_slot, destination_slot){
			if(origin_slot.item_list.length>0 && destination_slot.item_list.length>0){//If items are of the same type, the destination stack will be filled to it's maximum
				if(origin_slot.item_list[0].blueprint.index==destination_slot.item_list[0].blueprint.index){
					var max_copy_amount = origin_slot.item_list[0].blueprint.max_stack_size-destination_slot.item_list.length;
					var copy_amount = Math.min(max_copy_amount, origin_slot.item_list.length);

					destination_slot.item_list = destination_slot.item_list.concat(origin_slot.item_list.slice(0, copy_amount));
					origin_slot.item_list.splice(0, copy_amount);
					return true;
				}
			}else if(origin_slot.item_list.length>0){//Poor old swap
				var tmp_list = destination_slot.item_list;//Old item in end_slot list
				destination_slot.item_list = origin_slot.item_list;
				origin_slot.item_list = tmp_list;
				return true;
			}
		return false;
	}
	this.drag_single = function(origin_slot, destination_slot){
			if((destination_slot.item_list.length==0 || origin_slot.item_list[0].blueprint.index==destination_slot.item_list[0].blueprint.index) && origin_slot.item_list.length>0){//New slot is empty
				if(destination_slot.item_list.length<origin_slot.item_list[0].blueprint.max_stack_size){
					destination_slot.item_list.push(origin_slot.item_list[0]);//Add item to destination slot
					origin_slot.item_list.splice(0, 1);
					return true;
				}
			}
		return false;
	}
	this.drop = function(origin_slot){
		if(origin_slot.item_list.length>0){
			if(origin_slot.item_list[0].blueprint.dropable){
				var current_item_list = origin_slot.item_list;
				origin_slot.item_list = [];
					
				return current_item_list;
			}
		}
		return null;
	}
	this.drop_single = function(origin_slot){
		if(origin_slot.item_list.length>0){
			if(origin_slot.item_list[0].blueprint.dropable){
				return origin_slot.item_list.splice(0, 1);
			}
		}
		return null;
	}
	this.use = function(origin_slot){
		if(origin_slot.item_list.length>0){
			var first_item = origin_slot.item_list[0];
			var action_index = first_item.blueprint.action_index;
				if(action_index==item.action.equipable){//Equipment
					this.player_object.equipment.equip(origin_slot);
				}
		}
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
	this.find_empty = function(equipment_slot_index){
		var equipment_slot_list = equipment.slot[equipment_slot_index];
		var first_result = null;
		var i, j;
			for(i=0; i<this.slot_list.length; i++){
				var result_slot = this.slot_list[i];
					for(j=0; j<equipment_slot_list.length; j++){
						var result_slot_index = equipment_slot_list[j];//Slot of the same type
							if(i==result_slot_index){
								if(first_result==null){
									first_result = result_slot;
								}
								if(result_slot.item_list.length==0){
									return result_slot;
								}
							}
					}
			}
		return first_result;
	}
	this.equip = function(inventory_slot){
		if(inventory_slot.item_list.length>0){
			var first_item = inventory_slot.item_list[0];
				if(first_item.blueprint.action_index==item.action.equipable){
					var equipment_slot = this.find_empty(first_item.blueprint.equipment_slot);
						if(equipment_slot!=null){
							if(equipment_slot.item_list.length==0){//When equipment slot is empty
								equipment_slot.item_list.push(inventory_slot.item_list[0]);
								inventory_slot.item_list.splice(0, 1);
								console.log("Equip A");
							}else if(equipment_slot.item_list.length==1){//When equipment slot is full
								if(inventory_slot.item_list.length==1){//Swap
									var tmp_list = equipment_slot.item_list;
									equipment_slot.item_list = inventory_slot.item_list;
									inventory_slot.item_list = tmp_list;
									console.log("Equip B");
								}else{//Try to add object to inventory
									var result = this.player_object.inventory.add(equipment_slot.item_list[0]);
										if(result){
											equipment_slot.item_list = [inventory_slot.item_list[0]];
											inventory_slot.item_list.splice(0, 1);
											console.log("Equip C");
										}
								}
							}
						}
				}
		}
		return false;
	}
}
lostking.item_slot = function(){
	this.item_list = [];
}
lostking.item_default_blueprint = function(index, name, max_stack_size, rarity){
	this.index = index;
	this.name = name;
	this.max_stack_size = max_stack_size;
	this.dropable = false;
	this.action_index = item.action.default;
	this.rarity = rarity;
}
lostking.item_default = function(blueprint){
	this.blueprint = blueprint;
}

lostking.item_equipable_blueprint = function(index, name, max_stack_size, rarity, equipment_slot, durability){
	this.index = index;
	this.name = name;
	this.max_stack_size = max_stack_size;
	this.dropable = false;
	this.action_index = item.action.equipable;
	this.rarity = rarity;
	this.equipment_slot = equipment_slot;
	this.durability = durability;
}
lostking.item_equipable = function(blueprint){
	this.blueprint = blueprint;
}

eval(fs.readFileSync('item_data.js')+'');

henk = new lostking.player(-1, "Henk");
henk.inventory.add(new lostking.item_default(item.blueprint.empty));
henk.inventory.add(new lostking.item_default(item.blueprint.test));
henk.inventory.add(new lostking.item_default(item.blueprint.test));
henk.inventory.add(new lostking.item_default(item.blueprint.test));
henk.inventory.add(new lostking.item_equipable(item.blueprint.sword));
henk.inventory.add(new lostking.item_equipable(item.blueprint.master_sword));
henk.inventory.add(new lostking.item_equipable(item.blueprint.master_sword));
henk.inventory.add(new lostking.item_equipable(item.blueprint.helmet));

console.log(henk.inventory.slot_list);

henk.inventory.use(henk.inventory.slot_list[3]);
henk.inventory.use(henk.inventory.slot_list[5])
console.log(henk.inventory.slot_list);

console.log("Slot:");
console.log(henk.equipment.slot_list[9].item_list[0]);
henk.inventory.use(henk.inventory.slot_list[4]);
console.log("Slot:");
console.log(henk.equipment.slot_list[0].item_list[0]);
console.log(henk.equipment.slot_list[9].item_list[0]);

console.log(henk.inventory.slot_list);

henk.inventory.add(new lostking.item_equipable(item.blueprint.ring_silver));
henk.inventory.add(new lostking.item_equipable(item.blueprint.ring_silver));
henk.inventory.add(new lostking.item_equipable(item.blueprint.ring_gold));

henk.inventory.use(henk.inventory.slot_list[5]);
henk.inventory.use(henk.inventory.slot_list[6]);

console.log("Slot ring:");
console.log(henk.equipment.slot_list[18].item_list[0]);
console.log(henk.equipment.slot_list[19].item_list[0]);

console.log(henk.inventory.slot_list);
henk.inventory.use(henk.inventory.slot_list[7]);
console.log("Slot ring:");
console.log(henk.equipment.slot_list[18].item_list[0]);
console.log(henk.equipment.slot_list[19].item_list[0]);

console.log(henk.inventory.slot_list);
