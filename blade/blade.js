//blade.js
var fs = require('fs');
var xml2js = require('xml2js');

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

					var file_name_list = fs.readdirSync(object_directory);
					
					var i;
						for(i=0; i<file_name_list.length; i++){
							var result_file_name = file_name_list[i];
								if(result_file_name.substring(0, 4)=="item"){
									var parser = new xml2js.Parser();
									fs.readFile(object_directory+"\\"+result_file_name, function(err, data) {
										parser.parseString(data, function (err, result) {
											console.log(result.object.events[0].event[0].action[0].arguments[0].argument[0].string[0]);
										});
									});
								}
						}
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