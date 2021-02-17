const { MessageEmbed } = require("discord.js");
const { db } = require("../services/firebase");

module.exports = {
  name: "storeSuggestion",
  description: "Store a user given suggestion to databse",
  storeSuggestion: async (user, discordMessage, bot) => {
    // Specifying the collections
    const commandsCollection = db.doc("/discord/commands");
    const commandsDoc = await commandsCollection.get();
    const suggestionCollection = db
      .collection("/discord/commands/suggestions")
      .doc(`suggestion${commandsDoc.data().suggestionsCount + 1}`);

    // Creating a new document
    await suggestionCollection.set({
      id: commandsDoc.data().suggestionsCount + 1,
      userTag: discordMessage.author.tag,
      userID: discordMessage.author.id,
      userAvatar: discordMessage.author.displayAvatarURL(),
      IGN: user.IGN,
      SERVER: user.SERVER,
      date: new Date(),
      SUGGESTION: user.SUGGESTION,
      REASON: user.REASON,
      response: null,
      status: "pending",
    });

    // Creating a Embed reply to user
    const suggestionEmbed = new MessageEmbed()
      .setAuthor(
        discordMessage.author.tag,
        discordMessage.author.displayAvatarURL()
      )
      .setColor(0xf5f000) // Yellow
      .setTitle(`Suggestion #${commandsDoc.data().suggestionsCount + 1}`)
      .setDescription(
        `𝗡𝗮𝗺𝗲: ${user.IGN} \n𝗦𝗲𝗿𝘃𝗲𝗿: ${user.SERVER} \n𝗦𝘂𝗴𝗴𝗲𝘀𝘁𝗶𝗼𝗻: ${user.SUGGESTION} \n𝗥𝗲𝗮𝘀𝗼𝗻: ${user.REASON}\n `
      )
      .addField(
        "──────  __**𝐏𝐞𝐧𝐝𝐢𝐧𝐠**__  ──────",
        `⚖️ The suggestion is now under discussing, please wait patiently and thank you for sharing your ideas! ❤️`
      )
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    // Increment suggestionsCount
    commandsCollection.update({
      suggestionsCount: commandsDoc.data().suggestionsCount + 1,
    });

    // Logging the result
    console.log(
      `Suggestion#${commandsDoc.data().suggestionsCount + 1} by ${
        discordMessage.author.tag
      } at ${new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Kuala_Lumpur",
        timeZoneName: "short",
      }).format(new Date())} (A new suggestion is issued)`
    );

    return suggestionEmbed;
  },
};
