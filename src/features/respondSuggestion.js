const { MessageEmbed } = require("discord.js");
const { db } = require("../services/firebase");

module.exports = {
  name: "respondSuggestion",
  description: "Respond to a suggestion stored in database.",
  respondSuggestion: async (message, bot, { userArgs, approve }) => {
    // Specifying the collections
    const suggestionCollection = db
      .collection("/discord/commands/suggestions")
      .doc(`suggestion${userArgs.suggestionID}`);
    const suggestionQuery = await suggestionCollection.get();
    let suggestion = suggestionQuery.data();

    // Update the suggestion status
    suggestionCollection.update({
      response: userArgs.reason,
      status: approve ? "approved" : "denied",
    });

    // Delete the original message
    message.channel.messages
      .fetch(suggestion.messageID)
      .then((message) => message.delete())
      .catch((err) => console.error(err));

    // Creating a Embed reply to user
    const respondEmbed = new MessageEmbed()
      .setAuthor(suggestion.userTag, suggestion.userAvatar)
      .setColor(approve ? 0x2ac200 : 0xc20000) // if approved, green else red
      .setTitle(`Suggestion #${userArgs.suggestionID}`)
      .setDescription(
        `𝗡𝗮𝗺𝗲: ${suggestion.IGN} \n𝗦𝗲𝗿𝘃𝗲𝗿: ${suggestion.SERVER} \n𝗦𝘂𝗴𝗴𝗲𝘀𝘁𝗶𝗼𝗻: ${suggestion.SUGGESTION} \n𝗥𝗲𝗮𝘀𝗼𝗻: ${suggestion.REASON}`
      )
      .addField(
        `────── __**${approve ? "💖 𝐀𝐩𝐩𝐫𝐨𝐯𝐞𝐝 💖" : "💔 𝐃𝐞𝐧𝐢𝐞𝐝 💔"}**__ ──────`,
        `**Reason given:** \n${userArgs.reason}`
      )
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return respondEmbed;
  },
};
