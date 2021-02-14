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
        { name: ":one:\n;announce <Channel> <tag specific member> <description>", value: ";announce #a.. @hikers Welcome to SkyHiker MC!\n`To make announcement in the announcement channel.`", inline: true },
        { name: ":two:\n;event <Channel> <tag specific member> <description>", value: ";event #a.. @hikers A new event is starting in 1 hour.\n`To schedule an event in the event channel.`\n And with the Information ```🎏   ───  __𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧__  ───  🎏 \n**Event Name** : \n**Date** : \n**Time** : \n**Venue** : SkyHiker /warp event1\n**Description**: ```", inline: true },
        { name: ":three:\n;update <Channel> <tag specific member> <updated server name> <update details>", value: ";update #outcome @member Skyblock Any updates detail must be presented here. A or B?\n`Broadcast some updates regarding to the server`", inline: true },
        { name: ":four:\n;reward <Channel> <tag top 3 Winner (bottom got format)> <description of prize / any tagging>", value: ";reward #outcome \n:first_place: - @FG#5011 \n:second_place: - @FG#5011 \n:third_place: - @FG#5011 \nAny description \n`Broadcast the event winner with this.`", inline: true },
        { name: ":five:\n;poll <Channel> <EndTime> <poll detials>", value: ";poll #outcome @member \n2020/08/21 GMT+8 8.00pm // 20:00 Any description\n`To create a poll in the poll channel.`", inline: true },
        { name: ":six:\n;broadcast <channel> <msg>", value: "`Flexiblility of broadcasting of any news in any channel!`", inline: true },
        { name: "\u200B", value: "\u200B" },
      )
      .addField("\u200b", "─────────────────────")
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