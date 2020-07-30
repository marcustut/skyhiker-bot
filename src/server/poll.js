const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "poll",
  description: "To create a poll.",
  poll: (args, pollAuthor) => {
    const pollEmbed = new MessageEmbed()
      .setAuthor("**NEW POLL**", "https://i.imgur.com/zpB4dbi.png")
      .setDescription(args)
      .setColor(0xffc300)
      .setFooter(pollAuthor)
      .setTimestamp();

    return pollEmbed;
  },
};
