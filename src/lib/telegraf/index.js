module.exports = function (token, userConfig) {
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
    const data = require("./../base/data");
    const event = require("./event");
    const storage = require("./storage").MonoSayBotStorage();

    _getContextJson = function (ctx, bodyItself) {
        try {
            var value = {
                channelUserId: ctx.chat.id,
                time: new Date(),
                isBot: ctx.from.is_bot
            };

            if (ctx.callbackQuery) {
                value.data = ctx.callbackQuery;
            }
            else {
                if (bodyItself) {
                    value.data = ctx;
                }
                else {
                    value.data = {
                        message: ctx.message
                    };
                }
            }

            return JSON.stringify(value);
        } catch (error) {
            return null;
        }
    };

    return {
        init: function (bot) {
            bot.use(function ({ message, update }, next) {
                if (!message) {
                    return next();
                }
                // message.text = aliasToCommand(message.text);
                next()
            });

            bot.use((ctx, next) => {
                try {
                    if (ctx && ctx.inlineQuery) {
                        return next();
                    }

                    var body = _getContextJson(ctx);

                    if (!body) {
                        return next();
                    }

                    request({
                        url: "/platform",
                        body: body,
                        method: 'POST'
                    }, function (error, response, body) {
                        if (error) {
                            console.error(error);
                        } else if (response.statusCode != 200 && response.statusCode != 201) {
                            console.log("Error from MonoSay API");
                        } else {
                            next(ctx).then((nctx) => {
                                if (!nctx) {
                                    return;
                                }

                                if (Array.isArray(nctx)) {
                                    nctx.map((nextitem) => {
                                        if (!nextitem) {
                                            return;
                                        }

                                        var body = _getContextJson(nextitem, true);

                                        if (!body) {
                                            return;
                                        }

                                        request({
                                            url: "/platform",
                                            body: body,
                                            method: 'POST'
                                        }, function (error, response, body) {
                                            if (error) {
                                                console.error(error);
                                            } else if (response.statusCode != 200 && response.statusCode != 201) {
                                                console.log("Error from MonoSay API");
                                            } else { }
                                        });
                                    });
                                } else {

                                    var body = _getContextJson(nctx, true);
                                    if (!body) {
                                        return;
                                    }

                                    request({
                                        url: "/platform",
                                        body: body,
                                        method: 'POST'
                                    }, function (error, response, body) {
                                        if (error) {
                                            console.error(error);
                                        } else if (response.statusCode != 200 && response.statusCode != 201) {
                                            console.log("Error from MonoSay API");
                                        } else { }
                                    });
                                }
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
        data: function (name) {
            return data(request, name);
        },
        event: function (session, name, data) {
            return event(request, session, name, data);
        },
        storage: storage
    }
}