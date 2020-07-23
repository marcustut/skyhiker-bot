const { MessageEmbed } = require("discord.js");

module.exports = {
    announce: function(msg, who) {
        const announceEmbed = new MessageEmbed()
        .setDescription(msg)
        .setColor(0xFFC300)
        .setFooter(who)
        .setTimestamp()
        return announceEmbed;
    }
};