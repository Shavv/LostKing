///obj player
draw_set_color(c_black)
////////////////////////////////////////
if instance_exists(obj_player)
{
 with (obj_player)
 {
  draw_sprite_ext(sprite_index,image_index,x,y,image_xscale,-global.sun_distance,global.sun_angle,c_black,1)
  //draw_skeleton(sprite_index,skeleton_animation_get(),skeleton_skin_get(),image_index,x,y,image_xscale,-image_yscale,image_angle,c_black,1)
  //draw_ellipse(x-8,y-4,x+8,y+4,0)
 }
}
////////////////////////////////////////////
if instance_exists(obj_test_tree)
{
 with (obj_test_tree)
 {
  draw_sprite_ext(sprite_index,image_index,x,y-1,image_xscale,-global.sun_distance,global.sun_angle,c_black,1)
 }
}
////////////////////////////////////////////
if instance_exists(obj_target)
{
 with (obj_target)
 {
  draw_sprite_ext(sprite_index,image_index,x,y-1,image_xscale,-global.sun_distance,global.sun_angle,c_black,1)
 }
}


