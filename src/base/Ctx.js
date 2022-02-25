const { Message, TextChannel, User, Guild, GuildMember, MessageAttachment, DiscordAPIError, MessageEmbed, MessageButton, MessageSelectMenu } = require("discord.js");
const Client = require('./Client');

class Input {
    constructor(message, prefix, sub) {
        let args = message.content.split(' ').slice(1);

        /**
         * @type {String}
         */
        this.prefix = prefix

        /**
         * @type {Array<String>}
         */
        this.flags = message.content.includes('--') ? args.filter(e => e.startsWith('--')).map(e => e.slice(2)): []
        
        /**
         * @type {Array<String>}
         */
        this.args = sub ? args.slice(1).filter(e => !e.startsWith('--')):args.filter(e => !e.startsWith('--'))

        /**
         * @type {Array<String>}
         */
        this.fullArgs = args

        /**
         * @type {String}
         */
        this.content = message.content
        
        /**
         * @type {String}
         */
        this.cleanContent = message.content.clean(true)
    }
}


class Context {
    constructor(message, prefix, client, cmdName, sub = false) {
        /**
         * @type {Client}
         * @returns {Client}
         */
        this.client = client;

        /**
         * @type {Message}
         */
        this.message = message;

        /**
         * @type {TextChannel}
         */
        this.channel = message.channel || null;

        /**
         * @type {Guild}
         */
        this.guild = message.guild || null;

        /**
         * @type {GuildMember}
         */
        this.me = message.guild.me || null;

        /**
         * @type {User}
         */
        this.user = message.guild.me.user || null;

        /**
         * @type {User}
         */
        this.author = message.author || null;

        /**
         * @type {GuildMember}
         */
        this.member = message.member || null;

        let In = new Input(message, prefix, sub);
        /**
         * @returns {Input}
         */
        this.input = In;
        
        this.db = this.client.db;
    };

    emoji(emojiname) {
        return this.client.emoji.get(emojiname);
    }

    reloadEvents() {
        let GEvent = new (require('../handlers/auto/eventHandler'))(this.client);
        return GEvent.run(this.client);
    }

    reloadCommands() {
        return this.client.CommandHandler.init();
    }

    reloadHandlers() {
        const Handler = new (require('./src/handlers/handler'))(client);
        return Handler.init();
    }

    /**
     * @name replyMessage
     * @param  {MessageOptions|MessageEmbed|MessageActionRow|MessageAttachment|MessageButton|String|Number} args 
     * @returns Message
     */
    reply(...args) {
        let Embeds = [], ActionRows = [], Attachments = [], text = '', _Object;
        args.forEach(e => {
            if (typeof e == 'string' || typeof e == 'number') return text += `${e}`;
            if (e instanceof MessageEmbed) return Embeds.push(e);
            if (e instanceof MessageButton) {
                if (ActionRows.length >= 1) {
                    ActionRows[0] = ActionRows[0].addComponents(e);
                } else {
                    let nMAR = new MessageActionRow().addComponents(e)
                    ActionRows.push(nMAR);
                }
                return;
            }
            if (e instanceof MessageSelectMenu) {
                if (ActionRows.length >= 1) {
                    ActionRows[0] = ActionRows[0].addComponents(e);
                } else {
                    let nMAR = new MessageActionRow().addComponents(e)
                    ActionRows.push(nMAR);
                }
                return;
            }
            if (e instanceof MessageActionRow) return ActionRows.push(e);
            if (e instanceof MessageAttachment) return Attachments.push(e);
            if (typeof e == 'object') return _Object = e;
        });
        if (_Object)
            return this.message.reply(_Object);
        else
            return this.message.reply({
                content: text == '' ? undefined: text,
                embeds: Embeds,
                components: ActionRows,
                files: Attachments,
                allowedMentions: { repliedUser: false }
            });
    };
    /**
     * @name sendMessage
     * @param  {MessageOptions|MessageEmbed|MessageActionRow|MessageAttachment|MessageButton|String|Number} args 
     * @returns Message
     */
    send(...args) {
        let Embeds = [], ActionRows = [], Attachments = [], text = '', _Object;
        args.forEach(e => {
            if (typeof e == 'string' || typeof e == 'number') return text += `${e}`;
            if (e instanceof MessageEmbed) return Embeds.push(e);
            if (e instanceof MessageButton) {
                if (ActionRows.length >= 1) {
                    ActionRows[0] = ActionRows[0].addComponents(e);
                } else {
                    let nMAR = new MessageActionRow().addComponents(e)
                    ActionRows.push(nMAR);
                }
                return;
            }
            if (e instanceof MessageSelectMenu) {
                if (ActionRows.length >= 1) {
                    ActionRows[0] = ActionRows[0].addComponents(e);
                } else {
                    let nMAR = new MessageActionRow().addComponents(e)
                    ActionRows.push(nMAR);
                }
                return;
            }
            if (e instanceof MessageActionRow) return ActionRows.push(e);
            if (e instanceof MessageAttachment) return Attachments.push(e);
            if (typeof e == 'object') return _Object = e;
        });
        if (_Object)
            return this.channel.send(_Object);
        else
            return this.channel.send({
                content: text == '' ? undefined: text,
                embeds: Embeds,
                components: ActionRows,
                files: Attachments
            });
    };
};

module.exports = Context;
