const Telegraf = require('telegraf')
const monosay = require('../../').usetelegraf("3e4f49ad6dd446928e2bfab6d6992144");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

monosay.init(bot);

bot.start((ctx) => {
    console.log('started:', ctx.from.id)
    monosay.user({
        channelUserId: ctx.from.id,
        name: ctx.from.first_name,
        surname: ctx.from.last_name,
        userName: ctx.from.username
    }, /*success callback*/ null, /*error callback*/ null);
    return ctx.reply('Welcome!')
})

bot.command('help', (ctx) => ctx.reply('Try send a sticker!'))
bot.hears('hi', (ctx) => ctx.reply('Hey there!'))
bot.hears('who am i', (ctx) => ctx.reply('I know who you are! 😌 You are! 😗'))
bot.hears('You know nothing Jon Snow!', (ctx) => ctx.reply('See you later! 😎 But I\'m not John Snow!'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy!'))
bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.startPolling()