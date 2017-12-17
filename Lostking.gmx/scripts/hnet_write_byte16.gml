var input = argument0;
    if(input>=-power(2, 16)/2 && input<power(2,16)/2){
        var value = input+power(2, 16)/2;
        buffer_write(global.hnet_buffer, buffer_u8, floor(value/256));
        buffer_write(global.hnet_buffer, buffer_u8, value % 256);
        global.hnet_buffer_size += 2;
    }else{
        show_message("HNET ERROR 2: NUMBER OUT OF BOUNDS BYTE16");
    }
    

