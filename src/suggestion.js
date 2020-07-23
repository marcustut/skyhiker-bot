const { MessageEmbed } = require("discord.js");
const { db } = require("./modules/firebase");


module.exports = {
  storeSuggestion: async (user, discordMessage, bot) => {
    // Specifying the collections
    const commandsCollection = db.doc('/discord/commands');
    const commandsDoc = await commandsCollection.get();
    const suggestionCollection = db.collection('/discord/commands/suggestions').doc(`suggestion${commandsDoc.data().suggestionsCount + 1}`);

    // Creating a new document
    await suggestionCollection.set({
        'id': commandsDoc.data().suggestionsCount + 1,
        'userTag': discordMessage.author.tag,
        'userID': discordMessage.author.id,
        'userAvatar': discordMessage.author.displayAvatarURL(),
        'IGN': user.IGN,
        'date': new Date(),
        'suggestion': user.suggestion,
        'reason': user.reason,
        'response': null,
        'status': 'pending'
    });

    // Creating a Embed reply to user
    const suggestionEmbed = new MessageEmbed()
        .setAuthor(discordMessage.author.tag, discordMessage.author.displayAvatarURL())
        .setTitle(`Suggestion #${commandsDoc.data().suggestionsCount + 1}`)
        .setDescription(`IGN: ${user.IGN}\nSuggestion: ${user.suggestion}\nReason: ${user.reason}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp();

    // Increment suggestionsCount 
    commandsCollection.update({
        'suggestionsCount': commandsDoc.data().suggestionsCount + 1
    });

    // Logging the result
    console.log(`Suggestion#${commandsDoc.data().suggestionsCount + 1} by ${discordMessage.author.tag} at ${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Asia/Kuala_Lumpur', timeZoneName: 'short'}).format(new Date())} (A new suggestion is issued)`)

    return suggestionEmbed;
  },
    respondSuggestion: async (discordMessage, bot, {userArgs, approve}) => {
        // Specifying the collections
        const suggestionCollection = db.collection('/discord/commands/suggestions').doc(`suggestion${userArgs.suggestionID}`);
        const suggestionQuery = await suggestionCollection.get();
        let suggestion = suggestionQuery.data();

        // Update the suggestion status
        suggestionCollection.update({
            'response': userArgs.reason,
            'status': approve ? 'approved' : 'denied'
        })

        // Creating a Embed reply to user
        const respondEmbed = new MessageEmbed()
            .setAuthor(suggestion.userTag, suggestion.userAvatar)
            .setTitle(`Suggestion #${userArgs.suggestionID} ${approve ? 'Approved' : 'Denied'}`)
            .setDescription(`IGN: ${suggestion.IGN}\nSuggestion: ${suggestion.suggestion}\nReason: ${suggestion.reason}`)
            .addField(`Reason from ${discordMessage.author.tag}`, `${userArgs.reason}`)
            .setFooter(bot.user.username, bot.user.displayAvatarURL())
            .setTimestamp();

        return respondEmbed;
    }
}