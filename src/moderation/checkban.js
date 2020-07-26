const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "checkban",
  description: "Check the list of banned players",
  checkban: async (message, bot) => {
    try {
      const bannedPlayers = await message.guild.fetchBans();
      let listBannedPlayers = Array.from(bannedPlayers);

      var i=1;

      listBannedPlayers = listBannedPlayers.map(player => {
        // renaming reason to value
        player[1].value = player[1].reason !== null ? player[1].reason : "No reason.";
        delete player[1].reason; 
        // renaming user.tag to name
        player[1].name = `${i}. ${player[1].user.username}#${player[1].user.discriminator} (${player[1].user.id})`;
        delete player[1].user; 

        player[1].inline = true;

        i++;

        return player[1];
      });

      const listBannedPlayersEmbed = new MessageEmbed()
        .setAuthor(bot.user.username, bot.user.displayAvatarURL())
        .setColor(0xffc300)
        .setTitle(
          "List of Banned Players from SkyHiker Discord Server"
        )
        .addFields(listBannedPlayers)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(listBannedPlayersEmbed)
    } catch(err) {
      console.log(err);
      const errorEmbed = new MessageEmbed()
        .setColor(0xffc300)
        .setTitle("Check Ban Error")
        .setDescription(
          `An error occured while fetching the ban list. Kindly seek for developers.`
        );

      return messasge.channel.send(errorEmbed);
    }
  },
};
