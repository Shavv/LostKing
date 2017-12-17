var hnet_t_id = argument0;
var hnet_t_profile_type = argument1;

    if(hnet_t_profile_type==1){
        ds_list_add(global.profile_branch_a[hnet_t_id], argument2);
    }else if(hnet_t_profile_type==2){
        ds_list_add(global.profile_branch_b[hnet_t_id], argument2);
    }else{
        ds_list_add(global.profile[hnet_t_id], argument2);
    }

