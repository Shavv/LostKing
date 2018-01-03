//item_parser.js
ip = new Object;
ip.ignore_comments = function(input){
	var line_comment = false;
	var block_comment = false;
	var output = "";
	var i;
		for(i=0; i<input.length; i++){
			var result = input.substring(i, i+2);
				if(line_comment){
					if(input[i]=="\r"){
						line_comment = false;
						output += input[i];
					}
				}else if(block_comment){
					if(result=="*/"){
						block_comment = false;
						i++;
					}
				}else{
					if(result=="//"){
						line_comment = true;
						i++;
					}else if(result=="/*"){
						block_comment = true;
						i++;
					}else{
						output += input[i];
					}
				}
		}
	return output;
}
ip.escape_variables = function(input){
	var output = [];
	var step = 0;
	var variable_name = "";
	var variable_value = "";
	var i;
		for(i=0; i<input.length; i++){
			var character = input[i];
				if(character=="="){
					step = 1;
				}else if(character=="\r" || character==";"){
						if(variable_name!="" && variable_name!=""){
							output.push({name:variable_name.replace(/ /g, ""), value:variable_value.replace(/ /g, "").replace(/'/g, "").replace(/"/g, "")});
						}
					variable_name = "";
					variable_value = "";
					step = 0;
						if(input[i+1]=="\n"){
							i++;
						}
						if(input[i+1]=="\r"){
							i += 2;
						}
				}else{
					if(step==0){
						variable_name += character;
					}else if(step==1){
						variable_value += character;
					}
				}
		}
	return output;
}
ip.find_value = function(input, name){
	var i;
		for(i=0; i<input.length; i++){
			var result = input[i];
				if(result.name==name){
					return result.value;
				}
		}
	return null;
}
ip.find_index = function(input){
	var a = input.substring(5);
	var b = a.indexOf("_");
	var c = a.indexOf(".");
		if(b!=-1){
			return a.substring(0, b);
		}else{
			return a.substring(0, c);
		}
}
ip.communicate = new Object;
ip.communicate.default = function(socket, index, variable_struct){
	console.log("Default: "+index);
	var name = ip.find_value(variable_struct, "name");
	var max_stack_size = ip.find_value(variable_struct, "max_stack_size");
	var rarity = ip.find_value(variable_struct, "rarity");
	var dropable = ip.find_value(variable_struct, "dropable");

	socket.emit("u_item_default", index, name, max_stack_size, rarity, dropable);
}
ip.communicate.equipment = function(socket, index, variable_struct){
	console.log("Equipment: "+index);
	var name = ip.find_value(variable_struct, "name");
	var max_stack_size = ip.find_value(variable_struct, "max_stack_size");
	var rarity = ip.find_value(variable_struct, "rarity");
	var dropable = ip.find_value(variable_struct, "dropable");
	var equipment_slot = ip.slot.find_value(ip.find_value(variable_struct, "equipment_slot"));
	var durability = ip.find_value(variable_struct, "durability");

	socket.emit("u_item_equipable", index, name, max_stack_size, rarity, dropable, equipment_slot, durability);
}
ip.communicate.consumable = function(socket, index, variable_struct){
	console.log("Consumable: "+index);
}
ip.action = new Object;
ip.action.list = new Array;
ip.action.list.push({name:"t_default", callback:ip.communicate.default});
ip.action.list.push({name:"t_equipable", callback:ip.communicate.equipment});
ip.action.list.push({name:"t_consumable", callback:ip.communicate.consumable});
ip.action.find_callback = function(name){
	var i;
		for(i=0; i<ip.action.list.length; i++){
			var result = ip.action.list[i];
				if(result.name==name){
					return result.callback;
				}
		}
	return null;
}
ip.slot = new Object;
ip.slot.list = new Array;
ip.slot.list.push({name:"q_helmet", value:0});
ip.slot.list.push({name:"q_chest", value:1});
ip.slot.list.push({name:"q_shoulders", value:2});
ip.slot.list.push({name:"q_back", value:3});
ip.slot.list.push({name:"q_hands", value:4});
ip.slot.list.push({name:"q_vambraces", value:5});
ip.slot.list.push({name:"q_belt", value:6});
ip.slot.list.push({name:"q_pants", value:7});
ip.slot.list.push({name:"q_boots", value:8});
ip.slot.list.push({name:"q_mainhand", value:9});
ip.slot.list.push({name:"q_offhand", value:10});
ip.slot.list.push({name:"q_utility", value:11});
ip.slot.list.push({name:"q_tradepack", value:12});
ip.slot.list.push({name:"q_lantern", value:13});
ip.slot.list.push({name:"q_relic", value:14});
ip.slot.list.push({name:"q_necklace", value:15});
ip.slot.list.push({name:"q_earring", value:16});
ip.slot.list.push({name:"q_ring", value:18});
ip.slot.list.push({name:"q_lynx_default", value:20});
ip.slot.list.push({name:"q_lynx_passive", value:23});
ip.slot.list.push({name:"q_lynx_ultimate", value:24});
ip.slot.find_value = function(name){
	var i;
		for(i=0; i<ip.slot.list.length; i++){
			var result = ip.slot.list[i];
				if(result.name==name){
					return result.value;
				}
		}
	return null;
}