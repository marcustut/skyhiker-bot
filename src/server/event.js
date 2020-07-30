const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "event",
  description: "To create an event.",
  event: (args, eventAuthor) => {
    const eventEmbed = new MessageEmbed()
      .setAuthor("**NEW EVENT**", "https://i.imgur.com/zpB4dbi.png")
      .setDescription(args)
      .setColor(0xffc300)
      .setFooter(eventAuthor)
      .setTimestamp();

    return eventEmbed;
  },
};
