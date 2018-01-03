receive_package_id = argument0;
receive_package_list = argument1;
receive_package_read_position = 0;

switch(receive_package_id){
    case 7://Create object other with id, name, x, y
        var other_id = amp_read();
        var other_name = amp_read();
        var other_x = amp_read();
        var other_y = amp_read();
        //show_message("Create other player with id: "+string(other_id));
        var other_player;
        other_player = instance_create(other_x, other_y, obj_other_player);
        other_player.network_id = other_id;
        other_player.name = other_name;
    break;
    case 8://Destory object other with id, ununsed argument
        other_id = amp_read();
            with(obj_other_player){
                if(network_id==other_id){
                    instance_destroy();
                }
            }
    break;
    case 9://Other player moves, update x & y
        global.other_id = amp_read();
        global.other_x = amp_read();
        global.other_y = amp_read();
        global.other_player_angle = amp_read();
        global.other_image_xscale = amp_read();
        global.other_image_yscale = amp_read();
        global.other_image_index = amp_read();
        global.other_hp = amp_read();
        
            with(obj_other_player){
                if(network_id==global.other_id){
                    x = global.other_x;
                    y = global.other_y;
                    player_angle = global.other_player_angle;
                    image_xscale = global.other_image_xscale;
                    image_yscale = global.other_image_yscale;
                    image_index = global.other_image_index;
                    hp = global.other_hp/100;
                }
            }
    break;
    case 40://Update inventory slot
        var inventory_index = amp_read();
        var item_index = amp_read();
        var slot_amount = amp_read();
        update_inventory_slot_regular(inventory_index, item_index, slot_amount);
    break;
    case 45://Update equipment slot
        var inventory_index = amp_read();
        var item_index = amp_read();
        var slot_amount = amp_read();
        update_equipment_slot_regular(inventory_index, item_index, slot_amount);
    break;
}
