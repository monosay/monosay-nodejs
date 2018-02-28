module.exports = function(token, userConfig) {
    var core = require("./../core");

    if (!token) {
        console.error("MonoSay Bot Token is not found.");
        throw "You set your bot token.";
    }

    console.debug("MonoSay Initialized for Jovo.");

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

    return {
        init: function(app) {
            app.on("respond", function(jovoApp) {
                var requestObject = jovoApp.getRequestObject();
                var responseObject = jovoApp.getResponseObject();
                var userId = jovoApp.getUserId();

                var source = "unknown";
                if (jovoApp.isGoogleAction()) {
                    source = "google";
                }
                if (jovoApp.isAlexaSkill()) {
                    source = "alexa";
                }
                try {
                    request({
                        url: "/platform",
                        body: JSON.stringify({
                            data: {
                                source: source,
                                request: requestObject
                            },
                            channelUserId: userId,
                            time: new Date(new Date().getTime()),
                            isBot: false
                        }),
                        method: 'POST'
                    }, function(error, response, body) {
                        if (error) {
                            console.error(error);
                        } else if (response.statusCode != 200 && response.statusCode != 201) {
                            console.log("Error from MonoSay API");
                            response.body && console.log(response.body);
                        } else {}
                    });
                } catch (error) {
                    console.error(error);
                }

                try {
                    request({
                        url: "/platform",
                        body: JSON.stringify({
                            data: {
                                source: source,
                                request: requestObject,
                                response: responseObject
                            },
                            channelUserId: userId,
                            time: new Date(new Date().getTime() + 1),
                            isBot: true
                        }),
                        method: 'POST'
                    }, function(error, response, body) {
                        if (error) {
                            console.error(error);
                        } else if (response.statusCode != 200 && response.statusCode != 201) {
                            console.log("Error from MonoSay API");
                            response.body && console.log(response.body);
                        } else {}
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