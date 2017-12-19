var i = 0;
    while(object_exists(i)){
        if(string_copy(object_get_name(i), 1, 5)=="item_"){
            
            show_message("Found Item "+object_get_name(i));
        }
        i++;
    }
