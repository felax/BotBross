var unirest = require('unirest');

function getSteamID(vanityUrl, cb){
    if(vanityUrl != undefined && vanityUrl.length != 17){
        var req = unirest("GET", "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=78EA84CDFB508150121DD6552C29349C&vanityurl="+vanityUrl);
        req.end(function(result){
            var string = JSON.parse(result.raw_body);
            cb(string.response.steamid);
        });
    } else if(vanityUrl != undefined && vanityUrl.length == 17){
        cb(vanityUrl);
    } else {
        cb();
    }
}

function getSteamPersona(steamId, cb){
    var req = unirest("GET", "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=78EA84CDFB508150121DD6552C29349C&steamids="+steamId);
    req.end(function(result){
        var string = JSON.parse(result.raw_body);
        cb(string.response.players[0].personaname);
    });
}

exports.getPlayer = function(parameter, parameter2, cb){
	getSteamID(parameter2, (steamid) => {
        if(steamid != undefined){
            getSteamPersona(steamid, (name) => {
                var req = unirest("GET", "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=78EA84CDFB508150121DD6552C29349C&steamid="+steamid+"&format=json");
                req.end(function (result) {
                    var string = JSON.parse(result.raw_body);
                    if(string.response.total_count > 2){
                        if(parameter == "played"){
                            var stats = new Array(3);
                            for(var i = 0; i < 3; i++){
                                stats[i] = [string.response.games[i].name, Number(string.response.games[i].playtime_2weeks / 60).toFixed(2), Number(string.response.games[i].playtime_forever/60).toFixed(2)];
                            }
                            cb([stats, name]);
                        } else {
                            cb("Invalid entry");
                        }
                    } else {
                        cb("Invalid entry");
                    }
                });
            }); 
        } else {
            cb("Invalid entry");
        }
    });  
}
//78EA84CDFB508150121DD6552C29349C