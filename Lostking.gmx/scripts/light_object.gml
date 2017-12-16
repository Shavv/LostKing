//light_object()
if instance_exists(obj_player)
{
 with (obj_player)
 {
  light(x,y-32,120,c_white)
 }
}

if instance_exists(obj_player_other)
{
 with (obj_player_other)
 {
  light(x,y-32,120,c_white)
 }
}
