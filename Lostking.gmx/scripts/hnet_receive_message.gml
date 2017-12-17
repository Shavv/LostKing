if(ds_map_find_value(async_load, "type")==network_type_data){
    datastream = ds_map_find_value(async_load, "buffer");
    
    var data = buffer_create(1, buffer_grow, 1);
    if(global.leftover_buffer_variable){
            buffer_copy(global.leftover_buffer, 0, buffer_get_size(global.leftover_buffer), data, 0);
            buffer_copy(datastream, 0, buffer_get_size(datastream), data, buffer_get_size(global.leftover_buffer));
            global.leftover_buffer_variable = false;
        }else{
            data = datastream;
        }
    var package_id = -1;
    var package_start = 0;
    var package_output = ds_list_create();
    
    //show_message(buffer_get_size(data));
    var position = 0;
        while(position<buffer_get_size(data)){
            //show_message("loop");
            if(package_id==-1){
                var type = buffer_read(data, buffer_u8);
                //show_message(type);
                    if(type==251){//CMP251 multiple messages of the same type
                            /*position += 1;
                            this.buffer_cmp251_package_id = data[position];
                            positin++;
                            var data0 = data[position];
                            var data1 = data[position+1];
                            var value = data0 * 256 + data1;
                            this.buffer_cmp251 = value;
                            console.log(this.buffer_cmp251_package_id+"_"+this.buffer_cmp251);
                            */
                            position += 1;
                        }else if(global.leftover_buffer_cmp251>0){
                            /*package_id = this.buffer_cmp251_package_id;
                            console.log("Start package: "+package_id);
                            package_start = position;
                            package_output = new Array;
                            this.buffer_cmp251-*/
                        }else if(ds_list_size(global.profile[type])==0){
                            //show_message("Error undefined package id: "+string(type));
                            break;
                            position += 1;
                        }else{
                            package_id = type;
                            //show_message("Start package: "+string(package_id));
                            ds_list_clear(package_output);
                            position += 1;
                    }
            }else{
                var type2 = ds_list_find_value(global.profile[package_id], ds_list_size(package_output));
                //show_message(type2);
                    if(type2==-1){//String
                        var size = buffer_read(data, buffer_u8);
                        var output = "";
                        var i;
                            for(i=0; i<size; i+=1){
                                output += chr(buffer_read(data, buffer_u8));
                            }
                        //show_message(output);
                        ds_list_add(package_output, output);
                        position += size+1;
                    }else if(type2==1){//Int8
                        var data0 = buffer_read(data, buffer_u8);
                        var value = data0-power(2, 8)/2;
                        //show_message(value);
                        ds_list_add(package_output, value);
                        position += 1;
                    }else if(type2==2){//Int16
                        var data0 = buffer_read(data, buffer_u8)
                        var data1 = buffer_read(data, buffer_u8)
                        var value = data0*256 + data1 - power(2, 16)/2;
                        //show_message(value);
                        ds_list_add(package_output, value);
                        position += 2;
                    }
                    if(type<250){
                        if(ds_list_size(package_output)==ds_list_size(global.profile[package_id])){
                            script_execute(argument0 , package_id, package_output);
                            //show_message("Output package!");
                            package_id = -1;
                        }
                    }
            }
        }
}
