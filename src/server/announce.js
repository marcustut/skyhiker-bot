const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
  name: "announce",
  description: "To make an annoucement.",
  announce: (args, announcementAuthor) => {
    const announceEmbed = new MessageEmbed()
      .setTitle("─────   __**ＳＫＹＨＩＫＥＲＭＣ**__   ───── \n                     »   **ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛ**   «")
      .setDescription(args)
      .setColor(embedColor)
      .setFooter(announcementAuthor)
      .setTimestamp();

    return announceEmbed;
  },
};
