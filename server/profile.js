//Asantia
new hnet.profile(6, new Array(h_string, h_byte));//Sends player name and client version to server when player makes connection
new hnet.profile(7, new Array(h_byte16, h_string, h_byte16, h_byte16));//Creates object other with id, name, x, y
new hnet.profile(8, new Array(h_byte16, h_byte));//Connection lost, destroys player other with id
new hnet.profile(9, new Array(h_byte16, h_byte16, h_byte16, h_byte, h_byte, h_byte, h_byte16, h_byte16));//Updates x and y positions for player with id, x, y, image_angle, image_xscale, image_yscale, image_index, hp

//Test profiles
new hnet.profile(10, new Array(h_byte, h_byte, h_byte, h_byte16, h_string, h_byte));
new hnet.profile(12, new Array(h_byte, h_byte));
new hnet.profile(13, new Array());
new hnet.profile(14, new Array(h_byte, h_string, h_byte16));

//Inventory communication
new hnet.profile(30, new Array(h_byte, h_byte));//C>S Drag item from origin inventory slot to dest inventory slot [index, index]
new hnet.profile(31, new Array(h_byte, h_byte));//C>S Drag single item from origin inventory slot to dest inventory slot [index, index]
new hnet.profile(32, new Array(h_byte, h_byte));//C>S Drag item from inventory to equipment [equipment_slot_index, inventory_slot_index]
new hnet.profile(33, new Array(h_byte, h_byte));//C>S Drag item from equipment to inventory [equipment_slot_index, inventory_slot_index]
new hnet.profile(34, new Array(h_byte, h_byte));//C>S Drag item from origin equipment slot to dest equipment slot [index, index]

new hnet.profile(35, [h_byte]);//S>C Drag response [0 = Denied | 1 = Succesfull]
new hnet.profile(36, [h_byte]);//C>S Use inventory item [index]
new hnet.profile(37, [h_byte]);//C>S Dequip equipment [index]

//Slots
new hnet.profile(40, new Array(h_byte, h_byte, h_byte16));//S>C Send item in inventory slot regular [slot_index, item_index, amount]

new hnet.profile(45, new Array(h_byte, h_byte, h_byte16));//S>C Send item in equipment slot regular [slot_index, item_index, amount]