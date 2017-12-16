///inventory_draw_items()
slot_x[0]=17*inv_scale
slot_x[1]=51*inv_scale
slot_x[2]=85*inv_scale
slot_x[3]=119*inv_scale
slot_x[4]=153*inv_scale
slot_x[5]=17*inv_scale
slot_x[6]=51*inv_scale
slot_x[7]=85*inv_scale
slot_x[8]=119*inv_scale
slot_x[9]=153*inv_scale
slot_x[10]=17*inv_scale
slot_x[11]=51*inv_scale
slot_x[12]=85*inv_scale
slot_x[13]=119*inv_scale
slot_x[14]=153*inv_scale
slot_x[15]=17*inv_scale
slot_x[16]=51*inv_scale
slot_x[17]=85*inv_scale
slot_x[18]=119*inv_scale
slot_x[19]=153*inv_scale
slot_x[20]=17*inv_scale
slot_x[21]=51*inv_scale
slot_x[22]=85*inv_scale
slot_x[23]=119*inv_scale
slot_x[24]=153*inv_scale
slot_x[25]=17*inv_scale
slot_x[26]=51*inv_scale
slot_x[27]=85*inv_scale
slot_x[28]=119*inv_scale
slot_x[29]=153*inv_scale
slot_x[30]=17*inv_scale
slot_x[31]=51*inv_scale
slot_x[32]=85*inv_scale
slot_x[33]=119*inv_scale
slot_x[34]=153*inv_scale

slot_y[0]=26*inv_scale
slot_y[1]=26*inv_scale
slot_y[2]=26*inv_scale
slot_y[3]=26*inv_scale
slot_y[4]=26*inv_scale
slot_y[5]=60*inv_scale
slot_y[6]=60*inv_scale
slot_y[7]=60*inv_scale
slot_y[8]=60*inv_scale
slot_y[9]=60*inv_scale
slot_y[10]=94*inv_scale
slot_y[11]=94*inv_scale
slot_y[12]=94*inv_scale
slot_y[13]=94*inv_scale
slot_y[14]=94*inv_scale
slot_y[15]=128*inv_scale
slot_y[16]=128*inv_scale
slot_y[17]=128*inv_scale
slot_y[18]=128*inv_scale
slot_y[19]=128*inv_scale
slot_y[20]=162*inv_scale
slot_y[21]=162*inv_scale
slot_y[22]=162*inv_scale
slot_y[23]=162*inv_scale
slot_y[24]=162*inv_scale
slot_y[25]=196*inv_scale
slot_y[26]=196*inv_scale
slot_y[27]=196*inv_scale
slot_y[28]=196*inv_scale
slot_y[29]=196*inv_scale
slot_y[30]=230*inv_scale
slot_y[31]=230*inv_scale
slot_y[32]=230*inv_scale
slot_y[33]=230*inv_scale
slot_y[34]=230*inv_scale



for (j=0; j<35; j+=1)
{
 if slot[j]!=-1
 {
  draw_sprite_ext(item[slot[j],6],-1,inv_x+slot_x[j],inv_y+slot_y[j],inv_scale,inv_scale,0,c_white,inv_alpha)
  if slotstack[j]>1
  {
   draw_text(inv_x+slot_x[j],inv_y+slot_y[j],slotstack[j])
  }
 }
}





