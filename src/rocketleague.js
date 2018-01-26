var unirest = require('unirest');



exports.getPlayer = function(parameter, parameter2, cb){
    var req = unirest("GET", "https://api.rocketleaguestats.com/v1/player?unique_id="+parameter2+"&platform_id=1&apikey=0FDL3CSOT9RRIAEBPIT00A9IN853TV2L");
    req.end(function (result) {
        var string = JSON.parse(result.raw_body);
        var stats = new Array(6);
		if(parameter2 != null){
			if(string.code != null){
				cb("Invalid entry");
			}
			else {
				if(parameter == 'stats'){
					stats[0] = string.stats.wins; 
					stats[1] = string.stats.goals; 
					stats[2] = string.stats.mvps; 
					stats[3] = string.stats.saves; 
					stats[4] = string.stats.shots; 
					stats[5] = string.stats.assists;
					stats[6] = string.displayName;
					cb("**"+ stats[6] + "**```Wins: " + stats[0] + "\nGoals: " + stats[1] + "\nMVPs: " + stats[2] + "\nSaves: " + stats[3] + "\nShots: " + stats[5] + "\nAssists: " + stats[5] + "```");
				} else if(parameter == 'ranked'){
					var stats = new Array(4);
					stats[0] = string.rankedSeasons["6"]["10"].rankPoints;
					stats[1] = string.rankedSeasons["6"]["11"].rankPoints;
					stats[2] = string.rankedSeasons["6"]["12"].rankPoints;
					stats[3] = string.rankedSeasons["6"]["13"].rankPoints;
					stats[4] = string.displayName;
					cb("**"+ stats[4]+"**```Solo duel: " + stats[0] + "\nDoubles: " + stats[1] + "\nSolo standard: " + stats[2] + "\nStandard: " + stats[3] + "```");
				} else {
					cb("Choose a category");
				}
			}
		} else {
			cb("no id");
		}
    });  
}

//0FDL3CSOT9RRIAEBPIT00A9IN853TV2L

