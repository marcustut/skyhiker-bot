const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
  name: "event",
  description: "To create an event.",
  event: (args, eventAuthor) => {
    const eventEmbed = new MessageEmbed()
      .setTitle("————===========**ＳｋｙＨｉｋｅｒ**===========———— \n                                           ————__**ᴇᴠᴇɴᴛ**__————")
      .setDescription(args)
      .setColor(embedColor)
      .setFooter(eventAuthor)
      .setTimestamp();

    return eventEmbed;
  },
};
