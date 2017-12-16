///reset_slot(slot_index)
if argument0!="dragslot"
{
 if argument0!=-1
 {
  slot[argument0]=-1
  slotname[argument0]=""
  slotgrade[argument0]=""
  slotstack[argument0]=0
  slotmaxstack[argument0]=0
  slotrightclick[argument0]=rl_nothing()
  slotdescription[argument0]=""
  slotpicture[argument0]=spr_nothing
 }
}
 else
{ 
 dragslot=-1
 dragslotname=""
 dragslotgrade=""
 dragslotstack=""
 dragslotmaxstack=0
 dragslotrightclick=rl_nothing()
 dragslotdescription=""
 dragslotpicture=spr_nothing
 oldslot=-1
}
