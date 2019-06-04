"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = __importDefault(require("mongodb"));
var discord_js_1 = __importStar(require("discord.js"));
var moment_1 = __importDefault(require("moment"));
var db_1 = __importDefault(require("../db"));
var appaux_1 = __importDefault(require("../appaux"));
var discord_1 = require("../processes/discord");
var socket_1 = require("../processes/socket");
var guild_config_1 = require("./guild-config");
var config_1 = __importDefault(require("./config"));
var connection = db_1.default.connection;
var ObjectId = mongodb_1.default.ObjectId;
var collection = "games";
var host = process.env.HOST;
var Game = (function () {
    function Game(game) {
        var _this = this;
        Object.entries(game).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            _this[key] = value;
        });
        this._guild = discord_1.discordClient().guilds.get(this.s);
        if (this._guild) {
            this._guild.channels.forEach(function (c) {
                if (!_this._channel && c instanceof discord_js_1.TextChannel) {
                    _this._channel = c;
                }
                if (c.id === _this.c && c instanceof discord_js_1.TextChannel) {
                    _this._channel = c;
                }
            });
        }
    }
    Object.defineProperty(Game.prototype, "discordGuild", {
        get: function () { return this._guild; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "discordChannel", {
        get: function () { return this._channel; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "data", {
        get: function () {
            return {
                _id: this._id,
                s: this.s,
                c: this.c,
                guild: this.guild,
                channel: this.channel,
                adventure: this.adventure,
                runtime: this.runtime,
                players: this.players,
                dm: this.dm,
                where: this.where,
                description: this.description,
                reserved: this.reserved,
                method: this.method,
                customSignup: this.customSignup,
                when: this.when,
                date: this.date,
                time: this.time,
                timezone: this.timezone,
                timestamp: this.timestamp,
                reminder: this.reminder,
                messageId: this.messageId,
                reminderMessageId: this.reminderMessageId,
                pm: this.pm
            };
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var channel, guild, guildConfig, game, dm, dmmember, reserved, waitlist, rawDate, timezone, where, description, signups, when, date, msg, embed, dbCollection, prev, updated, message, updatedGame, err_1, saved, inserted, message, pm, updated, saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!connection())
                            throw new Error("No database connection");
                        channel = this._channel;
                        guild = channel.guild;
                        return [4, guild_config_1.GuildConfig.fetch(guild.id)];
                    case 1:
                        guildConfig = _a.sent();
                        game = this.data;
                        dm = game.dm
                            .trim()
                            .replace("@", "")
                            .replace(/\#\d{4}/, "");
                        dmmember = guild.members.array().find(function (mem) {
                            return mem.user.tag === game.dm.trim().replace("@", "");
                        });
                        if (!dmmember)
                            throw new Error("DM must be a Discord tag");
                        else if (guildConfig.embeds === false)
                            dm = dmmember.user.toString();
                        reserved = [];
                        waitlist = [];
                        game.reserved
                            .replace(/@/g, "")
                            .split(/\r?\n/)
                            .forEach(function (res) {
                            if (res.trim().length === 0)
                                return;
                            var member = guild.members.array().find(function (mem) { return mem.user.tag === res.trim(); });
                            var name = res.trim().replace(/\#\d{4}/, "");
                            if (member && guildConfig.embeds === false)
                                name = member.user.toString();
                            if (reserved.length < parseInt(game.players)) {
                                reserved.push(reserved.length + 1 + ". " + name);
                            }
                            else {
                                waitlist.push(reserved.length + waitlist.length + 1 + ". " + name);
                            }
                        });
                        rawDate = game.date + " " + game.time + " GMT" + (game.timezone < 0 ? "-" : "+") + Math.abs(game.timezone);
                        timezone = "GMT" + (game.timezone >= 0 ? "+" : "") + game.timezone;
                        where = parseChannels(game.where, guild.channels);
                        description = parseChannels(game.description, guild.channels);
                        signups = "";
                        if (game.method === "automated") {
                            if (reserved.length > 0)
                                signups += "\n**Sign Ups:**\n" + reserved.join("\n") + "\n";
                            if (waitlist.length > 0)
                                signups += "\n**Waitlist:**\n" + waitlist.join("\n") + "\n";
                            signups += "\n(\u2795 Add Me | \u2796 Remove Me)";
                        }
                        else if (game.method === "custom") {
                            signups += "\n" + game.customSignup;
                        }
                        when = "";
                        if (game.when === "datetime") {
                            date = Game.ISOGameDate(game);
                            when = moment_1.default(date)
                                .utcOffset(parseInt(game.timezone.toString()))
                                .format(config_1.default.formats.dateLong) + (" (" + timezone + ")");
                            game.timestamp = new Date(rawDate).getTime();
                        }
                        else if (game.when === "now") {
                            when = "Now";
                            game.timestamp = new Date().getTime();
                        }
                        msg = "\n**DM:** " + dm +
                            ("\n**Adventure:** " + game.adventure) +
                            ("\n**Runtime:** " + game.runtime + " hours") +
                            ("\n" + (description.length > 0 ? "**Description:**\n" + description + "\n" : description)) +
                            ("\n**When:** " + when) +
                            ("\n**Where:** " + where) +
                            ("\n" + signups);
                        embed = new discord_js_1.default.RichEmbed()
                            .setTitle("Game Announcement")
                            .setColor(0x2196f3)
                            .setDescription(msg);
                        embed.setThumbnail(dmmember.user.avatarURL);
                        dbCollection = connection().collection(collection);
                        if (!game._id) return [3, 12];
                        return [4, Game.fetch(game._id)];
                    case 2:
                        prev = (_a.sent()).data;
                        return [4, dbCollection.updateOne({ _id: new ObjectId(game._id) }, { $set: game })];
                    case 3:
                        updated = _a.sent();
                        message = void 0;
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 10, , 11]);
                        return [4, channel.fetchMessage(game.messageId)];
                    case 5:
                        message = _a.sent();
                        if (!(guildConfig.embeds === false)) return [3, 7];
                        return [4, message.edit(msg, { embed: {} })];
                    case 6:
                        message = _a.sent();
                        return [3, 9];
                    case 7: return [4, message.edit(embed)];
                    case 8:
                        message = _a.sent();
                        _a.label = 9;
                    case 9:
                        prev._id = prev._id.toString();
                        game._id = game._id.toString();
                        updatedGame = appaux_1.default.objectChanges(prev, game);
                        socket_1.io().emit("game", { action: "updated", gameId: game._id, game: updatedGame });
                        return [3, 11];
                    case 10:
                        err_1 = _a.sent();
                        this.delete();
                        updated.modifiedCount = 0;
                        return [3, 11];
                    case 11:
                        saved = {
                            _id: game._id,
                            message: message,
                            modified: updated.modifiedCount > 0
                        };
                        return [2, saved];
                    case 12: return [4, dbCollection.insertOne(game)];
                    case 13:
                        inserted = _a.sent();
                        message = void 0;
                        if (!(guildConfig.embeds === false)) return [3, 15];
                        return [4, channel.send(msg)];
                    case 14:
                        message = (_a.sent());
                        return [3, 17];
                    case 15: return [4, channel.send(embed)];
                    case 16:
                        message = (_a.sent());
                        _a.label = 17;
                    case 17:
                        if (!(game.method === "automated")) return [3, 19];
                        return [4, message.react("➕")];
                    case 18:
                        _a.sent();
                        _a.label = 19;
                    case 19:
                        if (!(game.method === "automated")) return [3, 21];
                        return [4, message.react("➖")];
                    case 20:
                        _a.sent();
                        _a.label = 21;
                    case 21: return [4, dmmember.send("You can edit your `" + guild.name + "` - `" + game.adventure + "` game here:\n" + host + config_1.default.urls.game.create.url + "?g=" + inserted.insertedId)];
                    case 22:
                        pm = _a.sent();
                        return [4, dbCollection.updateOne({ _id: new ObjectId(inserted.insertedId) }, { $set: { messageId: message.id, pm: pm.id } })];
                    case 23:
                        updated = _a.sent();
                        saved = {
                            _id: inserted.insertedId.toString(),
                            message: message,
                            modified: updated.modifiedCount > 0
                        };
                        return [2, saved];
                }
            });
        });
    };
    Game.fetch = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!connection())
                            throw new Error("No database connection");
                        _a = Game.bind;
                        return [4, connection().collection(collection).findOne({ _id: new ObjectId(gameId) })];
                    case 1: return [2, new (_a.apply(Game, [void 0, _b.sent()]))()];
                }
            });
        });
    };
    Game.fetchBy = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var query, game;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!connection())
                            throw new Error("No database connection");
                        query = appaux_1.default.fromEntries([[key, value]]);
                        return [4, connection().collection(collection).findOne(query)];
                    case 1:
                        game = _a.sent();
                        return [2, game ? new Game(game) : null];
                }
            });
        });
    };
    Game.fetchAllBy = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var games;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!connection())
                            throw new Error("No database connection");
                        return [4, connection().collection(collection).find(query).toArray()];
                    case 1:
                        games = _a.sent();
                        return [2, games.map(function (game) {
                                return new Game(game);
                            })];
                }
            });
        });
    };
    Game.deleteAllBy = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!connection())
                            throw new Error("No database connection");
                        return [4, connection().collection(collection).deleteMany(query)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Game.prototype.delete = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, sendWS, game, channel, message, e_1, message, e_2, dm, pm;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!connection())
                            throw new Error("No database connection");
                        _a = options.sendWS, sendWS = _a === void 0 ? true : _a;
                        game = this;
                        channel = this._channel;
                        if (!channel) return [3, 10];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!game.messageId) return [3, 3];
                        return [4, channel.fetchMessage(game.messageId)];
                    case 2:
                        message = _b.sent();
                        if (message) {
                            message.delete().catch(console.log);
                        }
                        _b.label = 3;
                    case 3: return [3, 5];
                    case 4:
                        e_1 = _b.sent();
                        console.log("Announcement: ", e_1.message);
                        return [3, 5];
                    case 5:
                        _b.trys.push([5, 8, , 9]);
                        if (!game.reminderMessageId) return [3, 7];
                        return [4, channel.fetchMessage(game.reminderMessageId)];
                    case 6:
                        message = _b.sent();
                        if (message) {
                            message.delete().catch(console.log);
                        }
                        _b.label = 7;
                    case 7: return [3, 9];
                    case 8:
                        e_2 = _b.sent();
                        console.log("Reminder: ", e_2.message);
                        return [3, 9];
                    case 9:
                        try {
                            if (game.pm) {
                                dm = channel.guild.members.array().find(function (m) { return m.user.tag === game.dm; });
                                if (dm) {
                                    pm = dm.user.dmChannel.messages.get(game.pm);
                                    if (pm) {
                                        pm.delete().catch(console.log);
                                    }
                                }
                            }
                        }
                        catch (e) {
                            console.log("DM: ", e.message);
                        }
                        _b.label = 10;
                    case 10:
                        if (sendWS)
                            socket_1.io().emit("game", { action: "deleted", gameId: game._id });
                        return [4, connection()
                                .collection(collection)
                                .deleteOne({ _id: new ObjectId(game._id) })];
                    case 11: return [2, _b.sent()];
                }
            });
        });
    };
    Game.ISOGameDate = function (game) {
        return game.date.replace(/-/g, "") + "T" + game.time.replace(/:/g, "") + "00" + (game.timezone >= 0 ? "+" : "-") + parseTimeZoneISO(game.timezone);
    };
    return Game;
}());
exports.Game = Game;
;
var parseChannels = function (text, channels) {
    try {
        (text.match(/#[a-z0-9\-_]+/g) || []).forEach(function (m) {
            var chan = channels.array().find(function (c) { return c.name === m.substr(1); });
            if (chan) {
                text = text.replace(new RegExp(m, "g"), chan.toString());
            }
        });
    }
    catch (err) {
        console.log(err);
    }
    return text;
};
var parseTimeZoneISO = function (timezone) {
    var tz = Math.abs(timezone);
    var hours = Math.floor(tz);
    var minutes = ((tz - hours) / 100) * 60;
    var zeroPad = function (n, width, z) {
        if (z === void 0) { z = "0"; }
        n = n + "";
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };
    return zeroPad(hours, 2) + zeroPad(minutes, 2);
};
