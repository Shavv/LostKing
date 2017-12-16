///outline(color,mousemask,rightclick)
if global.mouse_ui=0 and image_alpha=1
{
 oldmask=mask_index
 mask_index=argument1
 if position_meeting(mouse_x,mouse_y,self)
 {
  if(global.mouse_over!=id){
     if(instance_exists(global.mouse_over)){
         if(global.mouse_over.depth>depth){
            global.mouse_over=id;
        }
    }else{
        global.mouse_over=id;
    }
 }
 if global.mouse_over=id
 {
  //Set an outline color
  var outline_color = argument0;
  d3d_set_fog(1,outline_color,-1,-1)
  //Draw the sprite 1 pixel off in each direction
  draw_sprite_ext(sprite_index, -1, x - 1, y, image_xscale, image_yscale, 0, outline_color, 1);
  draw_sprite_ext(sprite_index, -1, x + 1, y, image_xscale, image_yscale, 0, outline_color, 1);
  draw_sprite_ext(sprite_index, -1, x, y - 1, image_xscale, image_yscale, 0, outline_color, 1);
  draw_sprite_ext(sprite_index, -1, x, y + 1, image_xscale, image_yscale, 0, outline_color, 1);
  d3d_set_fog(0,0,0,0)
  script_execute(argument2)
 }
}else{
    if(global.mouse_over==id){
        global.mouse_over=noone;
    }
 }
 mask_index=oldmask
}



/*
mask_index=argument1

if position_meeting(mouse_x,mouse_y,self)
{
 if global.mouse_over=id or (global.mouse_over!=id and global.mouse_over.depth>depth)
 {
  global.mouse_over=id
  //Set an outline color
  var outline_color = argument0;
  d3d_set_fog(1,outline_color,-1,-1)
  //Draw the sprite 1 pixel off in each direction
  draw_sprite_ext(sprite_index, -1, x - 1, y, image_xscale, image_yscale, 0, outline_color, 1);
  draw_sprite_ext(sprite_index, -1, x + 1, y, image_xscale, image_yscale, 0, outline_color, 1);
  draw_sprite_ext(sprite_index, -1, x, y - 1, image_xscale, image_yscale, 0, outline_color, 1);
  draw_sprite_ext(sprite_index, -1, x, y + 1, image_xscale, image_yscale, 0, outline_color, 1);
  d3d_set_fog(0,0,0,0)
  //set target
  if mouse_check_button_pressed(mb_right)
  {
   obj_player.target=id
  }
 }
 global.mouse_over=id
}

mask_index=argument2

