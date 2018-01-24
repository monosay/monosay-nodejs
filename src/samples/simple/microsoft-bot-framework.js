var builder = require('botbuilder');
const monosay = require('../../').usebotframework("ASDKAWHDGAJWGDAWDHAW");

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function(session) {
    session.send("You said: %s", session.message.text);
    // Data
    monosay.data("etkinlik_geribildirim").save({
        'dusuncesi': session.message.text,
        'kullanici_id': session.message.user.id
    }, function() {
        session.send("Teşekkürler, geri bildirimini aldım.");
    }, function() {
        session.send("Bir problem var. Lütfen tekrar dene.");
    });
    // Event
    monosay.event(session, "USER_SAVED_THOUGHTS", { userid: session.message.id });
}).set("storage", monosay.storage);

monosay.init(bot);