var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var sun = require('./sun.js')
const async = require('async')
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
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       var parameter = args[1];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
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
         }
     }
});
