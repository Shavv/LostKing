//player_com.js
lostking.com = new Object;
lostking.com.inventory = function(player_object){
	this.player_object = player_object;
	
	this.drag = function(origin_index, destination_index){
		var slot_amount = this.player_object.inventory.slot_amount;
		var permission = this.player_object.permission;
			if(permission>0){
				if(origin_index>=0 && origin_index<slot_amount && destination_index>=0 && destination_index<slot_amount){
					console.log("Perform drag");
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
		console.log("lostking.com update inventory");
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
lostking.com.equipment = function(player_object){
	this.player_object = player_object;
	this.update = function(){
		console.log("lostking.com update equipment");
		if(this.player_object.socket!=-1){//Object is no test object
			var i;
				for(i=0; i<this.player_object.equipment.updated_slot_list.length; i++){
					var updated_slot = this.player_object.equipment.updated_slot_list[i]; 
					var message = new hnet.message(45);
					console.log("Send 45");
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