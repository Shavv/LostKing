hsd = function(){
	this.buffer = new Buffer(0);
	this.buffer_variable = false;
	this.buffer_offset = 0;
	
	this.buffer_cmp251 = 0;
	this.buffer_cmp251_package_id = -1;
	
	this.convert_16bit_integer = function(buffer, start){
		var length = 0;
		length += buffer[start] * 256;
		length += buffer[start+1];
		return length;
	}
	this.convert_32bit_integer = function(buffer, start){
		var length = 0;
		length += buffer[start] * Math.pow(2, 16) * 256;
		length += buffer[start+1] * Math.pow(2, 16);
		length += buffer[start+2] * 256;
		length += buffer[start+3];
		return length;
	}
	this.check_stream = function(datastream, func){
		var data = -1;
			if(this.buffer_variable){
				data = new Buffer(datastream.length+this.buffer.length);
				this.buffer.copy(data);
				datastream.copy(data, this.buffer.length);
				this.buffer_variable = false;
				//this.buffer_offset = 0;
				this.buffer = new Buffer(0);
			}else{
				data = datastream;
			}
		var package_id = -1;
		var package_position = 0;
		var package_start = 0;
		var package_output = new Array;

		var position = 0;
			while(position<data.length){
				if(package_id==-1){
					var type = data[position];
					if(type==251){//CMP251 multiple messages of the same type
						position++;
						this.buffer_cmp251_package_id = data[position];
						position++;
						var data0 = data[position];
						var data1 = data[position+1];
						var value = data0 * 256 + data1;
						this.buffer_cmp251 = value;
						console.log(this.buffer_cmp251_package_id+"_"+this.buffer_cmp251);
						position += 2;
					}else if(this.buffer_cmp251>0){
						package_id = this.buffer_cmp251_package_id;
						console.log("Start package: "+package_id);
						package_start = position;
						package_output = new Array;
						this.buffer_cmp251-=1;
					}else if(typeof hnet_profile_list[type]=== "undefined"){
						console.log("Fatal error!!! data corruption: ");
						break;
					}else{
						package_id = type;
						console.log("Start package: "+package_id);
						package_start = position;
						package_position = 0
						package_output = new Array;
						position++;
					}
				}else{
					if(package_id!=-1){
						var size = hnet_profile_list[package_id].list[package_output.length];
							if(size==-1){//String
								var string_length = data[position];
								console.log("String with size: "+string_length);
								position++;
								
								var output = "";
								var i;
									for(i=position; i<position+string_length; i++){
										output += String.fromCharCode(data[i]);
									}
								console.log(output);
								package_output.push(output);
								position += string_length;
							}else if(size==1){//Int8
								var data0 = data[position];
								var value = data0-Math.pow(2, 8)/2;
								console.log(value);
								package_output.push(value);
								position += size;
							}else if(size==2){//Int16
								var data0 = data[position];
								var data1 = data[position+1];
								var start = 0;
								start += data0 * 256;
								start += data1;
								var value = start-Math.pow(2, 16)/2;
								console.log(value);
								package_output.push(value);
								position += size;
							}else{
								console.log(data[position]);
								package_output.push(8);
								position += size;
							}
					}else{
						console.log("ERROR!");
						position++;
					}
				}
				if(type<250){
					if(package_output.length==hnet_profile_list[package_id].list.length){
						func(package_id, package_output);
						//console.log(package_output);
						//console.log("Package ends here");
						package_id = -1;
					}
				}
				type = 0;
			}
		if(package_id!=-1){
			this.buffer_variable = true;
			this.buffer = data.slice(package_start, data.length);
		}
	}
	this.check_datastream = function(datastream){
		//console.log("Input data: ");
		//console.log(datastream);
		
		var data = -1;
		if(this.buffer_variable){
			data = new Buffer(datastream.length+this.buffer.length);
			this.buffer.copy(data);
			datastream.copy(data, this.buffer.length);
			this.buffer_variable = false;
			this.buffer_offset = 0;
			this.buffer = new Buffer(0);
		}else{
			data = datastream;
		}
		//console.log(data.length);
		var position = this.buffer_offset;
			while(position<data.length){
				//console.log("Pos:"+position);
				switch(data[position]){
					case 0x01: //Binary 16 bit
					case 0x03: //String
					case 0x0a: //Json
					case 0x0b: //AQS
						var length = this.convert_16bit_integer(data, position+1)+3;
							if(position+length>data.length){
								this.buffer_variable = true;
								this.buffer_offset = position;
								this.buffer = data;
							}
						position += length;
					break;
					case 0x02://Binary 32 bit
						var length = this.convert_32bit_integer(data, position+1)+5;
							if(position+length>data.length){
								this.buffer_variable = true;
								this.buffer_offset = position;
								this.buffer = data;
							}
						position += length;
					break;
					case 0x04://Int8
						var length = 2;//this.convert_32bit_integer(data, position+1)+2;
							if(position+length>data.length){
								this.buffer_variable = true;
								this.buffer_offset = position;
								this.buffer = data;
							}
						position += length;
					break;
					case 0x05://Int16
						var length = 3;//this.convert_32bit_integer(data, position+1)+3;
							if(position+length>data.length){
								this.buffer_variable = true;
								this.buffer_offset = position;
								this.buffer = data;
							}
						position += length;
					break;
					case 0x06://Int32
						var length = this.convert_32bit_integer(data, position+1)+5;
							if(position+length>data.length){
								this.buffer_variable = true;
								this.buffer_offset = position;
								this.buffer = data;
							}
						position += length;
					break;
					case 0x08://Float
						var length = 7;
							if(position+length>data.length){
								this.buffer_variable = true;
								this.buffer_offset = position;
								this.buffer = data;
							}
						position += length;
					break;
					default:
						console.log("HSD: Invalid package: dropped it");
						var valid_data = new Buffer(position);
						data.copy(valid_data);
						return valid_data;
					break;
				}
			}
		return data;
	}
}