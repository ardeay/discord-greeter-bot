require('dotenv').config()

var Discord = require('discord.io');
var request = require('request');
var logger = require('winston');

const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) { 
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

console.log(process.env)

// Initialize Discord Bot
var bot = new Discord.Client({
    token: process.env.USERTOKEN,
    autorun: true
});


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
client.on("ready", () => {
    client.user.setStatus("online");
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');

        // console.log(args)

        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
            // !ping
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
                    console.log('in teh request '+ response.statusCode)
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        //console.log(body)

                        bot.sendMessage({ to: channelID, message: body });
                    } else {
                        bot.sendMessage({ to: channelID, message: 'Error: '+error });

                    }

                })

            break;
            default:
                bot.sendMessage({ to: channelID, message: 'Unknown command.' });
        }
    }
})
