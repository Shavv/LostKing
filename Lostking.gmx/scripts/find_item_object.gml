//Argument0 = item.index
var result_value = ds_map_find_value(obj_item_controller.item_list, argument0);
    if(is_undefined(result_value)){
        return -1;
    }else{
        return result_value;
    }

