global.hnet_socket = network_create_socket(network_socket_tcp);
    if(network_connect_raw(global.hnet_socket, argument0, argument1)<0){
        show_message("HNET ERROR 1: SERVER NOT AVAILABLE");
    }
var i;
    for(i=0; i<250; i+=1){
        global.profile[i] = ds_list_create();
        global.profile_branch_condition[i] = -1;//When condition is met, branch a is executed
        global.profile_branch_a[i] = ds_list_create();
        global.profile_branch_b[i] = ds_list_create();
    }
global.leftover_buffer = buffer_create(1, buffer_grow, 1);
global.leftover_buffer_variable = false;
global.leftover_buffer_cmp251 = 0;
global.leftover_buffer_cmp251_package_id = -1;

