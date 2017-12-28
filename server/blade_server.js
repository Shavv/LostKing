//blade_server.js
var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(blade){
	var blade_connected = false;
	blade.on("init", function(key){
		if(key=="q5gx6zNCN9kVMyLH"){
			blade_connected = true;
			console.log("Blade connected!!!");
		}
	});
	blade.on("u_item_default", function(index, name, max_stack_size, rarity, dropable){
		console.log(index+" "+name+" "+max_stack_size);
		item.blueprint.list.push(new lostking.item_default_blueprint(index, name, max_stack_size, rarity));
		console.log(item.blueprint.list);
	});
	blade.on("u_item_equipable", function(index, name, max_stack_size, rarity, dropable, equipment_slot, durability){
		console.log(index+" "+name+" "+max_stack_size+" "+equipment_slot);
		
		item.blueprint.list.push(new lostking.item_equipable_blueprint(index, name, max_stack_size, rarity, equipment_slot, durability));
		console.log(item.blueprint.list);
	});
	blade.on('disconnect', function(){
		
	});
});

server.listen(3000);