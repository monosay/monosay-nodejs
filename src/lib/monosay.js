'use strict';

var request = require("request");

exports.config = {
    apiUrl: process.env.MONOSAY_API_URL || 'https://api.monosay.com/v1/',
    token: null,
    headers: {
        "Content-Type": "application/json",
        "Authorization": null
    }
}

/**
 * Initialization.
 * @param bot Initialization for middleware.
 */
exports.usebotframework = function(bot, token, userConfig) {

    if (!token) {
        console.error("MonoSay Bot Token is not found.");
        throw "You set your bot token.";
    }

    console.debug("MonoSay Initialized for Microsoft Bot Framework.");

    Object.assign(this.config, userConfig);
    console.debug("MonoSay API Url is " + this.config.apiUrl);

    request = request.defaults({ baseUrl: this.config.apiUrl });

    this.config.headers["Authorization"] = "Bot " + token;

    bot.use({
        receive: this.receive,
        send: this.send
            /*,
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
}

/**
 * Initialization.
 * @param session object for the current conversation.
 * @param next callback method for bot.
 */
exports.send = function(session, next) {
    request({
        url: "/platform",
        body: JSON.stringify({
            data: session,
            channelUserId: session.message.user.id,
            time: session.timestamp
        }),
        method: 'POST',
        headers: this.config.headers
    }, function(error, response, body) {
        if (error) {
            next(error);
        } else if (response.statusCode != 200 || response.statusCode != 201) {
            next(new Error("Error from MonoSay API"));
        } else {
            next();
        }
    });
}

/**
 * Initialization.
 * @param session object for the current conversation.
 * @param next callback method for bot.
 */
exports.receive = function(session, next) {
    request({
        url: "/platform",
        body: JSON.stringify({
            data: session,
            channelUserId: session.message.user.id,
            time: session.timestamp
        }),
        method: 'POST',
        headers: this.config.headers
    }, function(error, response, body) {
        if (error) {
            next(error);
        } else if (response.statusCode != 200 || response.statusCode != 201) {
            next(new Error("Error from MonoSay API"));
        } else {
            next();
        }
    });
};

/**
 * End user's session.
 * @param {string} id 
 */
exports.endsession = function(id) {
    request({
        url: "/platform/endsession/" + id,
        body: JSON.stringify(content),
        method: 'POST',
        headers: exports.config.headers
    }, function(error, response, body) {
        if (error) {
            errorCallback(error);
        } else {
            var json = null;
            var data = null;
            if (body) {
                var data = JSON.parse(body);
            }
            successCallback(data);
        }
    });
}

/**
 * Save your data to MonoSay Backend.
 * @param {string} name Your collection name.
 */
exports.data = function(name) {
    var dataUrl = "/data/" + name;
    return {
        /**
         * Save your data.
         * @param {object} content Your data.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        save: function(content, successCallback, errorCallback) {
            request({
                url: dataUrl,
                body: JSON.stringify(content),
                method: 'POST',
                headers: exports.config.headers
            }, function(error, response, body) {
                if (error) {
                    errorCallback(error);
                } else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }

                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } else {
                        errorCallback(data);
                    }
                }
            });
        },
        /**
         * Delete your data.
         * @param {string} id Your data identifier.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        delete: function(id, successCallback, errorCallback) {
            request({
                url: dataUrl + "/" + id,
                method: 'DELETE',
                headers: exports.config.headers
            }, function(error, response, body) {
                if (error) {
                    errorCallback(error);
                } else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }

                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } else {
                        errorCallback(data);
                    }
                }
            });
        },
        /**
         * Get your data by ,d.
         * @param {string} id Your data identifier.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        get: function(id, successCallback, errorCallback) {
            request({
                url: dataUrl + "/" + id,
                method: 'GET',
                headers: exports.config.headers
            }, function(error, response, body) {
                if (error) {
                    errorCallback(error);
                } else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }

                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } else {
                        errorCallback(data);
                    }
                }
            });
        },
        /**
         * Get your data by ,d.
         * @param {object} filter Filter your data.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        list: function(filter, successCallback, errorCallback) {
            request({
                url: dataUrl + "/" + id,
                method: 'POST',
                body: JSON.stringify(filter),
                headers: exports.config.headers
            }, function(error, response, body) {
                if (error) {
                    errorCallback(error);
                } else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }

                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } else {
                        errorCallback(data);
                    }
                }
            });
        }
    }
}

/**
 * Initialization.
 * @param session object for the current conversation.
 * @param name event name for user.
 * @param data event data.
 */
exports.event = function(session, name, data) {
    console.debug('[CALLBACK] Event received.');
};