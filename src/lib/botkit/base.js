module.exports = function(request) {

    function trimSession(session) {
        return {
            adress: session.adress,
            agent: session.agent,
            attachments: session.attachments,
            entities: session.entities,
            source: session.source,
            sourceEvent: session.sourceEvent,
            text: session.text,
            timestamp: session.timestamp,
            type: session.type,
            user: session.user,
            userData: session.userData,
            conversationData: session.conversationData
        };
    }

    return {
        user: function(data, successCallback, errorCallback) {
            try {
                request({
                    url: "/channelusers",
                    body: JSON.stringify(data),
                    method: 'POST'
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
                                if (successCallback) {
                                    successCallback(data)
                                }
                            } else {
                                if (errorCallback) {
                                    errorCallback(data);
                                }
                            }
                        } else {
                            if (errorCallback) {
                                errorCallback(data);
                            }
                        }
                    }
                });
            } catch (error) {
                console.error(error);
            }
        },
        /**
         * Initialization.
         * @param session object for the current conversation.
         * @param next callback method for bot.
         */
        send: function(session, next) {
            try {
                var json = JSON.stringify({
                    data: session,
                    channelUserId: session.address.user.id,
                    time: new Date(),
                    isBot: true
                });
                request({
                    url: "/platform",
                    body: json,
                    method: 'POST'
                }, function(error, response, body) {
                    if (error) {
                        next(error);
                    } else if (response.statusCode != 200 || response.statusCode != 201) {
                        next(new Error("Error from MonoSay API"));
                    } else {
                        next();
                    }
                });
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Initialization.
         * @param session object for the current conversation.
         * @param next callback method for bot.
         */
        receive: function(session, next) {
            try {
                request({
                    url: "/platform",
                    body: JSON.stringify({
                        data: session,
                        channelUserId: session.user.id,
                        time: new Date()
                    }),
                    method: 'POST'
                }, function(error, response, body) {
                    if (error) {
                        next(error);
                    } else if (response.statusCode != 200 || response.statusCode != 201) {
                        next(new Error("Error from MonoSay API"));
                    } else {
                        next();
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
}