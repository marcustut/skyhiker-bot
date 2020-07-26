const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'poll',
    poll: function(msg, who){
        const pollEmbed = new MessageEmbed()
        .setAuthor("**NEW POLL**", "https://i.imgur.com/zpB4dbi.png")
        .setDescription(msg)
        .setColor(0xFFC300)
        .setFooter(who)
        .setTimestamp();
        return pollEmbed;
    }
}