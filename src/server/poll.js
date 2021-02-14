const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
  name: "poll",
  description: "To create a poll.",
  poll: (pollArgs, pollEndTime, pollAuthor) => {
    const pollEmbed = new MessageEmbed()
      .setTitle("─────   __**ＳＫＹＨＩＫＥＲＭＣ**__   ───── \n                                »   __**ᴘᴏʟʟꜱ**__   «")
      .setDescription(`${pollArgs}`)
      .addField(
          "⌛️ ───  __𝐏𝐨𝐥𝐥 𝐄𝐧𝐝 𝐓𝐢𝐦𝐞__  ─── ⏳", `${pollEndTime}`
      )
      .setColor(embedColor)
      .setFooter(pollAuthor)
      .setTimestamp();

    return pollEmbed;
  },
};