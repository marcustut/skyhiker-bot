const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
  name: "broadcast",
  description: "broadcast or announce in everywhere",
  broadcast: (broadcastArgs, broadcastAuthor) => {
    const broadcastEmbed = new MessageEmbed()
      .setTitle("─────   __**ＳＫＹＨＩＫＥＲＭＣ**__   ───── \n                          »   __**ʙʀᴏᴀᴅᴄᴀꜱᴛ**__   «")
      .setDescription(`${broadcastArgs}`)
      .setColor(embedColor)
      .setFooter(broadcastAuthor)
      .setTimestamp();

    return broadcastEmbed;
  },
};
