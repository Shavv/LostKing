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