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
        `IGN: ${suggestion.IGN}\nSuggestion: ${suggestion.suggestion}\nReason: ${suggestion.reason}`
      )
      .addField(
        "──────  __**𝐑𝐞𝐬𝐩𝐨𝐧𝐝**__  ──────",
        `__${approve ? "💖 𝘼𝙥𝙥𝙧𝙤𝙫𝙚𝙙" : "💔 𝘿𝙚𝙣𝙞𝙚𝙙"}__ by ${message.author.tag}`
      )
      .addField("**Reason given:**", `${userArgs.reason}`)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return respondEmbed;
  },
};
