const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unban a given player",
  unban: (message, bot, { unbanUserID, unbanReason }) => {
    message.guild.fetchBans().then((bans) => {
      if (bans.size == 0) return;

      let userBanned = bans.find((b) => b.user.id == unbanUserID);

      if (!userBanned) return;

      message.guild.members
        .unban(unbanUserID)
        .then((unbannedUser) => {
          console.log(`${unbannedUser.tag} is unbanned.`);
          const unbannedUserEmbed = new MessageEmbed()
            .setAuthor(unbannedUser.tag, unbannedUser.displayAvatarURL())
            .setColor(0xffc300)
            .setTitle(`[Successful] ${unbannedUser.tag} is unbanned.`)
            .addField(`Reason from ${message.author.tag}`, `-> ${unbanReason}`)
            .setFooter(bot.user.username, bot.user.displayAvatarURL())
            .setTimestamp();

          return message.channel.send(unbannedUserEmbed);
        })
        .catch((error) => {
          console.log(error);

          message.guild.members
            .fetch(unbanUserID)
            .then((unbannedUser) => {
              const errorEmbed = new MessageEmbed()
                .setColor(0xffc300)
                .setTitle("Unban Error")
                .setDescription(
                  `An error occured. Please check if ${unbannedUser.tag} is in the ban list using ';checkban'.`
                );

              return message.channel.send(errorEmbed);
            })
            .catch((error) => {
              console.log(error);

              const noTagEmbed = new MessageEmbed()
                .setColor(0xffc300) // Golden Poppy
                .setDescription(
                  "**Couldn't get a Discord User with this User ID.**"
                );

              return message.channel.send(noTagEmbed);
            });
        });
    });
  },
};
