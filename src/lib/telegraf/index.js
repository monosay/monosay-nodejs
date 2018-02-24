module.exports = function(token, userConfig) {
    var core = require("./../core");

    if (!token) {
        console.error("MonoSay Bot Token is not found.");
        throw "You set your bot token.";
    }

    console.debug("MonoSay Initialized for Telegraf.");

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
    const storage = require("./storage").MonoSayBotStorage();

    _getContextJson = function(ctx, bodyItself) {
        return JSON.stringify({
            data: {
                message: bodyItself ? ctx : ctx.message,
            },
            channelUserId: ctx.chat.id,
            time: new Date(),
            isBot: ctx.from.is_bot
        });
    };

    return {
        init: function(bot) {
            bot.use((ctx, next) => {
                try {
                    var body = _getContextJson(ctx);
                    request({
                        url: "/platform",
                        body: body,
                        method: 'POST'
                    }, function(error, response, body) {
                        if (error) {
                            console.error(error);
                        } else if (response.statusCode != 200 && response.statusCode != 201) {
                            console.log("Error from MonoSay API");
                        } else {
                            next(ctx).then((nctx, lctx) => {
                                if (!nctx) {
                                    return;
                                }
                                request({
                                    url: "/platform",
                                    body: _getContextJson(nctx, true),
                                    method: 'POST'
                                }, function(error, response, body) {
                                    if (error) {
                                        console.error(error);
                                    } else if (response.statusCode != 200 && response.statusCode != 201) {
                                        console.log("Error from MonoSay API");
                                    } else {}
                                });
                            });
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
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