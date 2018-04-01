const restify = require('restify');
const builder = require('botbuilder');
const monosay = require('../../').usebotframework(process.env.MONOSAY_BOT_TOKEN);
const request = require('request');

const ACTIONS = {
  REMOVE: "Remove",
  CANCEL: "Cancel",
  ACCEPT: "Accept"
};

const DATA = {
  COLLECTION_NAME: "thoughts"
};

var connector = new builder.ChatConnector({
  appId: process.env.BOT_MS_APP_ID,
  appPassword: process.env.BOT_MS_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector).set("storage", monosay.storage());

monosay.init(bot);

bot.dialog('/name', [
  function (session) {
    session.send("I need your name to start.");
    builder.Prompts.text(session, "So, please type your name");
  },
  function (session, results) {
    if (results.response && results.response.trim().length > 0) {
      session.send("You entered '%s'", results.response);
      session.userData.name = results.response;
      session.replaceDialog("/");
    } else {
      session.replaceDialog('/name')
    }
  }
]);

bot.dialog("/", [
  function (session) {
    update_monosay_user_info(session);

    if (!session.userData.name) {
      session.beginDialog("/name");
    } else {
      try {
        session.send(`Hi ${session.userData.name}, Welcome!`);
        builder.Prompts.text(session, "Can you share your thoughts with me?");
      } catch (error) {
        session.send("Something is wrong. Let's start over!");
        session.beginDialog("/goodbye");
        console.log(error);
      }
    }
  },
  function (session, results) {
    if (results.response != null) {
      session.send("I'm saving this: " + results.response);

      monosay
        .data(DATA.COLLECTION_NAME)
        .save({
          userid: session.message.user.id,
          text: results.response
        }, function (status) {
          session.send("I saved your data and your data id is " + status.data.id);
          session.userData.lastData = status.data;
        }, function (status) {
          if (status) {
            session.send(status.message || "Something is wrong.");
            status.errors && status.errors.forEach(err => {
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
  function (session, args) {
    builder.Prompts.choice(session, "I will remove your last data. Are you sure?", ACTIONS.REMOVE + "|" + ACTIONS.CANCEL, {
      listStyle: builder.ListStyle.button
    })
  },
  function (session, results) {
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
  function (session, args) {
    session.sendTyping();
    monosay
      .data(DATA.COLLECTION_NAME)
      .delete(session.userData.lastData.id,
        function () {
          session.send("OK, It's done!");
        },
        function () {
          session.send("Something is wrong!");
        });
  }
]).triggerAction({
  matches: /\/remove/i
});

bot.dialog('/get', [
  function (session, args) {
    builder.Prompts.text(session, "Type your data id");
  },
  function (session, results) {
    if (results.response) {
      monosay
        .data(DATA.COLLECTION_NAME)
        .get(results.response,
          function (status) {
            if (status.data != null) {
              session.send("I found it. ");
              session.send("Your data is: " + status.data.text);
              session.userData.lastData = status.data;
            } else {
              session.send("Something is wrong.");
            }
          },
          function (status) {
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
  function (session, args) {
    builder.Prompts.choice(session, "I will remove your last data. Are you sure?", [ACTIONS.REMOVE, ACTIONS.CANCEL], {
      listStyle: builder.ListStyle.button
    })
  },
  function (session, results) {
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
  function (session, args) {
    session.sendTyping();
    monosay
      .data(DATA.COLLECTION_NAME)
      .delete(session.userData.lastData.id,
        function () {
          session.send("OK, It's done!");
        },
        function () {
          session.send("Something is wrong!");
        });
  }
]).triggerAction({
  matches: /\/update/i
});

bot.dialog("/goodbye", function (session) {
  session.sendTyping();
  session.send("See you later! 🤗");
  session.endConversation();
  session.endDialog();
  monosay.end(session);
}).triggerAction({
  matches: /\/goodbye/i
});

bot.dialog('/help', [
  function (session) {
    session.sendTyping();
    session.send("Global commands that are available anytime:\n\n" +
      "* apps - Returns to Application List.\n" +
      "* goodbye - End this conversation.\n" +
      "* help - Displays these commands.");
  }
]).triggerAction({
  matches: /\/help/i
});

/** HELPERS **/
function update_monosay_user_info(session) {
  request.get({
    url: process.env.BOT_FB_GRAPHAPI_URL + session.message.user.id + "?fields=id,name,picture,email,first_name,last_name",
    headers: {
      Authorization: "Bearer " + process.env.BOT_FB_TOKEN
    }
  }, function (err, httpResponse, body) {
    if (!err && httpResponse.statusCode == 200 && body) {
      var user = JSON.parse(body);
      monosay.user({
        channelUserId: user.id,
        name: user.first_name,
        surname: user.last_name,
        profilePhotoUrl: user.picture.data.url,
        email: user.email
      }, /*success callback*/ null, /*error callback*/ null);
    }
  });
}
/** HELPERS **/

var server = restify.createServer();
server.post('/', connector.listen());
server.listen(process.env.port || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});
