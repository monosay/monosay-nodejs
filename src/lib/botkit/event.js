/**
 * Initialization.
 * @param session object for the current conversation.
 * @param name event name for user.
 * @param data event data.
 */
exports.event = function(request, session, name, data) {
    console.debug('[CALLBACK] Event received.');
};