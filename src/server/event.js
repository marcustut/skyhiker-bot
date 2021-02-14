const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
  name: "event",
  description: "To create an event.",
  event: (eventArgs, eventAuthor) => {
    const eventEmbed = new MessageEmbed()
      .setTitle("─────   __**ＳＫＹＨＩＫＥＲＭＣ**__   ───── \n                                »   __**ᴇᴠᴇɴᴛ**__   «")
      .setDescription(`${eventArgs}`)
      .setColor(embedColor)
      .setFooter(eventAuthor)
      .setTimestamp();

    return eventEmbed;
  },
};
