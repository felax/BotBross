var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var cmd = require('./commands.js');

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
		cmd.commands(bot, message, user, userID, channelID, evt);
    }
});
//AIzaSyD0a9JWT3wqRsJ_psa-K0d7dqAzZqjbAiE 
//53623a4cbf5ea5fa7fddd093b6a049b6