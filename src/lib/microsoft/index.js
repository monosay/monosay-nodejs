module.exports = function(token, userConfig) {
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
	const data = require("./../base/data");
    const event = require("./../base/event");
	const storage = require("./storage");
	const defaultSession = require("./../base/session").default;

	return {
		base: base,
		request: request,
		init: function(bot) {
			bot.use({
				receive: base.receive,
				send: base.send
			});
		},
		start: base.start,
		end: base.end,
		user: base.user,
		data: function(name) {
			return data(request, name);
		},
		event: function(userId, name, data) {
			return event(request, userId, name, data);
		},
		storage: function() {
			var _this = this;
			var _storage = new storage.MonoSayBotStorage(_this);
			return _storage;
		},
		session: function(session) {
			var session = defaultSession(this);
			return session;
		}
	};
};
