//blade.js
var fs = require('fs');

console.log("LostKing Blade ©2017-2018");
console.log("Type /help for a list of commands");
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", function(input){
	var data = input.replace("\n", "").replace("\r", "").split(" ");
		if(data[0][0]=="/"){
			switch(data[0].substring(1)){
				case "test":
					console.log("Promote");
				break;
				case "parent":
					var object_directory = get_parent_directory()+"\\Lostking.gmx\\objects";
					console.log(object_directory);
					
					var file_name_list = fs.readdirSync(object_directory);
					console.log(file_name_list);
				break;
			}
		}
});

function get_parent_directory(){
	var split_url = process.cwd().split("\\");
	var split_parent_url = split_url.slice(0, split_url.length-1);
	console.log(split_parent_url);

	var parent_location_url = "";
	var i;
		for(i=0; i<split_parent_url.length; i++){
			var result_url = split_parent_url[i];
				if(parent_location_url!=""){
					parent_location_url += "\\";
				}
			parent_location_url += result_url;
		}
	return parent_location_url;
}