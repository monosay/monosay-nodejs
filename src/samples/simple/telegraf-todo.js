const Telegraf = require("telegraf");
// Define variable monosay and call usetelegraf with your Token
const monosay = require("../../").usetelegraf(process.env.MONOSAY_BOT_TOKEN);

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Initialize the monosay
// After that, you can see all conversations from MonoSay Platform
monosay.init(bot);

const collection = "todo";
const help = "`/add todo description` - will add a new todo\n`/list` - will list your todo \n`/done number` - will set your todo as done\n`/remove number` - will remove your todo";

/**
 * Let's make a todo application via
 * Before using this, please
 * - Add a data collection named "todo" from Data
 * - Add following fields
 * -- userid (string)
 * -- content (string)
 * -- done (bool)
 */

bot.start(ctx => {
	var promises = [];
	promises.push(ctx.reply("Welcome to todo app 😀! " + help));
	monosay.event(ctx.from.id, "STARTED");
	monosay.event(ctx.from.id, "STARTED");
	monosay.event(ctx.from.id, "APPROVE_BUTTON_CLICKED");
	monosay.event(ctx.from.id, "HELP_BUTTON_CLICKED");
	monosay.user(
		{
			channelUserId: ctx.from.id,
			name: ctx.from.first_name,
			surname: ctx.from.last_name,
			userName: ctx.from.username,
			profilePhotoUrl: `https://avatars.io/twitter/${ctx.from.username}`
		},
		/*success callback*/ null,
		/*error callback*/ null
	);

	return promises;
});

bot.help(ctx => ctx.replyWithMarkdown(help));

/**
 * Add a new todo
 */
bot.command("add", ctx => {
	// Remove "/add" from string
	let message = ctx.message.text.substring(5);
	monosay.data(collection).save(
		{
			// userid must be string
			userid: `${ctx.from.id}`,
			content: message,
			done: false
		},
		response => {
			monosay.event(`${ctx.from.id}`, "TODO_SAVED", { title: message });
			return ctx.reply("✅ Saved.");
		},
		error => {
			console.error(error);
			return ctx.reply("❗ Something is wrong with your todo. I couldn't save it.");
		}
	);
});

/**
 * List your todo's
 */
bot.command("list", ctx => {
	monosay
		.data(collection)
		.where("userid", "==", `${ctx.from.id}`)
		.list(
			response => {
				if (response.success) {
					if (response.data.itemCount) {
						let todos = "";
						let number = 0;

						response.data.items.forEach(todo => {
							number++;
							const done = todo.done ? "👍 " : "🌱 ";
							todos += `${number}. ${done} ${todo.content}\n`;
						});
						return ctx.reply(todos);
					} else {
						return ctx.reply("You don't have todo yet. Why don't you try to add?\nIf you need help just type /help");
					}
				} else {
					return ctx.reply("❗ Something is wrong with your todo list.");
				}
			},
			error => {
				console.error(error);
				return ctx.reply("❗ Something is wrong with your todo list.");
			}
		);
});

/**
 * Will set your task as done
 */
bot.command("done", ctx => {
	// Remove "/add" from string
	let todoNumber = parseInt(ctx.message.text.substring(6));
	monosay
		.data(collection)
		.where("userid", "==", `${ctx.from.id}`)
		.page(todoNumber)
		.limit(1)
		.list(response => {
			if (response.success) {
				if (response.data.itemCount) {
					var todo = response.data.items[0];
					if (todo) {
						todo.done = true;
						monosay.data(collection).save(
							todo,
							response => {
								return ctx.reply("Your todo set as done.");
							},
							error => {
								console.error(error);
								return ctx.reply("Something is wrong. We coudln't save it.");
							}
						);
					}
				} else {
					return ctx.reply("Probably you give as a wrong todo number.");
				}
			} else {
				return ctx.reply("We could'nt find your todo.");
			}
		});
});

/**
 * Will set your task as doing
 */
bot.command("doing", ctx => {
	// Remove "/add" from string
	let todoNumber = parseInt(ctx.message.text.substring(7));
	monosay
		.data(collection)
		.where("userid", "==", `${ctx.from.id}`)
		.page(todoNumber)
		.limit(1)
		.list(response => {
			if (response.success) {
				if (response.data.itemCount) {
					var todo = response.data.items[0];
					if (todo) {
						todo.done = false;
						monosay.data(collection).save(
							todo,
							response => {
								return ctx.reply("Your todo set as done.");
							},
							error => {
								console.error(error);
								return ctx.reply("Something is wrong. We coudln't save it.");
							}
						);
					}
				} else {
					return ctx.reply("Probably you give as a wrong todo number.");
				}
			} else {
				return ctx.reply("We could'nt find your todo.");
			}
		});
});

/**
 * Will set your task as done
 */
bot.command("remove", ctx => {
	// Remove "/add" from string
	let todoNumber = parseInt(ctx.message.text.substring(8));
	monosay
		.data(collection)
		.where("userid", "==", `${ctx.from.id}`)
		.page(todoNumber)
		.limit(1)
		.list(response => {
			if (response.success) {
				if (response.data.itemCount) {
					var todo = response.data.items[0];
					if (todo) {
						todo.done = true;
						monosay.data(collection).delete(
							todo.id,
							response => {
								return ctx.reply("Your todo has been removed.");
							},
							error => {
								console.error(error);
								return ctx.reply("Something is wrong. We coudln't remove it.");
							}
						);
					}
				} else {
					return ctx.reply("Probably you give as a wrong todo number.");
				}
			} else {
				return ctx.reply("We could'nt find your todo.");
			}
		});
});

bot.on("text", ctx => ctx.reply("You can type `/help` if you need help."));

bot.startPolling();
