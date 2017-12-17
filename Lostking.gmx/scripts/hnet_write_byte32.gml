var input = argument0;
    if(input>=-power(2, 32)/2 && input<power(2, 32)/2){
        var value = input+power(2, 32)/2;
     var first = floor(value/power(2, 16));
     var second = value % power(2, 16);
     
        buffer_write(global.hnet_buffer, buffer_u8, floor(first/256));
        buffer_write(global.hnet_buffer, buffer_u8, first % 256);
        buffer_write(global.hnet_buffer, buffer_u8, floor(second/256));
        buffer_write(global.hnet_buffer, buffer_u8, second % 256);
        global.hnet_buffer_size += 4;
        
    }else{
        show_message("HNET ERROR 2: NUMBER OUT OF BOUNDS BYTE32");
    }
    

