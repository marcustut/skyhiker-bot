const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a given player",
  ban: (message, bot, { banReason = "No Reason.", banUser, banDuration }) => {
    banUser
      .ban({ days: banDuration, reason: banReason })
      .then(() => {
        const bannedEmbed = new MessageEmbed()
          .setAuthor(banUser.user.tag, banUser.user.displayAvatarURL())
          .setColor(0xffc300)
          .setTitle(
            `[Successful] ${banUser.user.tag} was banned for ${banDuration} days.`
          )
          .addField(`Reason from ${message.author.tag}`, `-> ${banReason}`)
          .setFooter(bot.user.username, bot.user.displayAvatarURL())
          .setTimestamp();
        console.log(`${banUser.user.tag} is banned.`);

        return message.channel.send(bannedEmbed);
      })
      .catch((error) => {
        console.log(error);
        const errorEmbed = new MessageEmbed()
          .setColor(0xffc300)
          .setTitle("Ban Error")
          .setDescription(
            `An error occured while banning ${banUser.user.tag}. Kindly seek for developers.`
          );

        return message.channel.send(errorEmbed);
      });
  },
};
