var builder = require("botbuilder");
const monosay = require("../../").usebotframework(process.env.MONOSAY_BOT_TOKEN);

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function(session) {
	session.send("You said: %s", session.message.text);
	// Data
	monosay.data("feedback").save(
		{
			thoughts: session.message.text,
			userid: session.message.user.id
		},
		function() {
			session.send("Thank you!");
		},
		function() {
			session.send("Something is wrong.");
		}
	);
	// Event
	monosay.event(session, "USER_SAVED_THOUGHTS", { userid: session.message.id });
    
    // Session
    // Start a new session for your user
    monosay.session(session).start();
    // End your user's current session
	monosay.session(session).end();
    // Make your user's session private
    monosay.session(session).private();
    // Make your user's session public
	monosay.session(session).public();
}).set("storage", monosay.storage);

monosay.init(bot);
