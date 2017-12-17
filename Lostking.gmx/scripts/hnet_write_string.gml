if(string_length(argument0)<power(2, 8)){
    buffer_write(global.hnet_buffer, buffer_u8, string_length(argument0));
    buffer_write(global.hnet_buffer, buffer_text, argument0);
    global.hnet_buffer_size += string_length(argument0)+1;
}

