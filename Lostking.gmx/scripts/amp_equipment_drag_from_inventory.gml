//amp_equipment_drag_from_inventory(equipment_slot, inventory_slot);
hnet_message_start(32);
hnet_write_byte(argument0);
hnet_write_byte(argument1);
hnet_message_send();
