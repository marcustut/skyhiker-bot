const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
  name: "poll",
  description: "To create a poll.",
  poll: (args, pollAuthor) => {
    const pollEmbed = new MessageEmbed()
      .setTitle("————===========**ＳｋｙＨｉｋｅｒ**===========———— \n                                            ————__**ᴘᴏʟʟ**__————")
      .setDescription(args)
      .setColor(embedColor)
      .setFooter(pollAuthor)
      .setTimestamp();

    return pollEmbed;
  },
};
