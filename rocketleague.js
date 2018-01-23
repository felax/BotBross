var unirest = require('unirest');



exports.getPlayer = function(parameter, cb){
    parameter = 76561198034872459;
    var req = unirest("GET", "https://api.rocketleaguestats.com/v1/player?unique_id=76561198034872459&platform_id=1&apikey=0FDL3CSOT9RRIAEBPIT00A9IN853TV2L");
    req.end(function (result) {
        var string = JSON.parse(result.raw_body);
        var stats = new Array(6);
        console.log(string.uniqueId);
        stats[0] = string.stats.wins; 
        stats[1] = string.stats.goals; 
        stats[2] = string.stats.mvps; 
        stats[3] = string.stats.saves; 
        stats[4] = string.stats.shots; 
        stats[5] = string.stats.assists;
        stats[6] = string.displayName;
        cb("**"+ stats[6] + "**```Wins: " + stats[0] + "\nGoals: " + stats[1] + "\nMVPs: " + stats[2] + "\nSaves: " + stats[3] + "\nShots: " + stats[5] + "\nAssists: " + stats[5] + "```");
    });  
}

//0FDL3CSOT9RRIAEBPIT00A9IN853TV2L

