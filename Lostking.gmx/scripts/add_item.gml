///add_item(item_index,stack)
var stack = argument1;
var flag = false;

//////////////////////
for (var k = 0; k < 35; k++)
{    
    if (slot[k] == -1)
    {
        // no existing item -> new item + stack + information
        slotstack[k] = 0; // clear slotstack    
       
        slot[k] = argument0;
        slotname[k] = item[argument0, 0];
        slotgrade[k] = item[argument0, 1];
        slotmaxstack[k] = item[argument0, 3];
        slotrightclick[k] = item[argument0, 4];
        slotdescription[k] = item[argument0, 5];
        slotpicture[k] = item[argument0, 6];
       
        flag = true; // give permission to add items
    }
    else
    {
        // information already defined with existing item in slot
        if (slot[k] == argument0 and oldslot!=k and (slotstack[k] < slotmaxstack[k]))
        {
            flag = true; // give permission to add items
        }
    }
   
    if (flag) // add items
    {
        if (slotstack[k] + stack > slotmaxstack[k])
        {
            var newStack = stack - (slotmaxstack[k] - slotstack[k]);
            slotstack[k] = slotmaxstack[k];
            add_item(argument0, newStack);
            break;
        }
        else slotstack[k] += stack;
        break;
    }
}
