var mx = device_mouse_x_to_gui(0), my = device_mouse_y_to_gui(0);

    if(mouse_check_button_pressed(mb_left)){
            if(mx>obj_inventory_controller.x && mx<=obj_inventory_controller.x+obj_inventory_controller.w && my>obj_inventory_controller.y && my<=obj_inventory_controller.y+obj_inventory_controller.h){
                return false
            }
            return true;
    }
return false;
