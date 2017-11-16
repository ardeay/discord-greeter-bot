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


const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('EchoBot back on!')
}

const server = http.createServer(requestHandler)

server.listen(process.env.PORT || port, function(){
  client.on('ready', function (evt) {
      logger.info('Connected');
      logger.info('Logged in as: ');
      logger.info(client.username + ' - (' + client.id + ')');
  });


  console.log("Express server listening on port %d", this.address().port);
});


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var emote_array = {
  ':xc:' : '<:xc:380567858637307905>',
  ':green:' : '<:green:380567936575733761>',
  ':white:' : '<:white:380568001839104000>',
  ':red:' : '<:red:380567959019716631>',
  ':black:' : '<:black:380567912487976971>',
  ':blue:' : '<:blue:380567925066825728>',
  ':colorless:' : '<:colorless:380567843563110400>',
  ':zeroc:' : '<:zeroc:380567828920664065>',
  ':onec:' : '<:onec:380567470408204309>',
  ':twoc' : '<:twoc:380567494907396099>',
  ':threec:' : '<:threec:380567519611584513>',
  ':fourc:' : '<:fourc:380567538771296257>',
  ':fivec:' : '<:fivec:380567554441216000>',
  ':sixc:' : '<:sixc:380567571247923200>',
  ':sevenc:' : '<:sevenc:380567585999028235>',
  ':eightc:' : '<:eightc:380567597881491458>',
  ':ninec:' : '<:ninec:380567616265388042>',
  ':tenc:' : '<:tenc:380567663149318154>',
  ':elevenc:' : '<:elevenc:380567683571253254>',
  ':twelvec:' : '<:twelevec:380567704119279627>',
  ':thirteenc:' : '<:thirteenc:380567721840082944>',
  ':fourteenc:' : '<:fourteenc:380567743759515651>',
  ':fifteenc:' : '<:fifteenc:380567760226484227>',
}

String.prototype.replaceSymbols = function() {
  var replaceString = this;
  for (var key in emote_array) {
      replaceString = replaceString.replace(key, emote_array[key]);
  }
  return replaceString;
};

client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
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
            // !ping <:soontm:230340006219087873>
            case 'test_emote':
                client.sendMessage({ to: channelID, message: '<:onec:380567470408204309>' });
                break;

            case 'test_embed':
                  client.sendMessage({ to: channelID, message: 'test' });

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

                        client.sendMessage({ to: channelID, message: body.replaceSymbols() });
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
