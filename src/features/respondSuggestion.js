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

    // Creating a Embed reply to user
    const respondEmbed = new MessageEmbed()
      .setAuthor(suggestion.userTag, suggestion.userAvatar)
      .setColor(0xffc300)
      .setTitle(
        `Suggestion #${userArgs.suggestionID} ${
          approve ? "Approved" : "Denied"
        }`
      )
      .setDescription(
        `IGN: ${suggestion.IGN}\nSuggestion: ${suggestion.suggestion}\nReason: ${suggestion.reason}`
      )
      .addField(`Reason from ${message.author.tag}`, `${userArgs.reason}`)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return respondEmbed;
  },
};
