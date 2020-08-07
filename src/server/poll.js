const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "poll",
  description: "To create a poll.",
  poll: (args, pollAuthor, skyHikerBanner) => {
    const pollEmbed = new MessageEmbed()
      .setAuthor("**NEW POLL**", skyHikerBanner)
      .setDescription(args)
      .setColor(0xffc300)
      .setFooter(pollAuthor)
      .setTimestamp();

    return pollEmbed;
  },
};
