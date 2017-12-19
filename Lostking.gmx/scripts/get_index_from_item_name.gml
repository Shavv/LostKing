//Argument0 = object_name from a item object
var a = string_copy(argument0, 6, string_length(argument0));
var b = string_pos("_", a);
    if(b==0){
        b = string_length(a);
    }
return real(string_copy(a, 1, b));
