var a = string_copy(argument0, 6, string_length(argument0));
var b = string_pos("_", a);
return real(string_copy(a, 1, b));
