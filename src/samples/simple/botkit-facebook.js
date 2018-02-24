var Botkit = require('botkit');

const monosay = require('../../').usebotkit(process.env.MONOSAY_BOT_TOKEN);

var controller = Botkit.facebookbot({
    access_token: process.env.access_token,
    verify_token: process.env.verify_token,
    validate_requests: true,
    app_secret: process.env.app_secret
})

monosay.init(controller);

var bot = controller.spawn({});

controller.on('message_received', function(bot, message) {
    bot.getMessageUser(message, function(err, user) {
        monosay.user({
            channelUserId: user.id,
            name: user.first_name,
            surname: user.last_name,
            email: user.email
        }, /*success callback*/ null, /*error callback*/ null);
    });
    return true;
});

controller.setupWebserver(process.env.port, function(err, webserver) {
    controller.createWebhookEndpoints(controller.webserver, bot, function() {
        console.log('Your bot is online.');
    });
});

controller.hears(['hello'], 'message_received', function(bot, message) {
    bot.reply(message, 'Hey there.');
});

controller.hears(['cookies'], 'message_received', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        });
    });
});