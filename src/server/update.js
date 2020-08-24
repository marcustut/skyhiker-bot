const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
  name: "update",
  description: "To create an update-log.",
  update: (args, updateAuthor) => {
    const updateEmbed = new MessageEmbed()
      .setTitle("————===========**ＳｋｙＨｉｋｅｒ**===========———— \n                                        ————__**ᴜᴘᴅᴀᴛᴇꜱ**__————")
      .setDescription(args)
      .setColor(embedColor)
      .setFooter(updateAuthor)
      .setTimestamp();

    return updateEmbed;
  },
};
