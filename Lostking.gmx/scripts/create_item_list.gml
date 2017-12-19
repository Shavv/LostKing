var i = 0;
    while(object_exists(i)){
        var name = object_get_name(i);
            if(string_copy(name, 1, 5)=="item_"){
                ds_map_add(item_list, get_index_from_item_name(name), i);
            }
        i++;
    }

