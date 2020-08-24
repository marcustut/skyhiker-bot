// Modules for Discord
const Discord = require("discord.js");
const bot = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

// 3rd Party Modules
const cheerio = require("cheerio");
const request = require("request");

// Self defined modules
const announce = require("./src/server/announce");
const poll = require("./src/server/poll");
const event = require("./src/server/event");
const update = require("./src/server/update");
const storeSuggestion = require("./src/features/storeSuggestion");
const respondSuggestion = require("./src/features/respondSuggestion");

// Discord Config
const { PREFIX, discordToken } = require("./config");

// Constants
const {
  roles,
  channels,
  banners,
  botAvatar,
  serverIcon,
  accpetedReactions,
  embedColor,
} = require("./constants");

// Commands Handler
const fs = require("fs");
const path = require("path");

// Asynchronous function to read files (parallel loop)
const readFiles = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          readFiles(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

bot.commands = new Discord.Collection();

readFiles("./src/", async (err, results) => {
  if (err) throw err;

  for (const commandsFilePath of results) {
    const command = require(commandsFilePath);
    bot.commands.set(command.name, command);
  }
});

// When the bot is online
bot.once("ready", async () => {
  console.log("SkyHiker Bot is now Online.");
});

bot.on("messageReactionAdd", async (reaction, user) => {
  // Fetch the partials
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  // If it's bot message or message not in guild then exits
  if (user.bot) return;
  if (!reaction.message.guild) return;

  // If the reaction comes from Welcome Channel
  if (reaction.message.channel.id === channels.welcomeChannel) {
    if (accpetedReactions.includes(reaction.emoji.name)) {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add(roles.memberRole)
        .then((newMember) => {
          const newMemberEmbed = new Discord.MessageEmbed()
            .setColor(0x00ed1c) // Green
            .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
            .setTitle(`${newMember.user.tag}`)
            .setDescription(`✅ <@${newMember.user.id}> **is now verifed!**`)
            .setTimestamp()
            .setThumbnail(newMember.user.displayAvatarURL());

          return bot.channels
            .fetch(channels.verificationChannel)
            .then((verificationChannel) =>
              verificationChannel.send(newMemberEmbed)
            );
        });
    }
  }
});

bot.on("messageReactionRemove", async (reaction, user) => {
  // Fetch the partials
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  // If it's bot message or message not in guild then exits
  if (user.bot) return;
  if (!reaction.message.guild) return;

  // If the reaction comes from Welcome Channel
  if (reaction.message.channel.id === channels.welcomeChannel) {
    if (accpetedReactions.includes(reaction.emoji.name)) {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove(roles.memberRole)
        .then((unverifiedMember) => {
          const unverifiedMemberEmbed = new Discord.MessageEmbed()
            .setColor(0xe00000) // Red
            .setAuthor(
              unverifiedMember.user.tag,
              unverifiedMember.user.displayAvatarURL()
            )
            .setTitle(`${unverifiedMember.user.tag}`)
            .setDescription(
              `📤 <@${unverifiedMember.user.id}> **is now unverified 😢**`
            )
            .setTimestamp()
            .setThumbnail(unverifiedMember.user.displayAvatarURL());

          return bot.channels
            .fetch(channels.verificationChannel)
            .then((verificationChannel) =>
              verificationChannel.send(unverifiedMemberEmbed)
            );
        });
    }
  }
});

bot.on("guildMemberAdd", (member) => {
  const welcomePM =
    `============**ＳｋｙＨｉｋｅｒ**============\n` +
    `Dear **${member.user.tag}**,\n` +
    `\n*Big WELCOME to our server,*\n` +
    `Are you looking for others channel?\n` +
    `Wondering where are us?\n` +
    `\nHead to our <#${channels.welcomeChannel}> and go through the rules.\n` +
    `\nOnce you are done, react with ✅ to indicate you agree with our terms and conditions.\n` +
    `*#Please **be __AWARE__** of the rules as we already acknowledged*\n` +
    `\nThank you for supporting us.\n` +
    `See ya soon <3\n` +
    `\n**𝕊𝕜𝕪ℍ𝕚𝕜𝕖𝕣**\n` +
    "-";

  member
    .send(welcomePM)
    .then((message) => {
      console.log(`${member.user.tag} has just joined the server.`);
    })
    .catch(console.error);
});

bot.on("guildMemberRemove", (member) => {
  // Send a message at somewhere when someone leaves.
});

// When the bot listened a message
bot.on("message", async (message) => {
  // If the message doesn't startsWith PREFIX or bot is the sender
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  let args = message.content.substring(PREFIX.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  // General Commands
  if (command === "help") {
    message.delete({ timeout: 2000 });
    return bot.commands.get("help").help(message, bot);
  }

  if (command === "shelp") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      const shelpNoPermEmbed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setDescription("You don't have permission to use this command.");

      message.delete({ timeout: 2000 });
      return message.channel.send(shelpNoPermEmbed).then((sentMessage) => {
        sentMessage.delete({ timeout: 3000 });
      });
    }

    message.delete({ timeout: 2000 });
    return bot.commands.get("shelp").shelp(message, bot);
  }

  if (command === "clear") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      const clearNoPermEmbed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setDescription("You don't have permission to use this command.");

      message.delete({ timeout: 2000 });
      return message.channel.send(clearNoPermEmbed).then((sentMessage) => {
        sentMessage.delete({ timeout: 3000 });
      });
    }

    if (!args[0]) {
      return message
        .reply("You didn't specify any amount.")
        .then((sentMessage) => {
          message.delete({ timeout: 1500 });
          sentMessage.delete({ timeout: 3000 });
        });
    } else if (isNaN(args[0])) {
      return message
        .reply("The amount specified is not a number!")
        .then((sentMessage) => {
          message.delete({ timeout: 1500 });
          sentMessage.delete({ timeout: 3000 });
        });
    } else if (args[0] > 100) {
      return message
        .reply("You can't delete more than 100 messages at once!")
        .then((sentMessage) => {
          message.delete({ timeout: 1500 });
          sentMessage.delete({ timeout: 3000 });
        });
    } else if (args[0] < 1) {
      return message
        .reply("You have to delete at least one message!")
        .then((sentMessage) => {
          message.delete({ timeout: 1500 });
          sentMessage.delete({ timeout: 3000 });
        });
    }
    await message.channel.messages
      .fetch({ limit: parseInt(args[0]) + 1 })
      .then((messages) => {
        message.channel
          .bulkDelete(messages)
          .then((messages) =>
            message.channel
              .send(`Deleted \`${messages.size - 1}\` messages.`)
              .then((sentMessage) => sentMessage.delete({ timeout: 1500 }))
          );
      });
  }

  // Moderation Commands
  if (command === "ban") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      const banNoPermEmbed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setDescription("You don't have a permission to ban a player.");

      message.delete({ timeout: 2000 });
      return message.channel.send(banNoPermEmbed).then((sentMessage) => {
        sentMessage.delete({ timeout: 3000 });
      });
    }

    let user = message.mentions.members.first();

    if (!user) {
      try {
        if (!(await message.guild.members.fetch(args.slice(0)[0])))
          throw new Error("Couldn't get a Discord User with this User ID.");

        user = await message.guild.members.fetch(args.slice(0)[0]);
      } catch (error) {
        console.log(error);
        const noTagEmbed = new Discord.MessageEmbed()
          .setColor(embedColor)
          .setDescription("**Couldn't get a Discord User with this User ID.**");

        message.delete({ timeout: 2000 });
        return message.channel.send(noTagEmbed).then((sentMessage) => {
          sentMessage.delete({ timeout: 3000 });
        });
      }
    }

    const options = {
      banUser: user,
      banDuration: parseInt(args.slice(1)[0]),
      banReason: args.slice(2).join(" "),
    };

    message.delete({ timeout: 2000 });
    return bot.commands.get("ban").ban(message, bot, options);
  }

  if (command === "unban") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      const banNoPermEmbed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setDescription("You don't have a permission to unban a player.");

      message.delete({ timeout: 2000 });
      return message.channel.send(banNoPermEmbed).then((sentMessage) => {
        sentMessage.delete({ timeout: 3000 });
      });
    }

    const options = {
      unbanUserID: args[0].startsWith("<") ? args[0].slice(3, -1) : args[0],
      unbanReason: args[1] ? args.slice(1).join(" ").trim() : "No Reason.",
    };

    message.delete({ timeout: 2000 });
    return bot.commands.get("unban").unban(message, bot, options);
  }

  if (command === "checkban") {
    message.delete({ timeout: 2000 });
    return bot.commands.get("checkban").checkban(message, bot);
  }

  if (command === "announce") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      message.delete({ timeout: 2000 });
      return message.channel
        .send("You don't have permission")
        .then((sentMessage) => sentMessage.delete({ timeout: 3000 }));
    }

    if (!args.length)
      return message.channel.send(
        `Please use the command this way\n\n${PREFIX}announce <channel> <message>`
      );
    else {
      const announcementAuthor = message.author.username;
      const announceArgs = args.slice(1).join(" ");
      const announceChannel = message.mentions.channels.first();

      if (!announceChannel) {
        message.delete({ timeout: 2000 });
        return message.channel.send("I believe that channel did not exist!");
      } else {
        message.delete({ timeout: 2000 });
        return announceChannel.send(
          announce.announce(announceArgs, announcementAuthor)
        );
      }
    }
  }

  if (command === "poll") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      message.delete({ timeout: 2000 });
      return message.channel
        .send("You don't have permission")
        .then((sentMessage) => sentMessage.delete({ timeout: 3000 }));
    }

    if (!args.length)
      return message.channel.send("What poll you want to create?");
    else {
      const pollAuthor = message.author.username;
      const pollArgs = args.slice(1).join(" ");
      const pollChannel = message.mentions.channels.first();

      if (!pollChannel) {
        message.delete({ timeout: 2000 });
        return message.channel.send("I believe that channel did not exist");
      } else {
        message.delete({ timeout: 2000 });
        return pollChannel.send(poll.poll(pollArgs, pollAuthor, botAvatar));
      }
    }
  }

  if (command === "event") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      message.delete({ timeout: 2000 });
      return message.channel
        .send("You don't have permission")
        .then((sentMessage) => sentMessage.delete({ timeout: 3000 }));
    }

    if (!args.length)
      return message.channel.send("What event you want to broadcast?");
    else {
      const eventAuthor = message.author.username;
      const eventArgs = args.slice(1).join(" ");
      const eventChannel = message.mentions.channels.first();

      if (!eventChannel) {
        message.delete({ timeout: 2000 });
        return message.channel.send("I believe that channel did not exist");
      } else {
        message.delete({ timeout: 2000 });
        return eventChannel.send(event.event(eventArgs, eventAuthor));
      }
    }
  }

  if (command === "update") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      message.delete({ timeout: 2000 });
      return message.channel
        .send("You don't have permission")
        .then((sentMessage) => sentMessage.delete({ timeout: 3000 }));
    }

    if (!args.length)
      return message.channel.send("What event you want to broadcast?");
    else {
      const updateAuthor = message.author.username;
      const updateArgs = args.slice(1).join(" ");
      const updateChannel = message.mentions.channels.first();

      if (!updateChannel) {
        message.delete({ timeout: 2000 });
        return message.channel.send("I believe that channel did not exist");
      } else {
        message.delete({ timeout: 2000 });
        return updateChannel.send(update.update(updateArgs, updateAuthor));
      }
    }
  }

  if (command === "search") {
    if (!args.length)
      return message.channel.send("What image you want me to search?");
    else {
      message.delete();
      let searchArgs = args.slice(0).join(" ");
      var options = {
        url:
          "http://results.dogpile.com/serp?qc=images&q=pinterest" + searchArgs,
        method: "GET",
        headers: {
          Accept: "text/html",
          "User-Agent": "Chrome",
        },
      };
      request(options, function (error, response, responseBody) {
        if (error) {
          return;
        }

        $ = cheerio.load(responseBody);

        var links = $(".image a.link");

        var urls = new Array(links.length)
          .fill(0)
          .map((v, i) => links.eq(i).attr("href"));
        if (!urls.length) {
          return;
        }
        let imageChannel = bot.channels.cache.get("737931806548033542");
        const searchEmbed = new Discord.MessageEmbed()
          .setImage(urls[Math.floor(Math.random() * urls.length)])
          .setColor(embedColor)
          .setFooter(message.author.username)
          .setTimestamp();
        imageChannel.send(searchEmbed);
      });
    }
  }
  if (message.content.substring(PREFIX.length).startsWith("suggestion")) {
    if (message.channel.id !== channels.suggestionChannel) {
      const invalidChannelEmbed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setTitle(`Invalid Channel`)
        .addField(
          `This command is only available in <#${channels.suggestionChannel}>`
        )
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(invalidChannelEmbed).then((sentMessage) => {
        sentMessage.delete({ timeout: 3000 });
      });
    }
    // Parsing data from template message
    const parsedMesssage = message.content.trim().split("\n");
    const user = {
      IGN: parsedMesssage[1].split(":")[1].trim(),
      suggestion: parsedMesssage[2].split(":")[1].trim(),
      reason: parsedMesssage[3].split(":")[1].trim(),
    };

    try {
      const suggestionEmbed = await storeSuggestion.storeSuggestion(
        user,
        message,
        bot
      );

      return message.channel.send(suggestionEmbed).then((embedMessage) => {
        message.delete({ timeout: 1000 });
        embedMessage.react("⬆️");
        embedMessage.react("⬇️");
      });
    } catch (error) {
      console.log(error.message);
      return message.channel
        .send("An Error Occured\nMake sure your template is correct.")
        .then((sentMessage) => {
          sentMessage.delete({ timeout: 3000 });
        });
    }
  }

  if (
    message.content.substring(PREFIX.length).startsWith("approve") ||
    message.content.substring(PREFIX.length).startsWith("deny")
  ) {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      message.delete({ timeout: 2000 });
      return message.channel
        .send("You have no permission to use this command.")
        .then((sentMessage) => {
          sentMessage.delete({ timeout: 3000 });
        });
    }

    const isApprove = message.content
      .substring(PREFIX.length)
      .startsWith("approve");

    const userArgs = {
      suggestionID: args[0].substring("s".length),
      reason: args.slice(1).join(" "),
    };

    try {
      const respondEmbed = isApprove
        ? await respondSuggestion.respondSuggestion(message, bot, {
            userArgs: userArgs,
            approve: true,
          })
        : await respondSuggestion.respondSuggestion(message, bot, {
            userArgs: userArgs,
            approve: false,
          });
      message.delete({ timeout: 2000 });
      return message.channel.send(respondEmbed);
    } catch (error) {
      console.log(error.message);
      message.delete({ timeout: 2000 });
      return message.channel
        .send("An Error Occured\nPlease contact the Dev Team.")
        .then((sentMessage) => {
          sentMessage.delete({ timeout: 3000 });
        });
    }
  }

  if (command.toLowerCase() === "addwelcomemsg") {
    const addWelcomeEmbed = new Discord.MessageEmbed()
      .setTitle("                    WELCOME TO SKYHIKER 🎉")
      .setThumbnail(serverIcon)
      .setColor(embedColor)
      .setDescription(
        "We're excited see you here with us! Kindly go through to the rules before joining."
      )
      .addField(
        "                            __**GENERAL RULES**__ \n\n" +
          "۰ **Be Nice and respectful** \n      -- No inappropriate or offensive users' information and languages. \n\n" +
          "۰ **No sensitive topics** \n      -- EG. sexually explicit, racism, sexism, xenophobia, politics content. \n\n" +
          "۰ **International language only** \n      -- Kindly respect and make allowance for others. \n\n" +
          "۰ **Credit reliable** \n      -- Advertisement, Scamming, Spamming and Harassment are not allowed. \n\n" +
          "۰ **Punishments application** \n      -- Staff has the rights to held every cases. "
      )
      .addField(
        "\u200b",
        "۰ __**Kindly remain respectful to each others**__ \n"
      )
      .addField("\u200b", "✒️ CLICK TO ACCEPT THE T&C STATED.")
      .setImage(banners.skyHikerBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels
      .fetch(channels.welcomeChannel)
      .then((welcomeChannel) => {
        message.delete({ timeout: 2000 });
        welcomeChannel.send(addWelcomeEmbed).then((embedMessage) => {
          embedMessage.react("✅");
        });
      });
  }

  if (command.toLowerCase() === "addsuggestionmsg") {
    const addSuggestionEmbed = new Discord.MessageEmbed()
      .setTitle("SUGGESTION 💭")
      .setColor(embedColor)
      .setDescription(
        "**We welcome any reasonable and suitable suggestions**\nPlease use the following template to write your suggestion."
      )
      .addField(
        "\u200B",
        "```\n;suggestion\nIGN: \nSuggestion: \nReason: \n```"
      )
      .addField(
        "\u200B",
        "**Staff will respond to your suggestions within 3 days**"
      )
      .setImage(banners.suggestionBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels
      .fetch(channels.suggestionChannel)
      .then((suggestionChannel) => {
        message.delete({ timeout: 2000 });
        suggestionChannel.send(addSuggestionEmbed);
      });
  }

  if (command.toLowerCase() === "addpollsmsg") {
    const addPollsEmbed = new Discord.MessageEmbed()
      .setTitle("POLLS 📊")
      .setColor(embedColor)
      .setDescription("Help us make a decision by voting in the poll!")
      .setImage(banners.pollsBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.pollsChannel).then((pollsChannel) => {
      message.delete({ timeout: 2000 });
      pollsChannel.send(addPollsEmbed);
    });
  }

  if (command.toLowerCase() === "addsupportmsg") {
    const addSupportEmbed = new Discord.MessageEmbed()
      .setTitle("SUPPORT 📬")
      .setColor(embedColor)
      .addField(
        "**Report Player Format**",
        "```\nYour IGN: \nPlayer: \nReason: \n```"
      )
      .addField("**Server Issue Format**", "```\nYour IGN: \nIssue: \n```")
      .addField("**Enquiries Format**", "```\nYour IGN: \nQuestion: \n```")
      .addField(
        " ",
        "#**Kindly __Follow__ the format given**, or else staff will close the ticket.#"
      )
      .setImage(banners.supportBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.ticketChannel).then((ticketChannel) => {
      message.delete({ timeout: 2000 });
      ticketChannel.send(addSupportEmbed);
    });
  }

  if (command.toLowerCase() === "addeventmsg") {
    const addEventEmbed = new Discord.MessageEmbed()
      .setTitle("EVENT 🎊")
      .setColor(embedColor)
      .addField(
        "**STAY TUNE**",
        "There are a lot of events in the server!\nParticipate and get a chance to win yourself a Legendary Loot! 🎁"
      )
      .setImage(banners.eventBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.eventChannel).then((eventChannel) => {
      message.delete({ timeout: 2000 });
      eventChannel.send(addEventEmbed);
    });
  }

  if (command.toLowerCase() === "addannouncementmsg") {
    const addAnnouncementEmbed = new Discord.MessageEmbed()
      .setTitle("ANNOUNCEMENT 📢")
      .setColor(embedColor)
      .setDescription("Follow up the server status and information with us!")
      .setImage(banners.announcementBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels
      .fetch(channels.announcementChannel)
      .then((announcementChannel) => {
        message.delete({ timeout: 2000 });
        announcementChannel.send(addAnnouncementEmbed);
      });
  }

  if (command.toLowerCase() === "addupdatemsg") {
    const addUpdateEmbed = new Discord.MessageEmbed()
      .setTitle("UPDATES 📈")
      .setColor(embedColor)
      .setDescription("Keep updated on what's going on in this server!")
      .setImage(banners.updateBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.updateChannel).then((updateChannel) => {
      message.delete({ timeout: 2000 });
      updateChannel.send(addUpdateEmbed);
    });
  }

  if (command.toLowerCase() === "addrewardmsg") {
    const addRewardEmbed = new Discord.MessageEmbed()
      .setTitle("REWARDS 🎁")
      .setColor(embedColor)
      .setDescription("Any events winner or rewards will be published at here~")
      .setImage(banners.rewardBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.rewardChannel).then((rewardChannel) => {
      message.delete({ timeout: 2000 });
      rewardChannel.send(addRewardEmbed);
    });
  }

  if (command.toLowerCase() === "addroleallocationmsg") {
    const addRoleallocationEmbed = new Discord.MessageEmbed()
      .setTitle("ROLES ALLOCATION 📛")
      .setColor(embedColor)
      .setDescription("Kindly select your gamemodes in the server ")
      .setImage(banners.roleallocationBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels
      .fetch(channels.roleallocationChannel)
      .then((roleallocationChannel) => {
        message.delete({ timeout: 2000 });
        roleallocationChannel.send(addRoleallocationEmbed);
      });
  }

  if (command.toLowerCase() === "addwhatzupmsg") {
    const addWhatzUpEmbed = new Discord.MessageEmbed()
      .setTitle("WHATZ-UP 💬")
      .setColor(embedColor)
      .setImage(banners.skyHikerBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels
      .fetch(channels.whatzupChannel)
      .then((whatzupChannel) => {
        message.delete({ timeout: 2000 });
        whatzupChannel.send(addWhatzUpEmbed);
      });
  }

  if (command.toLowerCase() === "setavatar") {
    return bot.user
      .setAvatar(botAvatar)
      .then(() => message.channel.send("New avatar is set."));
  }

  if (message.content.startsWith(PREFIX)) {
    message.delete({ timeout: 2000 });
    return message.channel.send("**Invalid command**\nKindly check `;help` for the list of commands.");
  }
});

bot.login(discordToken);
