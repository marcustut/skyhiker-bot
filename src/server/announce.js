const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "announce",
  description: "To make an annoucement.",
  announce: (args, announcementAuthor) => {
    const announceEmbed = new MessageEmbed()
      .setDescription(args)
      .setColor(0xffc300)
      .setFooter(announcementAuthor)
      .setTimestamp();

    return announceEmbed;
  },
};
