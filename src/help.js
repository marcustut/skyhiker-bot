const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../constants");

module.exports = {
  name: "help",
  description: "Show the list of commands available",
  help: (message, bot) => {
    const helpEmbed = new MessageEmbed()
      .setAuthor(bot.user.username, bot.user.displayAvatarURL())
      .setColor(embedColor)
      .setTitle(
        "📑 SkyHiker Bot's list of commands"
      )
      .addFields(
        { name: "1️⃣\n;suggestion\nIGN: <IGN>\nSERVER: <Server Name>\nSUGGESTION: <Suggestion>\nREASON: <Reason>", value: ";suggestion\nIGN: Marcus\nSERVER: Skyblock\nSUGGESTION: Add more events\nREASON: It's Fun!\n`To issue suggestions in the suggestion channel.`", inline: true },
        { name: "2️⃣\n;help", value: ";help\n`To display this list of commands.`", inline: true },
      )
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return message.channel.send(helpEmbed);
  }
}