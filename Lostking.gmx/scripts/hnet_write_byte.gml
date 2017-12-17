var input = argument0;
    if(input>=-power(2, 8)/2 && input<power(2, 8)/2){
        buffer_write(global.hnet_buffer, buffer_u8, input+power(2, 8)/2);
        global.hnet_buffer_size += 1;
    }else{
        show_message("HNET ERROR 2: NUMBER OUT OF BOUNDS BYTE");
    }

