const Telegraf = require("telegraf");
const monosay = require("../../").usetelegraf(process.env.MONOSAY_BOT_TOKEN);

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

monosay.init(bot);

bot.start(ctx => {
	console.log("started:", ctx.from.id);
	monosay.user(
		{
			channelUserId: ctx.from.id,
			name: ctx.from.first_name,
			surname: ctx.from.last_name,
			userName: ctx.from.username
		},
		/*success callback*/ null,
		/*error callback*/ null
	);
	return ctx.reply("Welcome!");
});

bot.catch(err => {
	console.log("Ooops", err);
});

bot.command("event", ctx => {
	var promises = [];

	promises.push(ctx.reply("Event saving."));

	return promises;
});
bot.command("help", ctx => ctx.reply("Try send a sticker!"));
bot.hears("hi", ctx => ctx.reply("Hey there!"));
bot.hears("who am i", ctx => ctx.reply("I know who you are! 😌 You are! 😗"));
bot.hears("You know nothing Jon Snow!", ctx => ctx.reply("See you later! 😎 But I'm not John Snow!"));
bot.hears(/buy/i, ctx => ctx.reply("Buy-buy!"));
bot.on("sticker", ctx => ctx.reply("👍"));

//  Burada direk mesaj ve reply monosay'de gözükmüyor.
bot.on("text", ctx => {
	return Promise.all([ctx.telegram.sendMessage(ctx.message.chat.id, `Hey! ${ctx.from.first_name},`), ctx.reply("This is a text!")]);
});

//bot.on('text', (ctx) => ctx.reply('Hello World'))

bot.startPolling();
