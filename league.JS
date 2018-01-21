var unirest = require('unirest');

exports.getSummonerId = function(parameter, cb){
	if( parameter != null && parameter.indexOf("-") != -1){
		parameter = parameter.replace("-", " ");
	}
	var request = unirest("Get", "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + parameter + "?api_key=RGAPI-e6d6ec12-ba0c-4600-b042-790c0ab8b5a7");
	var id;
	request.end(function(result){
		var string = JSON.parse(result.raw_body);
		id = string.id;
		cb(id);
	});
}




exports.getRanked = function(parameter, cb){

    var req = unirest("GET", "https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/" + parameter + '?api_key=RGAPI-e6d6ec12-ba0c-4600-b042-790c0ab8b5a7');
    var ratio = new Array(6);
    req.end(function (res) {
        //if (res.error) throw new Error(res.error);
        var str = JSON.parse(res.raw_body);
        ratio[0] = str[0].wins;
        ratio[1] = str[0].losses;
        ratio[2] = str[0].tier;
        ratio[3] = str[0].rank;
        ratio[4] = str[0].leaguePoints;
        ratio[5] = str[0].hotStreak;
        
        cb(ratio)

	});
}


