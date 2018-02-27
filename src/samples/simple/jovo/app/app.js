'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const { App } = require('jovo-framework');
const monosay = require('../../../../').usejovo("a9f3996c12164226879f85a6029eb320", {
    apiUrl: "http://localhost:8090/v1/"
});

const config = {
    logging: false,
};

const app = new App(config);
monosay.init(app);

app.addDashbotGoogleAction("4mvQzXsVWwhO991Z1RsGs1m4Z1pbdRNB87V5yDIs");

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you!');
    },
    "Default Fallback Intent": function() {
        this.tell("Hey! I didn't get that. Sorry about that! Let's try again.");
    }
});

module.exports.app = app;