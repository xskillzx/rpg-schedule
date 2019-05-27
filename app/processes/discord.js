"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = __importStar(require("discord.js"));
const guild_config_1 = require("../models/guild-config");
const game_1 = require("../models/game");
const config_1 = __importDefault(require("../models/config"));
const discordProcesses = (readyCallback) => {
    const client = new discord_js_1.default.Client();
    /**
     * Discord.JS - ready
     */
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}!`);
        readyCallback();
    });
    /**
     * Discord.JS - message
     */
    client.on("message", async (message) => {
        if (message.content.startsWith(process.env.BOTCOMMAND_SCHEDULE) && message.channel instanceof discord_js_1.default.TextChannel) {
            const parts = message.content
                .trim()
                .split(" ")
                .slice(1);
            const cmd = parts.reverse().pop();
            parts.reverse();
            if (!message.channel.guild) {
                message.reply("This command will only work in a server");
                return;
            }
            const guild = message.channel.guild;
            const guildId = guild.id;
            const guildConfig = await guild_config_1.GuildConfig.fetch(guildId);
            const member = message.channel.guild.members.array().find(m => m.user.id === message.author.id);
            const canConfigure = member ? member.hasPermission(discord_js_1.default.Permissions.FLAGS.MANAGE_GUILD) : false;
            if (cmd === "help" || message.content.trim().split(" ").length === 1) {
                let embed = new discord_js_1.default.RichEmbed()
                    .setTitle("RPG Schedule Help")
                    .setColor(0x2196f3)
                    .setDescription(`__**Command List**__\n` +
                    `\`${process.env.BOTCOMMAND_SCHEDULE}\` - Display this help window\n` +
                    `\`${process.env.BOTCOMMAND_SCHEDULE} help\` - Display this help window\n` +
                    (canConfigure ? `\nConfiguration\n` +
                        (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} configuration\` - Get the bot configuration\n` : ``) +
                        (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} channel #channel-name\` - Configure the channel where games are posted\n` : ``) +
                        (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} pruning ${guildConfig.pruning ? 'on' : 'off'}\` - \`on/off\` - Automatically delete old announcements\n` : ``) +
                        (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} embeds ${guildConfig.embeds || guildConfig.embeds == null ? 'on' : 'off'}\` - \`on/off\` - Use discord embeds for announcements\n` : ``) +
                        (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} role role name\` - Assign a role as a prerequisite for posting games\n` : ``) +
                        (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} password password\` - Configure a password for posting games\n` : ``) +
                        (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} password\` - Remove the password\n` : ``) : ``) +
                    `\nUsage\n` +
                    `\`${process.env.BOTCOMMAND_SCHEDULE} link\` - Retrieve link for posting games`);
                message.channel.send(embed);
            }
            else if (cmd === "link") {
                message.channel.send(process.env.HOST + config_1.default.urls.game.create.url + "?s=" + guildId);
            }
            else if (cmd === "configuration") {
                if (canConfigure) {
                    const channel = guild.channels.get(guildConfig.channel) || guild.channels.array().find(c => c instanceof discord_js_1.default.TextChannel);
                    let embed = new discord_js_1.default.RichEmbed()
                        .setTitle("RPG Schedule Configuration")
                        .setColor(0x2196f3)
                        .setDescription(`Guild: \`${guild.name}\`\n` +
                        `Channel: \`${channel.name}\`\n` +
                        `Pruning: \`${guildConfig.pruning ? "on" : "off"}\`\n` +
                        `Embeds: \`${!(guildConfig.embeds === false) ? "on" : "off"}\`\n` +
                        `Password: ${guildConfig.password ? `\`${guildConfig.password}\`` : "Disabled"}\n` +
                        `Role: ${guildConfig.role ? `\`${guildConfig.role}\`` : "All Roles"}`);
                    message.author.send(embed);
                }
            }
            else if (cmd === "channel") {
                if (canConfigure) {
                    guild_config_1.GuildConfig.save({
                        guild: guildId,
                        channel: parts[0].replace(/\<\#|\>/g, "")
                    }).then(result => {
                        message.channel.send("Channel updated! Make sure the bot has permissions in the designated channel.");
                    });
                }
            }
            else if (cmd === "pruning") {
                if (canConfigure) {
                    guild_config_1.GuildConfig.save({
                        guild: guildId,
                        pruning: parts[0] === "on"
                    }).then(result => {
                        message.channel.send("Configuration updated! Pruning was turned " + (parts[0] === "on" ? "on" : "off"));
                    });
                }
            }
            else if (cmd === "embeds") {
                if (canConfigure) {
                    guild_config_1.GuildConfig.save({
                        guild: guildId,
                        embeds: !(parts[0] === "off")
                    }).then(result => {
                        message.channel.send("Configuration updated! Embeds were turned " + (!(parts[0] === "off") ? "on" : "off"));
                    });
                }
            }
            else if (cmd === "password") {
                if (canConfigure) {
                    guild_config_1.GuildConfig.save({
                        guild: guildId,
                        password: parts.join(" ")
                    }).then(result => {
                        message.channel.send("Password updated!");
                    });
                }
            }
            else if (cmd === "role") {
                if (canConfigure) {
                    guild_config_1.GuildConfig.save({
                        guild: guildId,
                        role: parts.join(" ")
                    }).then(result => {
                        message.channel.send(`Role set to \`${parts.join(" ")}\`!`);
                    });
                }
            }
            message.delete();
        }
    });
    /**
     * Discord.JS - messageReactionAdd
     */
    client.on("messageReactionAdd", async (reaction, user) => {
        const message = reaction.message;
        const game = await game_1.Game.fetchBy("messageId", message.id);
        if (game && user.id !== message.author.id && message.channel instanceof discord_js_1.default.TextChannel) {
            const channel = message.channel;
            if (reaction.emoji.name === "➕") {
                if (game.reserved.indexOf(user.tag) < 0) {
                    game.reserved = [...game.reserved.trim().split(/\r?\n/), user.tag].join("\n");
                    if (game.reserved.startsWith("\n"))
                        game.reserved = game.reserved.substr(1);
                    game_1.Game.save(channel, game);
                }
            }
            else if (reaction.emoji.name === "➖") {
                if (game.reserved.indexOf(user.tag) >= 0) {
                    game.reserved = game.reserved
                        .split(/\r?\n/)
                        .filter(tag => tag !== user.tag)
                        .join("\n");
                    game_1.Game.save(channel, game);
                }
            }
            reaction.remove(user);
        }
    });
    /**
     * Discord.JS - messageDelete
     * Delete the game from the database when the announcement message is deleted
     */
    client.on("messageDelete", async (message) => {
        const game = await game_1.Game.fetchBy("messageId", message.id);
        if (game && message.channel instanceof discord_js_1.TextChannel) {
            game_1.Game.delete(game, message.channel).then(result => {
                console.log("Game deleted");
            });
        }
    });
    /**
     * Add events to non-cached messages
     */
    const events = {
        MESSAGE_REACTION_ADD: "messageReactionAdd",
        MESSAGE_REACTION_REMOVE: "messageReactionRemove"
    };
    client.on("raw", async (event) => {
        if (!events.hasOwnProperty(event.t))
            return;
        const { d: data } = event;
        const user = client.users.get(data.user_id);
        const channel = client.channels.get(data.channel_id) || (await user.createDM());
        if (channel.messages.has(data.message_id))
            return;
        const message = await channel.fetchMessage(data.message_id);
        const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
        let reaction = message.reactions.get(emojiKey);
        if (!reaction) {
            const emoji = new discord_js_1.default.Emoji(client.guilds.get(data.guild_id), data.emoji);
            reaction = new discord_js_1.default.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
        }
        client.emit(events[event.t], reaction, user);
    });
    return client;
};
const discordLogin = client => {
    client.login(process.env.TOKEN);
};
const refreshMessages = async (guilds) => {
    const guildConfigs = await guild_config_1.GuildConfig.fetchAll();
    guilds.array().forEach(async (guild) => {
        const channel = guild.channels.array().find(c => guildConfigs.find(gc => gc.guild === guild.id && gc.channel === c.id));
        if (channel) {
            let games = await game_1.Game.fetchAllBy({ s: guild.id, c: channel.id, when: "datetime", method: "automated", timestamp: { $gte: new Date().getTime() } });
            games.forEach(async (game) => {
                try {
                    const message = await channel.fetchMessage(game.messageId);
                    await message.clearReactions();
                    await message.react("➕");
                    await message.react("➖");
                }
                catch (err) { }
            });
        }
    });
};
const pruneOldGames = async (client) => {
    let result;
    console.log("Pruning old games");
    const query = {
        /*s: {
            $nin: [] // not in these specific servers
        },*/
        timestamp: {
            $lt: new Date().getTime() - 48 * 3600 * 1000 // timestamp lower than 48 hours ago
        }
    };
    const games = await game_1.Game.fetchAllBy(query);
    const guildConfigs = await guild_config_1.GuildConfig.fetchAll();
    games.forEach(async (game) => {
        try {
            const guildConfig = guildConfigs.find(gc => gc.guild === game.s);
            if (guildConfig) {
                if (guildConfig.pruning) {
                    const guild = client.guilds.get(game.s);
                    if (guild) {
                        const channel = guild.channels.get(game.c);
                        if (channel) {
                            const message = await channel.fetchMessage(game.messageId);
                            if (message)
                                message.delete();
                            const reminder = await channel.fetchMessage(game.reminderMessageId);
                            if (reminder)
                                reminder.delete();
                        }
                    }
                }
            }
        }
        catch (err) { }
    });
    try {
        result = await game_1.Game.deleteAllBy(query);
        console.log(`${result.deletedCount} old games successfully pruned`);
    }
    catch (err) {
        console.log(err);
    }
    return result;
};
const postReminders = async (client) => {
    let games = await game_1.Game.fetchAllBy({ when: "datetime", reminder: { $in: ["15", "30", "60"] } });
    games.forEach(async (game) => {
        if (game.timestamp - parseInt(game.reminder) * 60 * 1000 > new Date().getTime())
            return;
        const guild = client.guilds.get(game.s);
        if (guild) {
            const channel = guild.channels.get(game.c);
            if (channel) {
                const reserved = [];
                game.reserved.split(/\r?\n/).forEach(res => {
                    if (res.trim().length === 0)
                        return;
                    let member = guild.members.array().find(mem => mem.user.tag === res.trim().replace("@", ""));
                    let name = res.trim().replace("@", "");
                    if (member)
                        name = member.user.toString();
                    if (reserved.length < parseInt(game.players)) {
                        reserved.push(name);
                    }
                });
                const member = guild.members.array().find(mem => mem.user.tag === game.dm.trim().replace("@", ""));
                let dm = game.dm.trim().replace("@", "");
                if (member)
                    dm = member.user.toString();
                if (reserved.length > 0) {
                    const channels = game.where.match(/#[a-z0-9\-_]+/gi);
                    if (channels) {
                        channels.forEach(chan => {
                            const guildChannel = guild.channels.find(c => c.name === chan.replace(/#/, ""));
                            if (guildChannel) {
                                game.where = game.where.replace(chan, guildChannel.toString());
                            }
                        });
                    }
                    let message = `Reminder for **${game.adventure}**\n`;
                    message += `**When:** Starting in ${game.reminder} minutes\n`;
                    message += `**Where:** ${game.where}\n\n`;
                    message += `**DM:** ${dm}\n`;
                    message += `**Players:**\n`;
                    message += `${reserved.join(`\n`)}`;
                    const sent = await channel.send(message);
                    game.reminder = "0";
                    game.reminderMessageId = sent.id;
                    game_1.Game.save(channel, game);
                }
            }
        }
    });
};
module.exports = {
    processes: discordProcesses,
    login: discordLogin,
    refreshMessages: refreshMessages,
    pruneOldGames: pruneOldGames,
    postReminders: postReminders
};
