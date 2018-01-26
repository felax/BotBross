var unirest = require('unirest')

exports.getCoords = function(parameter, cb){
    var parameter = "montreal"
    var req = unirest("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="+parameter+"&key=AIzaSyD0a9JWT3wqRsJ_psa-K0d7dqAzZqjbAiE");
    var coords = new Array(2);
    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        var str = JSON.parse(res.raw_body);
        coords[0] = str.results[0].geometry.location.lat;
        coords[1] = str.results[0].geometry.location.lng;
        console.log(coords[0],coords[1])
        cb(coords)
    });  
}
exports.getDay = function(coords, cb){
    var str;
    var timeZone;
    const url = "https://api.sunrise-sunset.org/json?lat=" + coords[0] + "&lng=" + coords[1] + "&formatted=0"
    console.log(url)
    var request = unirest("GET",url);
    request.end(function (result) 
    {
        str = JSON.parse(result.raw_body);
        var sunrise = new Date(str.results.sunrise)
        var sunset = new Date(str.results.sunset)
        var strSunrise = sunrise.getHours() + "h"
        var strSunset = sunset.getHours() + "h"
        if (sunrise.getMinutes() < 10) {strSunrise = strSunrise + "0" + sunrise.getMinutes()} else {strSunrise += sunrise.getMinutes()}
        if (sunset.getMinutes() < 10) {strSunset = strSunset + "0" + sunset.getMinutes()} else {strSunset += sunrise.getMinutes()}
        var length = Math.floor(str.results.day_length/3600)
        var lengthMinutes = Math.floor((str.results.day_length%3600)/60)
        if(lengthMinutes < 10) {lengthMinutes = "0" + lengthMinutes}
    
        cb(":sunrise:-------->:city_sunset: ```sunrise: " + strSunrise + "\n" + "sunset: " + strSunset + "\n" + "length: " + length + "h" + lengthMinutes + "```")
    })
}

