var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var weather = require('./weather.js');
var fs = require('fs');
var league = require('./league.JS');
var sun = require("./sun.js");
var rl = require("./rocketleague.js");
const async = require('async');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
	var server_ID = bot.channels[channelID].guild_id;
	var user_ID = bot.servers[server_ID].members[userID].voice_channel_id;
	var bot_ID = bot.servers[server_ID].members['404808825451970563'].voice_channel_id;
	if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
		var parameter = args[1];
       
        args = args.splice(1);
        switch(cmd) {
			case 'bing':
                bot.sendMessage({
                    to: channelID,
                    message: '!bong'
                });
			break;
			case 'bong':
				bot.sendMessage({
					to: channelID,
					message: '!bing'
				});
			break;
			case 'reee':
				bot.sendMessage({
					to: channelID,
					tts: true,
					message: 'REEEEEEEEE'
				});	
			break;
			case 'flip':
				var rand = Math.random()
				var answer;
				if(rand <= 0.5){
					answer = "Tails";
				} else {
					answer = "Heads";
				}
				bot.sendMessage({
					to: channelID,
					message: answer
				});	
			break;
			case 'roll':
				if(parameter == null) parameter = 100;
				var rand = Math.floor(Math.random() * parameter);
				bot.sendMessage({
					to: channelID,
					message: rand
				});	
			break;
			case 'help':
				bot.sendMessage({
					to: channelID,
					message: " !roll {range} \n!flip \n!reee \n!weather {city} \n!ranked {summoner_id} \n!bing \n!day {location}"
				});	
			break;
			case 'join':
				bot.joinVoiceChannel(user_ID, function(error, events){
					if (error) return console.error(error);
					events.on('speaking', function(userID, SSRC, speakingBool) {
						console.log("%s is " + (speakingBool ? "now speaking" : "done speaking"), userID );
					});
					bot.getAudioContext(user_ID, function(error, stream){
						if (error) return console.error(error);
						fs.createReadStream('music.mp3').pipe(stream, { end: false });
						stream.on('done', function(){
							bot.leaveVoiceChannel(bot_ID);
						});
					});
				});
				console.log(user_ID);
			break;
			case 'leave':
				bot.leaveVoiceChannel(bot_ID);	
			break;
            case 'play':
                //Let's join the voice channel, the ID is whatever your voice channel's ID is.
                bot.joinVoiceChannel('403750974205853706', function (error, events) {
                    //Check to see if any errors happen while joining.
                    if (error) return console.error(error);

                    //Then get the audio context
                    bot.getAudioContext('403750974205853706', function (error, stream) {
                        //Once again, check to see if any errors exist
                        if (error) return console.error(error);

                        //Create a stream to your file and pipe it to the stream
                        //Without {end: false}, it would close up the stream, so make sure to include that.
                        fs.createReadStream('music.mp3').pipe(stream, { end: false });

                        //The stream fires `done` when it's got nothing else to send to Discord.
                        stream.on('done', function () {
                            //Handle
                        });
                    });
                });
                break;
			case 'day':
				async.waterfall([
					function(callback) {
						sun.getCoords(parameter, (coords) => {
							callback(null, coords);
						});
					},
					function(coords, callback) {
						// do some more stuff ..
						sun.getDay(coords, (temp) => {
							callback(null, temp);
						});
					}
				],
				// optional callback
				function(err, results) {
					bot.sendMessage({
						to: channelID,
						message: results
					});
					// results is now equal to ['one', 'two']
				});
			break;
			case 'weather':
				async.waterfall([
					function(callback) {
						weather.getCoords(parameter, (coords) => {
							callback(null, coords);
						});
					},
					function(coords, callback) {
						// do some more stuff ...
						weather.getTemp(coords, (temp) => {
							callback(null, temp);
						});
					}
				],
				// optional callback
				function(err, results) {
					bot.sendMessage({
						to: channelID,
						message: '**' + results[1] + ', ' + results[2] + '** '+ results[7] +'\n```Temperature: ' + Math.round((results[0]-273.15)).toString() + ' degrees celcius \nSky: ' + results[5] + '\nWind: ' + results[3] + ' Km/h in the ' + results[4] + ' direction\nHumidity: ' + results[6] + '%```'
					});
					// results is now equal to ['one', 'two']
				});
			break;
			case 'ranked':
				async.waterfall([
					function(callback) {
						league.getSummonerId(parameter, (id) => {
							console.log("fetching id");
							console.log(id);
							callback(null, id);
						});
					},
					function(id, callback) {
                        league.getRanked(id, (ratio) => {
                            callback(null, ratio);
                        });
                    }                    
				],
				 // optional callback
                function(err, results) {
                	if (results[5] ==  true) {
                    	bot.sendMessage({
	                        to: channelID,
	                        message: ':fire: :fire: :fire: \n ```Win/Loss: ' + results[0] + '/' + results[1] + " - " + Math.round((results[0]/(results[0] + results[1]))*100, 0)  + "% \n"+
	                        		 results[2] + " " + results[3] + " - " + results[4] + " LP```"
	                    });
                    }else{
                    	bot.sendMessage({
	                        to: channelID,
	                        message: '```Win/Loss: ' + results[0] + ' / ' + results[1] + " - " + Math.round((results[0]/(results[0] + results[1]))*100, 0)  + "% \n"+
	                        		 results[2] + " " + results[3] + " - " + results[4] + " LP```"
	                    });
                	}
                    if (results[5] ==  true) {

                    }
                    // results is now equal to ['one', 'two']
                });
			break;
			case 'rl':
				console.log("yo is this working?");
				async.waterfall([
					function(callback) {
						rl.getPlayer(parameter, (stats) => {
							console.log(stats);
							callback(null, stats);
						});
					}
				],
				function(err, results) {
					bot.sendMessage({
						to: channelID,
						message: results
					});
				});
			break;
         }
     }
});
//AIzaSyD0a9JWT3wqRsJ_psa-K0d7dqAzZqjbAiE 
//53623a4cbf5ea5fa7fddd093b6a049b6