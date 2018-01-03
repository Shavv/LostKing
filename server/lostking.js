var fs = require('fs');
var net = require('net');

eval(fs.readFileSync('sources/network.js')+'');
console.log("Load: network.js");

eval(fs.readFileSync('blade_server.js')+'');
eval(fs.readFileSync('profile.js')+'');
eval(fs.readFileSync('player.js')+'');

loginserver_socket_object = function(){
	this.onconnect = function(object){
		console.log("New connection");
	}
	this.ondisconnect = function(object){
		console.log("Lost connection");
		//Player logs out
		var message = new hnet.message(8);
		message.write_byte16(object.player_object.id);
		message.write_byte(0);
		message.send_other(object);
		
		lostking.player_list.splice(lostking.player_list.indexOf(object.player_object), 1);
	}
	this.receive = function(object, package_id, buffer){
		switch(package_id){
			case 6://Creates player object with name
				var name = buffer.read();
				var player = new lostking.player(object, name);
				object.player_object = player;

				//Sends new player other to existing players
				var message = new hnet.message(7);
				message.write_byte16(player.id);
				message.write_string(player.name);
				message.write_byte16(player.x);
				message.write_byte16(player.y);
				message.send_other(object);
				
				//Sends new player the other object of existing players
				var i;
					for(i=0; i<lostking.player_list.length; i++){
						var other_player = lostking.player_list[i];
							if(other_player.id != player.id){//Don't send the new player this own other object
								var message = new hnet.message(7);
								message.write_byte16(other_player.id);
								message.write_string(other_player.name);
								message.write_byte16(other_player.x);
								message.write_byte16(other_player.y);
								message.send(object);
							}
					}
			break;
			case 9://Update x and y positions from players by id
				var id = buffer.read();
				var new_x = buffer.read();
				var new_y = buffer.read();
				var player_angle = buffer.read();
				var image_xscale = buffer.read();
				var image_yscale = buffer.read();
				var image_index = buffer.read();
				var hp = buffer.read();

				//Updates player object positions
				var player = object.player_object;
				player.x = new_x;
				player.y = new_y;
				player.player_angle = player_angle;
				player.image_xscale = image_xscale;
				player.image_yscale = image_yscale;
				player.image_index = image_index;
				player.hp = hp;
				
				//Send position to other players
				var message = new hnet.message(9);
				message.write_byte16(player.id);
				message.write_byte16(player.x);
				message.write_byte16(player.y);
				message.write_byte(player.player_angle);
				message.write_byte(player.image_xscale);
				message.write_byte(player.image_yscale);
				message.write_byte16(player.image_index);
				message.write_byte16(player.hp);
				
				message.send_other(object);
			break;
			case 30://Drag item inventory
				var player = object.player_object;
				var origin_index = buffer.read();
				var destination_index = buffer.read();
				
				player.com.inventory.drag(origin_index, destination_index);
			break;
			case 31://Drag single item inventory
				var player = object.player_object;
				var origin_index = buffer.read();
				var destination_index = buffer.read();
				
				player.com.inventory.drag_single(origin_index, destination_index);
			break;
			case 32://Drag item from inventory to equipment
				var player = object.player_object;
				var equipment_slot_index = buffer.read();
				var inventory_slot_index = buffer.read();
				console.log("Drag from:"+equipment_slot_index+" "+inventory_slot_index);
				player.com.equipment.drag_from_inventory(equipment_slot_index, inventory_slot_index);
			break;
			case 33://Drag item from equipment to inventory
				var player = object.player_object;
				var equipment_slot_index = buffer.read();
				var inventory_slot_index = buffer.read();
				
				player.com.equipment.drag_to_inventory(equipment_slot_index, inventory_slot_index);
			break;
			case 34://Drag item equipment
				var player = object.player_object;
				var origin_index = buffer.read();
				var destination_index = buffer.read();
				
				player.com.equipment.drag(origin_index, destination_index);
			break;
			case 36://Use item
				var player = object.player_object;
				var slot_index = buffer.read();

				player.com.inventory.use(slot_index);
			break;
			case 37://Dequip item
				var player = object.player_object;
				var slot_index = buffer.read();
				console.log("Dequip: "+slot_index);
				
				player.com.equipment.dequip(slot_index);
			break;
		}
	}
}

hnet.create_server(8033, loginserver_socket_object);

//Commands
/*process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", function(input){
	var data = input.replace("\n", "").replace("\r", "").split(" ");
		switch(data[0]){
			case "test":
			break;
			case "destroy":
				n2nnode.object.broadcast(new Array(41, 1010));
			break;
			case "move":
				n2nnode.object.broadcast(new Array(42, 1010, 0, -2.3, 0));
			break;
		}
});*/