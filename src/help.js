const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Show the list of commands available",
  help: (message, bot) => {
    const helpEmbed = new MessageEmbed()
      .setAuthor(bot.user.username, bot.user.displayAvatarURL())
      .setColor(0xffc300)
      .setTitle(
        "SkyHiker Bot's list of commands"
      )
      .addField("\u200B", "\u200B")
      .addField("Server", "Only for Staffs")
      .addFields(
        { name: ";announce <channelID> <message>", value: ";announce 730940617034825777 Welcome to SkyHiker MC!", inline: true },
        { name: ";event <channelID> <message>", value: ";event 730940617181364274 A new event is starting in 1 hour.", inline: true },
        { name: ";poll <channelID> <message>", value: ";poll 730957158044401704 Which one is better? A or B?", inline: true },
        { name: "\u200B", value: "\u200B" }
      )
      .addField("Moderation", "Only for Staffs")
      .addFields(
        { name: ";ban <@userToBan> <days> <reason>", value: ";ban @marcusthedreamer 2 because you violated the rules.", inline: true },
        { name: ";unban <@userToUnban> <reason>", value: ";unban @marcusthedreamer You have behaved well.", inline: true },
        { name: ";checkban", value: ";checkban", inline: true },
        { name: ";approve s<suggestionID> <reason>", value: ";approve s12 Great idea!", inline: true },
        { name: ";deny s<suggestionID> <reason>", value: ";deny s8 It might cause issues.", inline: true },
        { name: "\u200B", value: "\u200B" }
      )
      .addField("Features", "For Everyone!")
      .addFields(
        { name: ";suggestion\nIGN (In-Game Name): <IGN>\nSuggestion: <suggestion>\nReason: <reason>", value: ";suggestion\nIGN: Marcus\nSuggestion: Add more events\nReason: It's Fun!", inline: true },
        { name: "\u200B", value: "\u200B" }
      )
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return message.channel.send(helpEmbed);
  }
}