module.exports = function(token, userConfig) {
    var core = require("./../core");

    if (!token) {
        console.error("MonoSay Bot Token is not found.");
        throw "You set your bot token.";
    }

    console.debug("MonoSay Initialized for Botkit.");

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

    _getContextJson = function(message) {
        return JSON.stringify({
            data: {
                message: message
            },
            channelUserId: message.sender.id,
            time: new Date(),
            isBot: false
        });
    };

    _getContextJsonForBot = function(message) {
        return JSON.stringify({
            data: {
                message: message,
            },
            channelUserId: message.to,
            time: new Date(),
            isBot: true
        });
    };

    return {
        init: function(controller) {
            // Log every message recieved
            controller.middleware.receive.use(function(bot, message, next) {
                // Send to {mono}say
                try {
                    var body = _getContextJson(message);
                    request({
                        url: "/platform",
                        body: body,
                        method: 'POST'
                    }, function(error, response, body) {
                        if (error) {
                            console.error(error);
                        } else if (response.statusCode != 200 && response.statusCode != 201) {
                            console.log("Error from MonoSay API");
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
                // continue processing the message
                next();
            });

            // Log every message sent
            controller.middleware.send.use(function(bot, message, next) {
                // Send to {mono}say
                try {
                    var body = _getContextJsonForBot(message);
                    request({
                        url: "/platform",
                        body: body,
                        method: 'POST'
                    }, function(error, response, body) {
                        if (error) {
                            console.error(error);
                        } else if (response.statusCode != 200 && response.statusCode != 201) {
                            console.log("Error from MonoSay API");
                        }
                    });
                } catch (error) {
                    console.error(error);
                }

                // continue processing the message
                next();

            });
        },
        start: base.start,
        end: base.end,
        user: base.user,
        data: function(name) {
            return data(request, name);
        },
        event: function(session, name, data) {
            return event(request, session, name, data);
        },
        storage: storage
    }
}