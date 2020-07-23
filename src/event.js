const { MessageEmbed } = require("discord.js")

module.exports = {
    event: function(msg, who){
        const eventEmbed = new MessageEmbed()
        .setAuthor("**NEW EVENT**", "https://i.imgur.com/zpB4dbi.png")
        .setDescription(msg)
        .setColor(0xFFC300)
        .setFooter(who)
        .setTimestamp();
        return eventEmbed;
    }
}