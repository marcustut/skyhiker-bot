const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
  name: "update",
  description: "To create an update-log.",
  update: (updateAuthor, updateRole, updateServer, updateDescrip) => {
    const updateEmbed = new MessageEmbed()
      .setTitle(
        "─────   __**ＳＫＹＨＩＫＥＲＭＣ**__   ───── \n                            »   __**ᴜᴘᴅᴀᴛᴇꜱ**__   « "
      )
      .setDescription(`${updateRole}`)
      .addField("───__**𝐒𝐞𝐫𝐯𝐞𝐫**__───", `${updateServer}`)
      .addField("🛠 ───  __**𝐌𝐨𝐝𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧**__  ─── 🛠", `${updateDescrip}`)
      .setColor(embedColor)
      .setFooter(updateAuthor)
      .setTimestamp();

    return updateEmbed;
  },
};
