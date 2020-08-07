const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "poll",
  description: "To create a poll.",
  poll: (args, pollAuthor, botAvatar) => {
    const pollEmbed = new MessageEmbed()
      .setAuthor("——  𝓟𝓸𝓵𝓵  ——", botAvatar)
      .setDescription(args)
      .setColor(0xffc300)
      .setFooter(pollAuthor)
      .setTimestamp();

    return pollEmbed;
  },
};
