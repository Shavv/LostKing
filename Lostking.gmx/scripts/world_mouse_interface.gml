var mx = device_mouse_x_to_gui(0), my = device_mouse_y_to_gui(0);
//show_message_async(string(obj_inventory_controller.x)+" "+string(obj_inventory_controller.y)+" | "+string(obj_inventory_controller.w)+" "+string(obj_inventory_controller.w));
    if(obj_inventory_controller.active && mx>obj_inventory_controller.x && mx<=obj_inventory_controller.x+obj_inventory_controller.w && my>obj_inventory_controller.y && my<=obj_inventory_controller.y+obj_inventory_controller.h){
        return false;
    }
    if(obj_equipment_controller.active && mx>obj_equipment_controller.x && mx<=obj_equipment_controller.x+obj_equipment_controller.w && my>obj_equipment_controller.y && my<=obj_equipment_controller.y+obj_equipment_controller.h){
        return false;
    }
    if(obj_inventory_controller.drag_item_index!=-1){
        return false;
    }
    if(obj_equipment_controller.drag_item_index!=-1){
        return false;
    }
return true;
