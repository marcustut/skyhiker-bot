const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../constants");

module.exports = {
  name: "shelp",
  description: "Show the list of staff commands available",
  shelp: (message, bot) => {
    const shelpEmbed = new MessageEmbed()
      .setAuthor(bot.user.username, bot.user.displayAvatarURL())
      .setColor(embedColor)
      .setTitle(
        "📕 SkyHiker Bot's list of commands (For Staffs)"
      )
      .addField("📢 **Server**", "\u200B")
      .addFields(
        { name: "1️⃣\n;announce <channelID> <message>", value: ";announce 730940617034825777 Welcome to SkyHiker MC!\n`To make announcement in the announcement channel.`", inline: true },
        { name: "2️⃣\n;event <channelID> <message>", value: ";event 730940617181364274 A new event is starting in 1 hour.\n`To schedule an event in the event channel.`", inline: true },
        { name: "3️⃣\n;poll <channelID> <message>", value: ";poll 730957158044401704 Which one is better? A or B?\n`To create a poll in the poll channel.`", inline: true },
        { name: "\u200B", value: "\u200B" },
      )
      .addField("🚨 **Moderation**", "\u200B")
      .addFields(
        { name: "1️⃣\n;ban <@userToBan> <days> <reason>", value: ";ban @marcusthedreamer 2 because you violated the rules.\n`To ban a player.`", inline: true },
        { name: "2️⃣\n;unban <@userToUnban> <reason>", value: ";unban @marcusthedreamer You have behaved well.\n`To unban a player.`", inline: true },
        { name: "3️⃣\n;checkban", value: ";checkban\n`To display a list of banned players.`", inline: true },
        { name: "4️⃣\n;approve s<suggestionID> <reason>", value: ";approve s12 Great idea!\n`To approve a suggestion in the suggestions channel.`", inline: true },
        { name: "5️⃣\n;deny s<suggestionID> <reason>", value: ";deny s8 It might cause issues.\n`To deny a suggestion in the suggestions channel.`", inline: true },
      )
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return message.channel.send(shelpEmbed);
  }
}