var restify = require('restify');
var builder = require('botbuilder');
var monosay = require('../lib/monosay');

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

var botAppId = process.env.BOT_MS_APP_ID;
var botAppPassword = process.env.BOT_MS_APP_PASSWORD;

console.log("Your BOT_MS_APP_ID is " + botAppId);

const ACTIONS = {
    REMOVE: "Remove",
    CANCEL: "Cancel",
    ACCEPT: "Accept"
};

var connector = new builder.ChatConnector({
    appId: botAppId,
    appPassword: botAppPassword
});

var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector).set("storage", inMemoryStorage);
const DATA = {
    COLLECTION_NAME: "thoughts"
};

monosay.usebotframework(bot, process.env.MONOSAY_BOT_TOKEN);

bot.dialog("/", [
    function(session) {
        try {
            builder.Prompts.text(session, "Hi there! Can you share your thoughts with me?");
        } catch (error) {
            session.send("Something is wrong. Let's start over!");
            session.beginDialog("/goodbye");
            console.log(error);
        }
    },
    function(session, results) {
        if (results.response != null) {
            session.send("I'm saving this: " + results.response);
            monosay
                .data(DATA.COLLECTION_NAME)
                .save({
                    userid: session.message.user.id,
                    text: results.response
                }, function(status) {
                    session.send("I saved your data and your data id is " + status.data.id);
                    session.userData.lastData = status.data;
                }, function(status) {
                    if (status) {
                        session.send(status.message || "Something is wrong.");
                        status.errors &&  status.errors.forEach(err => {
                            session.send(err.message + " (" + err.internalMessage + ")");
                        });
                        console.debug("STATUS:" + status.message + ", INTERNAL: " + status.internalMessage)
                    } else {
                        session.send("Something is wrong!");
                    }
                });

        } else {
            session.send("I didn't understand.");
            session.replaceDialog("/");
        }
    }
]);

bot.dialog('/remove', [
    function(session, args) {
        builder.Prompts.choice(session, "I will remove your last data. Are you sure?", ACTIONS.REMOVE + "|" + ACTIONS.CANCEL, { listStyle: builder.ListStyle.button })
    },
    function(session, results) {
        if (results.response.entity === ACTIONS.REMOVE) {
            if (session.userData.lastData) {
                builder.Prompts.confirm(session, "I will remove it '" + session.userData.lastData.text + "'. Are you sure? Type 'yes'.");
            } else {
                session.send("You don't have last data. Add it first.");
                session.replaceDialog("/");
            }
        } else {
            session.send("OK, I have canceled.");
            session.replaceDialog("/");
        }
    },
    function(session, args) {
        session.sendTyping();
        monosay
            .data(DATA.COLLECTION_NAME)
            .delete(session.userData.lastData.id,
                function() {
                    session.send("OK, It's done!");
                },
                function() {
                    session.send("Something is wrong!");
                });
    }
]).triggerAction({
    matches: /\/remove/i
});

bot.dialog('/get', [
    function(session, args) {
        builder.Prompts.text(session, "Type your data id");
    },
    function(session, results) {
        if (results.response) {
            monosay
                .data(DATA.COLLECTION_NAME)
                .get(results.response,
                    function(status) {
                        if (status.data != null) {
                            session.send("I found it. ");
                            session.send("Your data is: " + status.data.text);
                            session.userData.lastData = status.data;
                        } else {
                            session.send("Something is wrong.");
                        }
                    },
                    function(status) {
                        session.send("I couldn't find your data.");
                    });
        } else {
            session.send("You didn't type it.");
            session.replaceDialog("/get");
        }
    }
]).triggerAction({
    matches: /\/get/i
});

bot.dialog('/update', [
    function(session, args) {
        builder.Prompts.choice(session, "I will remove your last data. Are you sure?", [ACTIONS.REMOVE, ACTIONS.CANCEL], { listStyle: builder.ListStyle.button })
    },
    function(session, results) {
        if (results.response.entity === ACTIONS.REMOVE) {
            if (session.userData.lastData) {
                builder.Prompts.confirm(session, "I will update it '" + session.userData.lastData.text + "'. Are you sure? Type 'yes'.");
            } else {
                session.send("You don't have last data. Add it first.");
                session.replaceDialog("/");
            }
        } else {
            session.send("OK, I have canceled.");
            session.replaceDialog("/");
        }
    },
    function(session, args) {
        session.sendTyping();
        monosay
            .data(DATA.COLLECTION_NAME)
            .delete(session.userData.lastData.id,
                function() {
                    session.send("OK, It's done!");
                },
                function() {
                    session.send("Something is wrong!");
                });
    }
]).triggerAction({
    matches: /\/update/i
});

bot.dialog("/goodbye", function(session) {
    session.sendTyping();
    session.send("See you later! 🤗");
    session.endConversation();
    session.endDialog();
    monosay.endsession();
});

bot.dialog('/help', [
    function(session) {
        session.sendTyping();
        session.send("Global commands that are available anytime:\n\n" +
            "* apps - Returns to Application List.\n" +
            "* goodbye - End this conversation.\n" +
            "* help - Displays these commands.");
    }
]);

var server = restify.createServer();
server.post('/', connector.listen());
server.listen(process.env.port || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});