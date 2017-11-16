require('dotenv').config()

var Discord = require('discord.io');
var request = require('request');
var logger = require('winston');

const http = require('http')
const port = 3000


// Initialize Discord Bot
var client = new Discord.Client({
    token: process.env.USERTOKEN,
    autorun: true
});

const test_emote = client.emojis.find("name", "onec");

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('EchoBot back on!')
}

const server = http.createServer(requestHandler)

server.listen(process.env.PORT || port, function(){
  client.on('ready', function (evt) {
      logger.info('Connected');
      logger.info('Logged in as: ');
      logger.info(bot.username + ' - (' + bot.id + ')');
  });


  console.log("Express server listening on port %d", this.address().port);
});


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';



client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + bot.id + ')');
});

client.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');

        // console.log(args)

        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
            // !ping
            case 'test_emote':
                client.sendMessage({ to: channelID, message: 'test' + test_emote });
                break;
            case 'card':
                var cardName =  args.join(' ')
                //console.log(cardName)
                // Configure the request
                var options = {
                    url: 'http://dev.echomtg.com/api/discord/card/',
                    method: 'POST',
                    form: {'token': process.env.ECHOKEY, 'text': cardName}
                }

                //console.log(options)

                // Start the request
                request(options, function (error, response, body) {

                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        //console.log(body)

                        client.sendMessage({ to: channelID, message: body });
                    } else {
                        client.sendMessage({ to: channelID, message: 'Error: '+error });

                    }

                })

            break;
            default:
                client.sendMessage({ to: channelID, message: 'Unknown command.' });
        }
    }
})
