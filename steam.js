var unirest = require('unirest');

exports.getPlayer = function(parameter, parameter2, cb){
    var req = unirest("GET", "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=78EA84CDFB508150121DD6552C29349C&steamid="+parameter2+"&format=json");
    req.end(function (result) {
        var string;
        try{
            string = JSON.parse(result.raw_body);
        } catch(e){
            cb("Invalid entry");
            var failed = true;
        }
        if(parameter == "played" && failed == false){
            console.log(parameter + " " + parameter2)
            var stats = new Array(3);
            for(var i = 0; i < 3; i++){
                stats[i] = [string.response.games[i].name, Number(string.response.games[i].playtime_2weeks / 60).toFixed(2), Number(string.response.games[i].playtime_forever/60).toFixed(2)];
            }
            cb(stats);
        }
    });  
}
//78EA84CDFB508150121DD6552C29349C