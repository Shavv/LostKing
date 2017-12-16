//check_if_mouse_in_ui()

//inventory
if  window_mouse_get_x()>inv_x and window_mouse_get_x()<inv_x+200*inv_scale
and window_mouse_get_y()>inv_y and window_mouse_get_y()<inv_y+300*inv_scale 
//stats screen



{
 global.mouse_ui=1
}
 else
{
 global.mouse_ui=0
}
