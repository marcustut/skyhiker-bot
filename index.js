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
const storeSuggestion = require("./src/features/storeSuggestion");
const respondSuggestion = require("./src/features/respondSuggestion");

// Getting Environment Variables
const PREFIX = process.env.BOT_PREFIX;
const discordToken = process.env.BOT_TOKEN;

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

// Constants Vars
const roles = {
  memberRole: '737931806187323446',
  staffRole: '737931806187323448'
};

const channels = {
  welcomeChannel: '737931806221009012',
  suggestionChannel: '737931806548033541',
  announcementChannel: '737931806221009015',
  eventChannel: '737931806221009017',
  ticketChannel: '737931806548033536',
  pollsChannel: '737931806548033538',
  whatzupChannel: '737931806548033540'
};

const banners = {
  skyHikerBanner: 'https://i.ibb.co/NC59c2V/Sky-Hiker-Banner.png',
  announcementBanner: 'https://i.ibb.co/7gwF1vX/Announcement-Banner.jpg',
  eventBanner: 'https://i.ibb.co/XxnpMqG/Event-Banner.jpg',
  pollsBanner: 'https://i.ibb.co/zsDjBcF/Polls-Banner.jpg',
  suggestionBanner: 'https://i.ibb.co/M59Xfbs/Suggestion-Banner.jpg',
  supportBanner: 'https://i.ibb.co/52jpdZJ/Support-Banner.jpg'
};

const botAvatar = 'https://i.ibb.co/z5ct5rp/shlogo.png';

const accpetedReactions = ['✅'];

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
      await reaction.message.guild.members.cache.get(user.id).roles.add(roles.memberRole);
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
      await reaction.message.guild.members.cache.get(user.id).roles.remove(roles.memberRole);
    }
  }
});

bot.on("guildMemberAdd", member => {
  const welcomePM = `============**ＳｋｙＨｉｋｅｒ**============\n` +
                    `Dear **${member.user.tag}**,\n` +
                    `\n**Big WELCOME to our server,**\n` +
                    `Are you looking for others channel?\n` +
                    `Wondering where are us?\n` +
                    `\nHead to our <#${channels.welcomeChannel}> and go through the rules.\n` +
                    `\nOnce you are done, react with ✅ to indicate you agree with our terms and conditions.\n` +
                    `**#Please be __AWARE__ of the rules as we already acknowledged**\n` +
                    `\nThank you for supporting us.\n` +
                    `See ya soon <3\n` +
                    `\n**𝕊𝕜𝕪ℍ𝕚𝕜𝕖𝕣**\n` +
                    '-';

  member.send(welcomePM)
    .then(message => {
      console.log(`${member.user.tag} has just joined the server.`);
    })
    .catch(console.error);
});

bot.on("guildMemberRemove", member => {
  // Send a message at somewhere when someone leaves.
});

// When the bot listened a message
bot.on("message", async (message) => {
  // If the message doesn't startsWith PREFIX or bot is the sender
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  let args = message.content.substring(PREFIX.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "help") {
    message.delete({ timeout: 2000 });
    return bot.commands.get("help").help(message, bot);
  }

  if (command === "shelp") {
    message.delete({ timeout: 2000 });
    return bot.commands.get("shelp").shelp(message, bot);
  }

  // Moderation Commands
  if (command === "ban") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      const banNoPermEmbed = new Discord.MessageEmbed()
        .setColor(0xffc300) // Golden Poppy
        .setDescription("You don't have a permission to ban a player.");

      message.delete({ timeout: 2000 })
      return message.channel.send(banNoPermEmbed).then(sentMessage => {
        sentMessage.delete({ timeout: 3000 });
      });
    }
    if (!message.mentions.members.first()) {
      const noTagEmbed = new Discord.MessageEmbed()
        .setColor(0xffc300) // Golden Poppy
        .setDescription(
          "Please specify who you want to ban with '@' followed by his/her name."
        );

      message.delete({ timeout: 2000 });
      return message.channel.send(noTagEmbed).then(sentMessage => {
        sentMessage.delete({ timeout: 3000 });
      });
    }

    const options = {
      banUser: message.mentions.members.first(),
      banDuration: parseInt(args.slice(1)[0]),
      banReason: args.slice(2).join(" "),
    };

    message.delete({ timeout: 2000 });
    return bot.commands.get("ban").ban(message, bot, options);
  }

  if (command === "unban") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      const banNoPermEmbed = new Discord.MessageEmbed()
        .setColor(0xffc300) // Golden Poppy
        .setDescription("You don't have a permission to unban a player.");

      message.delete({ timeout: 2000 });
      return message.channel.send(banNoPermEmbed).then(sentMessage => {
        sentMessage.delete({ timeout: 3000 });
      });
    }

    const options = {
      unbanUserID: args[0].startsWith("<") ? args[0].slice(3, -1) : args[0],
      unbanReason: args.slice(1).join(" ").trim(),
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
      return message.channel.send("You don't have permission").then(sentMessage => sentMessage.delete({ timeout: 3000 }));
    }

    if (!args.length) 
      return message.channel.send(`Please use the command this way\n\n${PREFIX}announce <channel> <message>`);
    else {
      const announcementAuthor = message.author.username;
      const announceArgs = args.slice(1).join(" ");
      const announceChannel = message.mentions.channels.first();

      if (!announceChannel)
        return message.channel.send("I believe that channel did not exist!");
      else 
        return announceChannel.send(announce.announce(announceArgs, announcementAuthor));
    }
  }
  if (command === "poll") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      message.delete({ timeout: 2000 });
      return message.channel.send("You don't have permission").then(sentMessage => sentMessage.delete({ timeout: 3000 }));
    }

    if (!args.length) 
      return message.channel.send("What poll you want to create?");
    else {
      const pollAuthor = message.author.username;
      const pollArgs = args.slice(1).join(" ");
      const pollChannel = message.mentions.channels.first();

      if (!pollChannel) 
        return message.channel.send("I believe that channel did not exist");
      else 
        return pollChannel.send(poll.poll(pollArgs, pollAuthor, botAvatar));
    }
  }
  if (command === "event") {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      message.delete({ timeout: 2000 });
      return message.channel.send("You don't have permission").then(sentMessage => sentMessage.delete({ timeout: 3000 }));
    }

    if (!args.length) 
      return message.channel.send("What event you want to broadcast?");
    else {
      const eventAuthor = message.author.username;
      const eventArgs = args.slice(1).join(" ");
      const eventChannel = message.mentions.channels.first();

      if (!eventChannel)
        return message.channel.send("I believe that channel did not exist");
      else 
        return eventChannel.send(event.event(eventArgs, eventAuthor));
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
          .setColor(0xffc300)
          .setFooter(message.author.username)
          .setTimestamp();
        imageChannel.send(searchEmbed);
      });
    }
  }
  if (message.content.substring(PREFIX.length).startsWith("suggestion")) {
    if (message.channel.id !== channels.suggestionChannel) {
      const invalidChannelEmbed = new Discord.MessageEmbed()
        .setColor(0xffc300)
        .setTitle(
          `Invalid Channel`
        )
        .addField(`This command is only available in <#${channels.suggestionChannel}>`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp();

      return message.channel
        .send(invalidChannelEmbed)
        .then(sentMessage => {
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
      const suggestionEmbed = await storeSuggestion.storeSuggestion(user, message, bot);

      return message.channel.send(suggestionEmbed).then((embedMessage) => {
        message.delete({ timeout: 1000 });
        embedMessage.react("⬆️");
        embedMessage.react("⬇️");
      });
    } catch (error) {
      console.log(error.message);
      return message.channel.send(
        "An Error Occured\nMake sure your template is correct."
      ).then(sentMessage => { sentMessage.delete({ timeout: 3000 }) });
    }
  }

  if (
    message.content.substring(PREFIX.length).startsWith("approve") ||
    message.content.substring(PREFIX.length).startsWith("deny")
  ) {
    if (!message.member.roles.cache.get(roles.staffRole)) {
      message.delete({ timeout: 2000 });
      return message.channel.send(
        "You have no permission to use this command."
      ).then(sentMessage => { sentMessage.delete({ timeout: 3000 }) });
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
      return message.channel.send(
        "An Error Occured\nPlease contact the Dev Team."
      ).then(sentMessage => { sentMessage.delete({ timeout: 3000 }) });
    }
  }

  if (command.toLowerCase() === 'addwelcomemsg') {
    const addWelcomeEmbed = new Discord.MessageEmbed()
      .setTitle("WELCOME TO SKYHIKER 🎉")
      .setColor(0xffc300)
      .setDescription("We're excited to have you with us here in our Discord Server! Read the rules to start communicating with others.")
      .addField("⚠GENERAL RULES⚠", ":small_blue_diamond: **All Discord users must be 13 or above aged** per the Discord terms of service.\n" + 
                                    ":small_blue_diamond: **No inappropriate or offensive** usernames, languages statuses or profile pictures. You may be asked to change these.\n" + 
                                    ":small_blue_diamond: **No harassment of other players.** Racism, sexism, xenophobia, transphobia, homophobia, misogyny, etc. are never allowed.\n" +
                                    ":small_blue_diamond: **All text channels are English only.** Staff must be able to read all messages sent here.\n" +
                                    ":small_blue_diamond: **No impersonation of other users**, famous personalities, Skyhiker staff.\n" +
                                    ":small_blue_diamond: **Remain respectful** of others at all times." +
                                    ":small_blue_diamond: **Don't evade filters.** This applies to both words and links. If something is censored, it is censored for a reason!")
      .addField("\u200b", ":warning: If you choose to break these rules you'll be asked to stop or kicked from the server. Breaking any of these rules may also result in a ban. But follow these few simple guidelines and we'll all have a good time!\n")
      .addField("\u200b", "👇 CLICK THE EMOJI IF YOU ACCEPT THE RULES")
      .setImage(banners.skyHikerBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.welcomeChannel).then(welcomeChannel => {
      message.delete({ timeout: 2000 });
      welcomeChannel.send(addWelcomeEmbed).then(embedMessage => {
        embedMessage.react("✅");
      });
    });
  }

  if (command.toLowerCase() === 'addsuggestionmsg') {
    const addSuggestionEmbed = new Discord.MessageEmbed()
      .setTitle("SUGGESTION 💭")
      .setColor(0xffc300)
      .setDescription("**We welcome any reasonable and suitable suggestions**\nPlease use the following template to write your suggestion.")
      .addField("\u200B", "```\n;suggestion\nIGN: \nSuggestion: \nReason: \n```")
      .addField("\u200B", "**Staff will respond to your suggestions within 3 days**")
      .setImage(banners.suggestionBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.suggestionChannel).then(suggestionChannel => {
      message.delete({ timeout: 2000 });
      suggestionChannel.send(addSuggestionEmbed);
    });
  }

  if (command.toLowerCase() === 'addpollsmsg') {
    const addPollsEmbed = new Discord.MessageEmbed()
      .setTitle("POLLS 📊")
      .setColor(0xffc300)
      .setDescription("Help us make a decision by voting in the poll!")
      .setImage(banners.pollsBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.pollsChannel).then(pollsChannel => {
      message.delete({ timeout: 2000 });
      pollsChannel.send(addPollsEmbed);
    });
  }

  if (command.toLowerCase() === 'addsupportmsg') {
    const addSupportEmbed = new Discord.MessageEmbed()
      .setTitle("SUPPORT 📬")
      .setColor(0xffc300)
      .addField("**Report Player Format**", "```\nYour IGN: \nPlayer: \nReason: \n```")
      .addField("**Server Issue Format**", "```\nYour IGN: \nIssue: \n```")
      .addField("**Enquiries Format**", "```\nYour IGN: \nQuestion: \n```")
      .addField("⚠FOLLOW THIS FORMAT⚠", "🔹 **You won't get any support if you didn't follow this format** and the Staff team have rights to close your ticket submission!")
      .setImage(banners.supportBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.ticketChannel).then(ticketChannel => {
      message.delete({ timeout: 2000 });
      ticketChannel.send(addSupportEmbed);
    });
  }

  if (command.toLowerCase() === 'addeventmsg') {
    const addEventEmbed = new Discord.MessageEmbed()
      .setTitle("EVENT 🎊")
      .setColor(0xffc300)
      .addField("**STAY TUNE**", "There are a lot of events in the server!\nParticipate and get a chance to win yourself a Legendary Loot! 🎁")
      .setImage(banners.eventBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.eventChannel).then(eventChannel => {
      message.delete({ timeout: 2000 });
      eventChannel.send(addEventEmbed);
    });
  }

  if (command.toLowerCase() === 'addannouncementmsg') {
    const addAnnouncementEmbed = new Discord.MessageEmbed()
      .setTitle("ANNOUNCEMENT 📢")
      .setColor(0xffc300)
      .setDescription("Keep updated on what's going on in this server!")
      .setImage(banners.announcementBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.announcementChannel).then(announcementChannel => {
      message.delete({ timeout: 2000 });
      announcementChannel.send(addAnnouncementEmbed);
    });
  }

  if (command.toLowerCase() === 'addwhatzupmsg') {
    const addWhatzUpEmbed = new Discord.MessageEmbed()
      .setTitle("WHATZ-UP 💬")
      .setColor(0xffc300)
      .setImage(banners.skyHikerBanner)
      .setFooter(bot.user.username, bot.user.displayAvatarURL())
      .setTimestamp();

    return bot.channels.fetch(channels.whatzupChannel).then(whatzupChannel => {
      message.delete({ timeout: 2000 });
      whatzupChannel.send(addWhatzUpEmbed);
    });

  }

  if (command.toLowerCase() === 'setavatar') {
    return bot.user.setAvatar(botAvatar).then(() => message.channel.send('New avatar is set.'));
  }  
});

bot.login(discordToken);
