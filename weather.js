var unirest = require('unirest');


exports.getCoords = function(parameter, cb){
    if(parameter == null) parameter = 'Montreal';
    var req = unirest("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="+parameter+"&key=AIzaSyD0a9JWT3wqRsJ_psa-K0d7dqAzZqjbAiE");
    var coords = [new Array(2)];
    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        var str = JSON.parse(res.raw_body);
        coords[0] = str.results[0].geometry.location.lat;
        coords[1] = str.results[0].geometry.location.lng;
        cb(coords)
    });  
}

exports.getTemp = function(coords, cb){
    var str;
    const url = "http://api.openweathermap.org/data/2.5/weather?lat="+coords[0]+"&lon="+coords[1]+"&appid=53623a4cbf5ea5fa7fddd093b6a049b6"; 
    console.log(url)
    var request = unirest("GET",url);
     request.end(function (result) {
        
        str = JSON.parse(result.raw_body);
        var direction;
        if(str.wind.deg < 23 || str.wind.deg >= 337){
            direction = 'N';
        } else if(str.wind.deg >= 23 || str.wind.deg < 68){
            direction = 'NE';
        } else if(str.wind.deg >= 68 || str.wind.deg < 113){
            direction = 'E'
        } else if(str.wind.deg >= 113 || str.wind.deg < 158){
            direction = 'SE'
        } else if(str.wind.deg >= 158 || str.wind.deg < 203){
            direction = 'S'
        } else if(str.wind.deg >= 203 || str.wind.deg < 248){
            direction = 'SW'
        } else if(str.wind.deg >= 248 || str.wind.deg < 293){
            direction = 'W'
        }   else if(str.wind.deg >= 293 || str.wind.deg < 337){
            direction = 'NW'
        }

        var emoji;
        if(str.weather[0].main == 'Clouds'){
            emoji = ':cloud:';
        } else if(str.weather[0].main == 'Rain'){
            emoji = ':cloud_rain:';
        } else if(str.weather[0].main == 'Clear'){
            emoji = ':sunny:';
        } else if(str.weather[0].main == 'Mist'){
            emoji = ':cloud_rain:';
        } else if(str.weather[0].main == 'Snow'){
            emoji = ':cloud_snow:';
        }

        cb([str.main.temp, str.name, str.sys.country,str.wind.speed,direction,str.weather[0].main,str.main.humidity,emoji]);
    });

}