///passthrough(collision_mask)
oldmask=mask_index
mask_index=argument0

if position_meeting(obj_player.x,obj_player.y,self)
   //collision_circle(obj_player.x,obj_player.y,15,self,1,0)
{
 if obj_player.depth>depth
 {
  if image_alpha>0.1
  {
   image_alpha-=0.05
  }
 }
  else
 {
  if image_alpha<1
  {
   image_alpha+=0.05
  } 
 }
}
 else
{
 if image_alpha<1
 {
  image_alpha+=0.05
 }
}

mask_index=oldmask
