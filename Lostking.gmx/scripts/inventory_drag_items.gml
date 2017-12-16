///inventory_drag_items()
size=32*inv_scale



for (o=0; o<35; o+=1)
{
 if  window_mouse_get_x()>inv_x+slot_x[o] and window_mouse_get_x()<(inv_x+slot_x[o]+size)
 and window_mouse_get_y()>inv_y+slot_y[o] and window_mouse_get_y()<(inv_y+slot_y[o]+size)
 {
  if dragslot=-1
  {  
   if slot[o]!=-1
   {
    if mouse_check_button_pressed(mb_left)
    {
     dragslot=slot[o]
     dragslotname=slotname[o]
     dragslotgrade=slotgrade[o]
     dragslotstack=slotstack[o]
     dragslotmaxstack=slotmaxstack[o]
     dragslotrightclick=slotrightclick[o]
     dragslotdescription=slotdescription[o]
     dragslotpicture=slotpicture[o]
     oldslot=o
    }
    if mouse_check_button_pressed(mb_left) and keyboard_check(vk_shift)
    {
     if slotstack[o]>1
     {
      dragslot=slot[o]
      dragslotname=slotname[o]
      dragslotgrade=slotgrade[o]
      dragslotstack=floor(slotstack[o]/2)
      dragslotmaxstack=slotmaxstack[o]
      dragslotrightclick=slotrightclick[o]
      dragslotdescription=slotdescription[o]
      dragslotpicture=slotpicture[o]    
      slotstack[o]=ceil(slotstack[o]/2)
      oldslot=-1
     }    
    }
   }
  }
   else
  {
   if slot[o]=-1
   {
    if mouse_check_button_released(mb_left)
    {
     slot[o]=dragslot
     slotname[o]=dragslot
     slotgrade[o]=dragslotgrade
     slotstack[o]=dragslotstack
     slotmaxstack[o]=dragslotmaxstack
     slotrightclick[o]=dragslotrightclick
     slotdescription[o]=dragslotdescription
     slotpicture[o]=dragslotpicture
     ///reset drag
     reset_slot(oldslot)  
     reset_slot("dragslot")
    }
    
    if mouse_check_button_pressed(mb_right)
    {
     slot[o]=dragslot
     slotname[o]=dragslot
     slotgrade[o]=dragslotgrade
     slotstack[o]=1
     slotmaxstack[o]=dragslotmaxstack
     slotrightclick[o]=dragslotrightclick
     slotdescription[o]=dragslotdescription
     slotpicture[o]=dragslotpicture 
     dragslotstack-=1 
     slotstack[oldslot]-=1   
    }
    
   }
    else
   {
    if mouse_check_button_released(mb_left)
    {    
     ///slotstack
     if slot[o]=dragslot and oldslot!=o
     {
      if slotstack[o]+dragslotstack>slotmaxstack[o]
      {
       slotstack[oldslot]-=(slotmaxstack[o]-slotstack[o])
       slotstack[o]=slotmaxstack[o]
       reset_slot("dragslot")
      }
       else
      {
       slotstack[o]+=dragslotstack
       reset_slot(oldslot)
       reset_slot("dragslot")
      }
     }
      else
     {
       //slot swap      
      
      //old slot
      if oldslot!=-1
      {
       slot[oldslot]=slot[o]
       slotname[oldslot]=slotname[o]
       slotgrade[oldslot]=slotgrade[o]
       slotstack[oldslot]=slotstack[o]
       slotmaxstack[oldslot]=slotmaxstack[o]
       slotrightclick[oldslot]=slotrightclick[o]
       slotdescription[oldslot]=slotdescription[o]
       slotpicture[oldslot]=slotpicture[o]
      
       //new slot
       slot[o]=dragslot
       slotname[o]=dragslotname
       slotstack[o]=dragslotstack
       slotmaxstack[o]=dragslotmaxstack
       slotrightclick[o]=dragslotrightclick
       slotdescription[o]=dragslotdescription
       slotpicture[o]=dragslotpicture
       
       //reset slots after
       reset_slot("dragslot")   
      }  
     }
    }
    ///stack stacks
    if mouse_check_button_pressed(mb_right)
    {
     if slotstack[o]<slotmaxstack[o]
     {
      slotstack[o]+=1
      dragslotstack-=1
      slotstack[oldslot]-=1
     }    
    }   
   }
  } 
 }
}


///delete item out of inventory
if dragslot!=-1
{
 if  window_mouse_get_x()>inv_x and window_mouse_get_x()<inv_x+200*inv_scale
 and window_mouse_get_y()>inv_y and window_mouse_get_y()<inv_y+300*inv_scale 
 {
  //
 }
  else
 {
  if mouse_check_button_released(mb_left)
  {
   ///confirmation window
   reset_slot(oldslot)
   reset_slot("dragslot")
  }
 }
}


if dragslotstack=0 {reset_slot(oldslot) reset_slot('dragslot')}
