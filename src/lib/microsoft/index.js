module.exports = function (token, userConfig) {
  var core = require("./../core");

  if (!token) {
    console.error("MonoSay Bot Token is not found.");
    throw "You set your bot token.";
  }

  console.debug("MonoSay Initialized for Microsoft Bot Framework.");

  Object.assign(core.config, userConfig);
  console.debug("MonoSay API Url is " + core.config.apiUrl);

  core.config.headers["Authorization"] = "Bot " + token;

  const request = require("request").defaults({
    baseUrl: core.config.apiUrl,
    headers: core.config.headers
  });

  const base = require("./base")(request);
  const data = require("./data");
  const event = require("./event");
  const storage = require("./storage");

  return {
    base: base,
    request: request,
    init: function (bot) {
      bot.use({
        receive: base.receive,
        send: base.send
        /*
        botbuilder: function(session, next) {
            if (/^\/log on/i.test(session.message.text)) {
                session.userData.isLogging = true;
                session.send('Logging is now turned on');
            } else if (/^\/log off/i.test(session.message.text)) {
                session.userData.isLogging = false;
                session.send('Logging is now turned off');
            } else {
                if (session.userData.isLogging) {
                    console.log('Message Received: ', session.message.text);
                }
                next();
            }
        }*/
      });
    },
    start: base.start,
    end: base.end,
    user: base.user,
    data: function (name) {
      return data(request, name);
    },
    event: function (session, name, data) {
      return event(request, session, name, data);
    },
    storage: function () {
      var _this = this;
      var _storage = new storage.MonoSayBotStorage(_this);
      return _storage;
    }
  }
}
