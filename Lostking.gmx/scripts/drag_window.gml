//drag_window()


//inventory
if inv_alpha!=0
{
 if window_mouse_get_x()>inv_x and window_mouse_get_x()<inv_x+400 and window_mouse_get_y()>inv_y and window_mouse_get_y()<inv_y+50
 {
  if mouse_check_button(mb_left)
  {
   inv_x=window_mouse_get_x()-200
   inv_y=window_mouse_get_y()-25
  } 
 }
}
