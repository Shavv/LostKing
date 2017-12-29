//update_inventory_slot(slot_index, item_index, item_amount)
var slot_index = argument0;
var item_index = argument1;
var item_amount = argument2;

var result_slot = find_inventory_slot(slot_index);
    if(result_slot.item_object==-1){
        result_slot.item_object = instance_create(0, 0, find_item_object(item_index));
        show_message_async("Update object kind");
    }else{
        if(result_slot.item_object.index!=item_index){
            instance_destroy(result_slot.item_object);
            result_slot.item_object = instance_create(0, 0, find_item_object(item_index));
            show_message_async("Update object kind");
        }
    }
show_message_async(item_amount);
result_slot.item_amount = item_amount;
