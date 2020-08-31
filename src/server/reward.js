const Discord = require("discord.js");
const bot = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../../constants");

module.exports = {
    name: "reward",
    description: "To create a reward broadcast.",
    reward: (rewardAuthor, rewardWinner, rewardArgs) => {
        const rewardEmbed = new MessageEmbed()
            .setTitle("───========**ＳｋｙＨｉｋｅｒ**========─── \n                            ──── __**ʀᴇᴡᴀʀᴅꜱ**__ ────")
            .setDescription(`${rewardArgs}`)
            .addField(
                "🏆 ───  __**𝐏𝐫𝐢𝐳𝐞 𝐖𝐢𝐧𝐧𝐞𝐫**__  ─── 🏆", `${rewardWinner}`
            )
            .setColor(embedColor)
            .setFooter(rewardAuthor)
            .setTimestamp();

        return rewardEmbed;
    },
};