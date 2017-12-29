eval(fs.readFileSync('equipment_data.js')+'');

lostking = new Object;
lostking.player_list = new Array;
lostking.player = function(socket, name){
	this.socket = socket;
	
	this.id = socket.id;
	this.world = -1;
	this.permission = 1;//0 = Not signed in, 1 = Regular player, 2 = Moderators, 3 = Developers, 4 = Admin
	this.name = name;
	this.x = 500;
	this.y = 500;
	this.hp = 100;
	this.sp = 100;//Mana bar
	this.shld = 100;
	
	this.inventory = new lostking.inventory(this);
	this.equipment = new lostking.equipment(this);
	
	this.com = new Object;
	this.com.inventory = new lostking.com.inventory(this);
	
	this.inventory.com = this.com;
	
	//Place for defining
	this.inventory.add(new lostking.item_default(item.blueprint.list[1]));
	this.inventory.add(new lostking.item_default(item.blueprint.list[1]));
	this.inventory.add(new lostking.item_equipable(item.blueprint.list[2]));
	this.inventory.add(new lostking.item_equipable(item.blueprint.list[2]));
	lostking.player_list.push(this);
}
lostking.com = new Object;
lostking.com.inventory = function(player_object){
	this.player_object = player_object;
	
	this.drag = function(origin_index, destination_index){
		var slot_amount = this.player_object.inventory.slot_amount;
		var permission = this.player_object.permission;
			if(permission>0){
				if(origin_index>=0 && origin_index<slot_amount && destination_index>=0 && destination_index<slot_amount){
					return this.player_object.inventory.drag(this.player_object.inventory.slot_list[origin_index], this.player_object.inventory.slot_list[destination_index]);
				}else{
					console.log("lostking.com error: drag out of bounds");
				}
			}else{
				console.log("lostking.com error: drag permission denied");
			}
		return false;
	}
	this.drag_single = function(origin_index, destination_index){
		var slot_amount = this.player_object.inventory.slot_amount;
		var permission = this.player_object.permission;
			if(permission>0){
				if(origin_index>=0 && origin_index<slot_amount && destination_index>=0 && destination_index<slot_amount){
					return this.player_object.inventory.drag_single(this.player_object.inventory.slot_list[origin_index], this.player_object.inventory.slot_list[destination_index]);
				}else{
					console.log("lostking.com error: drag_single out of bounds");
				}
			}else{
				console.log("lostking.com error: drag_single permission denied");
			}
		return false;
	}
	this.use = function(origin_index){
		var slot_amount = this.player_object.inventory.slot_amount;
		var permission = this.player_object.permission;
			if(permission>0){
				if(origin_index>=0 && origin_index<slot_amount){
					this.player_object.inventory.use(this.player_object.inventory.slot_list[origin_index]);
					return true;
				}else{
					console.log("lostking.com error: use out of bounds");
				}
			}else{
				console.log("lostking.com error: use permission denied");
			}
		return false;
	}
	this.update = function(){
		console.log("lostking.com update");
		if(this.player_object.socket!=-1){//Object is no test object
			var i;
				for(i=0; i<this.player_object.inventory.updated_slot_list.length; i++){
					var updated_slot = this.player_object.inventory.updated_slot_list[i]; 
					var message = new hnet.message(40);
					console.log("Send 40");
					var length = updated_slot.item_list.length;
					message.write_byte(updated_slot.index);
						if(length>0){
							message.write_byte(updated_slot.item_list[0].blueprint.index);
						}else{
							message.write_byte(0);
						}
					message.write_byte16(length);
					message.send(this.player_object.socket);
				}
		}
	}
}
lostking.inventory = function(player_object){
	this.player_object = player_object;
	this.com = undefined;//Has to be set later

	this.slot_amount = 30;
	this.slot_list = [];
	this.updated_slot_list = [];
	var i;
		for(i=0; i<this.slot_amount; i++){
			this.slot_list.push(new lostking.item_slot(i));
		}
	this.update = function(slot){
		var i;
			for(i=0; i<this.updated_slot_list.length; i++){
				var updated_slot = this.updated_slot_list[i]; 
					if(updated_slot.index==slot.index){
						return false;
					}
			}
		this.updated_slot_list.push(slot);
		return true;
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
								this.update(result_slot);
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
							this.update(result_slot);
							added = true;
							break;
						}
				}
			}
			if(added){
				this.com.inventory.update();
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
							this.update(result_slot);
						}
					}
			}
		this.com.inventory.update();
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
					this.update(origin_slot);
					this.update(destination_slot);
					this.com.inventory.update();
					return true;
				}
			}else if(origin_slot.item_list.length>0){//Poor old swap
				var tmp_list = destination_slot.item_list;//Old item in end_slot list
				destination_slot.item_list = origin_slot.item_list;
				origin_slot.item_list = tmp_list;
				this.update(origin_slot);
				this.update(destination_slot);
				this.com.inventory.update();
				return true;
			}
		return false;
	}
	this.drag_single = function(origin_slot, destination_slot){
			if((destination_slot.item_list.length==0 || origin_slot.item_list[0].blueprint.index==destination_slot.item_list[0].blueprint.index) && origin_slot.item_list.length>0){//New slot is empty
				if(destination_slot.item_list.length<origin_slot.item_list[0].blueprint.max_stack_size){
					destination_slot.item_list.push(origin_slot.item_list[0]);//Add item to destination slot
					origin_slot.item_list.splice(0, 1);
					this.update(origin_slot);
					this.update(destination_slot);
					this.com.inventory.update();
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
				this.update(origin_slot);
				this.com.inventory.update();
				return current_item_list;
			}
		}
		return null;
	}
	this.drop_single = function(origin_slot){
		if(origin_slot.item_list.length>0){
			if(origin_slot.item_list[0].blueprint.dropable){
				this.update(origin_slot);
				this.com.inventory.update();
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
			this.slot_list.push(new lostking.item_slot(i));
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
	this.check_if_item_fits_in_slot = function(item, equipment_slot){
		var equipment_slot_list = equipment.slot[item.blueprint.equipment_slot];
		var i;
			for(i=0; i<equipment_slot_list.length; i++){
				var result_slot_index = equipment_slot_list[i];//Slot of the same type
					if(result_slot_index==equipment_slot.index){
						return true;
					}
			}
		return false;
	}
	this.equip = function(inventory_slot){
		if(inventory_slot.item_list.length>0){
			var first_item = inventory_slot.item_list[0];
			var equipment_slot = this.find_empty(first_item.blueprint.equipment_slot);
				if(equipment_slot!=null){
					this.drag_from_inventory(equipment_slot, inventory_slot);
				}
		}
		return false;
	}
	this.dequip = function(equipment_slot){
		if(equipment_slot.item_list.length>0){
			var result = this.player_object.inventory.add(equipment_slot.item_list[0]);
				if(result){
					equipment_slot.item_list = [];
				}
		}
		return false;
	}
	this.drag_to_inventory = function(equipment_slot, inventory_slot){
		if(equipment_slot.item_list.length>0){
			if(inventory_slot.item_list.length==0){//Drag to empty slot
				inventory_slot.item_list = equipment_slot.item_list;
				equipment_slot.item_list = [];
				this.player_object.inventory.update(inventory_slot);
				return true;
			}else{
				var first_item = inventory_slot.item_list[0];
					if(first_item.blueprint.index==equipment_slot.item_list[0].blueprint.index){//Add to existing stack
						if(equipment_slot.item_list.length<inventory_slot.item_list[0].blueprint.max_stack_size){
							inventory_slot.item_list.push(equipment_slot.item_list[0]);
							equipment_slot.item_list.splice(0, 1);
							this.player_object.inventory.update(inventory_slot);
							return true;
						}
					}else if(first_item.blueprint.action_index==item.action.equipable){//Swap
						var tmp_list = inventory_slot.item_list;
						inventory_slot.item_list = equipment_slot.item_list;
						equipment_slot.item_list = tmp_list;
						this.player_object.inventory.update(inventory_slot);
						return true;
					}
			}
		}
		return false;
	}
	this.drag_from_inventory = function(equipment_slot, inventory_slot){
			if(inventory_slot.item_list.length>0){
				var first_item = inventory_slot.item_list[0];
					if(first_item.blueprint.action_index==item.action.equipable && this.check_if_item_fits_in_slot(first_item, equipment_slot)){
						if(equipment_slot.item_list.length==0){//When equipment slot is empty
							equipment_slot.item_list.push(inventory_slot.item_list[0]);
							inventory_slot.item_list.splice(0, 1);
							this.player_object.inventory.update(inventory_slot);
							return true;
						}else if(equipment_slot.item_list.length==1){//When equipment slot is full
							if(inventory_slot.item_list.length==1){//Swap
								var tmp_list = equipment_slot.item_list;
								equipment_slot.item_list = inventory_slot.item_list;
								inventory_slot.item_list = tmp_list;
								this.player_object.inventory.update(inventory_slot);
								return true;
							}else{//Try to add object to inventory
								var result = this.player_object.inventory.add(equipment_slot.item_list[0]);
									if(result){
										equipment_slot.item_list = [inventory_slot.item_list[0]];
										inventory_slot.item_list.splice(0, 1);
										this.player_object.inventory.update(inventory_slot);
										return true;
									}
							}
						}
					}
			}
		return false;
	}
}
lostking.item_slot = function(index){
	this.index = index;
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

/*henk = new lostking.player(-1, "Henk");
henk.inventory.add(new lostking.item_default(item.blueprint.empty));
henk.inventory.add(new lostking.item_default(item.blueprint.test));
henk.inventory.add(new lostking.item_default(item.blueprint.test));
henk.inventory.add(new lostking.item_default(item.blueprint.test));
henk.inventory.add(new lostking.item_equipable(item.blueprint.sword));
henk.inventory.add(new lostking.item_equipable(item.blueprint.master_sword));
henk.inventory.add(new lostking.item_equipable(item.blueprint.master_sword));
henk.inventory.add(new lostking.item_equipable(item.blueprint.helmet));

console.log(henk.inventory.slot_list);

console.log(henk.equipment.drag_from_inventory(henk.equipment.slot_list[9], henk.inventory.slot_list[3]));
console.log(henk.equipment.drag_from_inventory(henk.equipment.slot_list[9], henk.inventory.slot_list[4]));

console.log(henk.inventory.slot_list);
console.log(henk.equipment.slot_list[9].item_list[0]);

henk.com.inventory.drag(0, 29);
console.log(henk.inventory.slot_list);

console.log("Updated");
console.log(henk.inventory.updated_slot_list);*/
/*console.log(henk.equipment.drag_to_inventory(henk.equipment.slot_list[9], henk.inventory.slot_list[4]));
console.log(henk.inventory.slot_list);
console.log(henk.equipment.slot_list[9].item_list[0]);*/