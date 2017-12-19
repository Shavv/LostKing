eval(fs.readFileSync('sources/securedata.js')+'');
console.log("Load: securedata.js");

hnet = new Object;
hnet.count_array = function(input){
	var i, output;
	output = 0;
		for(i=0; i<input.length; i+=1){
				if(i!=0){
					output+=1;
				}
			if(typeof input[i] == "string"){
				output += input[i].length;
			}else{
				output += JSON.stringify(input[i]).length;
			}
		}
	return output;
}
/*hnet.create_buffer = function(input){
	var buffer, i, pos;
	buffer = new Buffer(hnet.count_array(input)+1);
	pos = 0;
		for(i=0; i<input.length; i+=1){
				if(i!=0){
					buffer.writeUInt8(0x00, pos);
					pos += 1;
				}
			if(typeof input[i] == "string"){
				pos += buffer.write(input[i], pos, "utf-8");
			}else{
				pos += buffer.write(JSON.stringify(input[i]), pos, "utf-8");
			}
		}
	
	buffer.writeUInt8(0x00, pos);
	
	return buffer;
}*/
hnet.create_buffer = function(input){
	var total_length = input.length;
	
	var buffer = new Buffer(total_length);
	input.copy(buffer);
	return buffer;
}
hnet.create_array = function(input){
	var array, i;
	array = new Array;
	array[0] = "";
		for(i=0; i<input.length; i+=1){
			if(input.readUInt8(i)==0x00){
				if(i!=input.length-1){
					array.push("");
				}		
			}else{
				array[array.length-1] += String.fromCharCode(input.readUInt8(i));
			}
		}
	
	array2 = new Array;
		for(j=0; j<array.length; j++){
			if(array[j]!=""){
				array2.push(array[j]);
			}
		}
	return array2;
}
h_byte = 1;
h_byte16 = 2;
h_string = -1;
hnet_profile_list = new Array;
hnet.profile = function (t_id, t_list, t_condition, list_a, list_b){
	if(typeof t_condition === 'undefined'){t_condition = -1;}
	if(typeof list_a === 'undefined'){list_a = new Array;}
	if(typeof list_b === 'undefined'){list_b = new Array;}
	
	this.id = t_id;
    this.list = t_list;
    this.branch_condition = t_condition;
    this.branch_a = list_a;
    this.branch_b = list_b;
	
	hnet_profile_list[t_id] = this;
}
hnet.message = function(t_id){
	this.id = t_id;
	this.list = new Array;
	this.list.push(this.id);
	
	this.write_string = function(input){
		if(input.length<Math.pow(2, 8)){
			this.list.push(input.length);
			var i;
				for(i=0; i<input.length; i++){
					this.list.push(input.charCodeAt(i));
				}
		}
	}
	this.write_byte = function(input){
		var decimal = (input != Math.floor(input));
			if(input>=-Math.pow(2, 8)/2 && input<Math.pow(2, 8)/2 && !decimal){
				this.list.push(input+Math.pow(2, 8)/2);
			}else{
				this.list.push(0);
				console.log("Error Int8 out of bounds!!!"+input+"/"+(Math.pow(2, 8)/2));
			}
	}
	this.write_byte16 = function(input){
		var decimal = (input != Math.floor(input));
			if(input>=-Math.pow(2, 16)/2 && input<Math.pow(2, 16)/2 && !decimal){
				var value = input+Math.pow(2, 16)/2;
				
				this.list.push(Math.floor(value/256));
				this.list.push(value % 256);
			}else{
				this.list.push(0);
				this.list.push(0);
				console.log("Error Int16 out of bounds!!! "+input+"/"+(Math.pow(2, 16)/2));
			}
	}
	this.send = function(object){
		//console.log(this.list);
		object.socket.write(new Buffer(this.list));
	}
	this.send_other = function(object){
		var i;
			for(i=0; i<hnet.client_array.length; i++){
				var other_object = hnet.client_array[i];
				if(other_object.id!=object.id){
					other_object.socket.write(new Buffer(this.list));
				}
			}
	}
	this.broadcast = function(object){
		var i;
			for(i=0; i<hnet.client_array.length; i++){
				var other_object = hnet.client_array[i];
				other_object.socket.write(new Buffer(this.list));
			}
	}
}
hnet.convert_to_binary = function(input){
		if(input.length<Math.pow(2, 16)){//Low capacity Buffer
			var buffer = new Buffer(input.length+3);
			var array_buffer = new Buffer(input);
			array_buffer.copy(buffer, 3);
			buffer[0] = 0x01;
	
			var value = input.length;
			buffer[1] = Math.floor(value/256);
			buffer[2] = value % 256;

			return buffer;
		}else if(input.length<=100000000){//High capacity buffer (100 MB currently)
			var buffer = new Buffer(input.length+5);
			var array_buffer = new Buffer(input);
			array_buffer.copy(buffer, 5);
			buffer[0] = 0x02;
			
			var value = input.length;
			var first = Math.floor(value/Math.pow(2, 16));
			var second = value % Math.pow(2, 16);
			
			buffer[1] = Math.floor(first/256);
			buffer[2] = first % 256;
			buffer[3] = Math.floor(second/256);
			buffer[4] = second % 256;
			
			return buffer;
		}else{
			console.log("Buffer to big maxium 100 MB");
		}
}
hnet.convert_from_binary = function(buffer){
	switch(buffer[0]){
		case 0x01:
			var binary_buffer = new Buffer(buffer.length-3);
			buffer.copy(binary_buffer, 0, 3);
			return binary_buffer;
		break;
		case 0x02:
			var binary_buffer = new Buffer(buffer.length-5);
			buffer.copy(binary_buffer, 0, 5);
			return binary_buffer;
		break;
	}
	
}
hnet.convert_to_string = function(input){
	if(input.length<Math.pow(2,16)){
		var buffer = new Buffer(input.length+3);
		var string_buffer = new Buffer(input);
		string_buffer.copy(buffer, 3);
		buffer[0] = 0x03;
		
		var value = input.length;
		buffer[1] = Math.floor(value/256);
		buffer[2] = value % 256;
		
		return buffer;
	}else{
		console.log("String too long");
	}
}
hnet.convert_from_string = function(buffer){
	return buffer.toString("utf8", 3);
}
hnet.convert_to_float = function (input){
	var buffer = new Buffer(7);
	buffer[0] = 0x08;
	var divider = 0;
		var i;
		for(i=0; i<120; i++){
			if(Math.abs(input)/Math.pow(10, i)>=0 && Math.abs(input)/Math.pow(10, i)<10){
				divider = i;
				break;
			}
		}
	var result = Math.abs(input)/Math.pow(10, divider);
	
	var decimal_point = -1;
	var i;
		for(i=0; i<9; i++){
			if(result*Math.pow(10, i)==Math.floor(result*Math.pow(10, i))){
				decimal_point = i;
				break;
			}
		}
		
	if(decimal_point==-1){
		if(i==9){
			decimal_point = 8;
		}else{
			decimal_point = 0;
		}
	}
	
	var result2 = Math.round(result*Math.pow(10, decimal_point));

	var value = result2;
	var first = Math.floor(value/Math.pow(2, 16));
	var second = value % Math.pow(2, 16);
	
	if(input<0){
		buffer[1] = 0x08;
	}else{
		buffer[1] = 0x09;
	}
	
	buffer[2] = Math.floor(first/256);
	buffer[3] = first % 256;
	buffer[4] = Math.floor(second/256);
	buffer[5] = second % 256;
	buffer[6] = (decimal_point-divider)+128;
	return buffer;
}
hnet.convert_from_float = function(buffer){
var output = 0;
var factor = 1;
switch(buffer[1]){
	case 0x08:
		factor = -1;
	break;
	case 0x09:
		factor = 1;
	break;
}
output += buffer[2] * Math.pow(2, 16) * 256;
output += buffer[3] * Math.pow(2, 16);
output += buffer[4] * 256;
output += buffer[5];

output /= Math.pow(10, buffer[6]-128);
output *= factor;
return output;
}
hnet.convert_to_integer = function(input){
		var decimal = (input != Math.floor(input));
		if(input>=-Math.pow(2, 8)/2 && input<Math.pow(2, 8)/2 && !decimal){//int8
			var buffer = new Buffer(2);
			buffer[0] = 0x04;
			buffer[1] = input+Math.pow(2, 8)/2;
			
			return buffer;
		}else if(input>=-Math.pow(2, 16)/2 && input<Math.pow(2, 16)/2 && !decimal){//int16
			var buffer = new Buffer(3);
			buffer[0] = 0x05;
			
			var value = input+Math.pow(2, 16)/2;
			buffer[1] = Math.floor(value/256);
			buffer[2] = value % 256;

			return buffer;
		}else if(input>=-Math.pow(2, 32)/2 && input<Math.pow(2, 32)/2 && !decimal){//int32
			var buffer = new Buffer(5);
			buffer[0] = 0x06;
			
			var value = input+Math.pow(2, 32)/2;
			var first = Math.floor(value/Math.pow(2, 16));
			var second = value % Math.pow(2, 16);
			
			buffer[1] = Math.floor(first/256);
			buffer[2] = first % 256;
			buffer[3] = Math.floor(second/256);
			buffer[4] = second % 256;

			return buffer;
		}else{
			console.log("OUT of BOUNDS ERROR! Use floats instead")
		}
}
hnet.convert_from_integer = function(buffer){
var output = 0;
	switch(buffer[0]){
		case 0x04://int8
			var value = buffer[1];
			output = value-Math.pow(2, 8)/2;
		break;
		case 0x05://int16
			var value = 0;
			value += buffer[1] * 256;
			value += buffer[2];
			output = value-Math.pow(2, 16)/2;
		break;
		case 0x06://int32
			var value = 0;
			value += buffer[1] * Math.pow(2, 16) * 256;
			value += buffer[2] * Math.pow(2, 16);
			value += buffer[3] * 256;
			value += buffer[4];
			output = value-Math.pow(2, 32)/2;
		break;
	}
return output;
}
hnet.convert_to_json = function(input){
	var stringified = JSON.stringify(input);
	var start = stringified.substring(1, stringified.length-1);
	if(start.length<Math.pow(2,16)){
		var buffer = new Buffer(start.length+3);
		var string_buffer = new Buffer(start);
		string_buffer.copy(buffer, 3);
		buffer[0] = 0x0a;
		
		var value = start.length;
		buffer[1] = Math.floor(value/256);
		buffer[2] = value % 256;
		
		return buffer;
	}else{
		console.log("JSON String too long");
	}
}
hnet.convert_from_json = function(buffer){
	var start = buffer.toString("utf8", 3);

	return JSON.parse("{"+start+"}");
}
hnet.convert_to_aqs = function(input){
	var start = aqs.parser.encode(input, input.list, true, true);
	if(start.length<Math.pow(2,16)){
		var buffer = new Buffer(start.length+3);
		var string_buffer = new Buffer(start);
		string_buffer.copy(buffer, 3);
		buffer[0] = 0x0b;
		
		var value = start.length;
		buffer[1] = Math.floor(value/256);
		buffer[2] = value % 256;
		
		return buffer;
	}else{
		console.log("AQS message too long");
	}
}
hnet.convert_to_aqs_extended = function(input, list, results, vars){
	var start = aqs.parser.encode(input, list, results, vars);
	if(start.length<Math.pow(2,16)){
		var buffer = new Buffer(start.length+3);
		var string_buffer = new Buffer(start);
		string_buffer.copy(buffer, 3);
		buffer[0] = 0x0b;
		
		var value = start.length;
		buffer[1] = Math.floor(value/256);
		buffer[2] = value % 256;
		
		return buffer;
	}else{
		console.log("AQS message too long");
	}
}
hnet.convert_from_aqs = function(buffer){
	var start = buffer.toString("utf8", 3);
	return aqs.parser.decode(start);
}
hnet.create_random_key = function(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i <length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
hnet.convert_array_to_buffer_array = function(array){
	var buffer_array = new Array;
	var i;
		for(i=0; i<array.length; i++){
			switch(typeof array[i]){
				case "number":
					var decimal = (array[i] != Math.floor(array[i]));
						if(array[i]>=-Math.pow(2, 32)/2 && array[i]<Math.pow(2, 32)/2 && !decimal){
							buffer_array.push(hnet.convert_to_integer(array[i]));
						}else{
							buffer_array.push(hnet.convert_to_float(array[i]));
						}
				break;
				case "string":
					buffer_array.push(hnet.convert_to_string(array[i]));
				break;
				case "boolean":
					if(array[i]){
						buffer_array.push(hnet.convert_to_integer(1));
					}else{
						buffer_array.push(hnet.convert_to_integer(0));
					}
				break;
				/*case "object":
					if(array[i].uoi=="AQS"){
						console.log("AQS Message");
						buffer_array.push(hnet.convert_to_aqs(array[i]));
					}else{
						buffer_array.push(hnet.convert_to_json(array[i]));
					}
				break;*/
			}
		}
	return buffer_array;
}
hnet.create_readable_object = function(buffer){
	var object = new Object;
	object.buffer = buffer;
	object.position = 0;
	object.read = function(){
		if(object.position<object.buffer.length){
			object.position++;
			return object.buffer[object.position-1];
		}else{
			console.log("Error! read outoff message size");
			return 0;
		}
	}
	return object;
}
hnet.read_check_active = function(object){
	if(object.position<object.buffer.length){
		return true;
	}else{
		return false;
	}
}
hnet.event_emit = function(socket, input){
	socket.write(hnet.create_buffer(hnet.convert_array_to_buffer_array(input)));
}
hnet.event_receive = function(socket, data){
	data = socket.object.hsd.check_datastream(data);
		if(socket.object.hsd.buffer_variable == false){//This means we have a full packet of data and can continue proccesing it
			var buffer_object = hnet.create_readable_object(data);
				while(hnet.read_check_active(buffer_object)){
					if(buffer_object.buffer[buffer_object.position]==0x0b){
						console.log("Found AQS Message")
						var message = hnet.read(buffer_object);
						message.execute(buffer_object);
						//console.log(buffer_object.position);
					}else{
						if(typeof socket.object.receive == "function"){
							socket.object.receive(buffer_object);
						}else{
							console.log("Socket has no receive event");
						}
					}
				}
		}
}
hnet.parse_receive_data = function(hsd_object, data, func){
	data = hsd_object.check_datastream(data);
		if(hsd_object.buffer_variable == false){//This means we have a full packet of data and can continue proccesing it
			var buffer_object = hnet.create_readable_object(new Buffer(data));
				while(hnet.read_check_active(buffer_object)){
						func(buffer_object);
				}
		}
}

hnet.id_counter = 1000;
hnet.client_array = new Array;
tmp_receiver = -1;

hnet.create_server = function(port, socket_object){
	return net.createServer(function(socket){
		socket.object = new socket_object;
		socket.object.hsd = new hsd;
		socket.object.socket = socket;
		socket.object.id = hnet.id_counter;
		console.log("hnet server: new connection: "+socket.object.id);
		tmp_receiver = socket.object;
		hnet.id_counter++;
		hnet.client_array.push(socket.object);
		
		socket.object.write = function(input){
			socket.write(hnet.create_buffer(hnet.convert_array_to_buffer_array(input)));
		}
		socket.object.emit = function(id, input){
			var i;
				for(i=0; i<hnet.client_array.length; i++){
					if(hnet.client_array[i].id==id){
						hnet.client_array[i].write(hnet.create_buffer(hnet.convert_array_to_buffer_array(input)));
					}
				}
		}
		socket.object.broadcast = function(input){
			socket.broadcast(hnet.create_buffer(hnet.convert_array_to_buffer_array(input)));
		}
		if(typeof socket.object.onconnect == "function"){
			socket.object.onconnect(socket.object);
		}else{
			console.log("Node has no onconnect event");
		}

		socket.on('data', function(data){
			//console.log(data);
			/*hnet.parse_receive_data(socket.object.hsd, data, function(buffer_object){*/
			socket.object.hsd.check_stream(data, function(package_id, parameter_list){
				if(typeof socket.object.receive == "function"){
						var buffer = hnet.create_readable_object(parameter_list);
						socket.object.receive(socket.object, package_id, buffer);
				}else{
					console.log("Socket has no receive event");
				}
			});
		});
		
		socket.on("error", function(data){
			console.log("Minor Error");
		});
		
		socket.on('close', function(data) {
			hnet.client_array.splice(hnet.client_array.indexOf(socket.object), 1);
			if(typeof socket.object.ondisconnect == "function"){
				socket.object.ondisconnect(socket.object);
			}else{
				console.log("Socket has no ondisconnect event");
			}
		});
	}).listen(port);
}