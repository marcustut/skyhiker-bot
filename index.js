// Modules for Discord
const Discord = require('discord.js');
const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// 3rd Party Modules
const cheerio = require('cheerio');
const request = require('request');

// Self defined modules
const announce = require('./src/server/announce');
const poll = require('./src/server/poll');
const event = require('./src/server/event');
const storeSuggestion = require('./src/features/storeSuggestion');
const respondSuggestion = require('./src/features/respondSuggestion');

// Getting Environment Variables
const PREFIX = process.env.BOT_PREFIX;
const discordToken = process.env.BOT_TOKEN;

// Commands Handler
const fs = require('fs');
const path = require('path');

// Asynchronous function to read files (parallel loop)
const readFiles = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          readFiles(file, function(err, res) {
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

readFiles('./src/', async (err, results) => {
  if (err) throw err;

  for (const commandsFilePath of results) {
    const command = require(commandsFilePath);
    bot.commands.set(command.name, command);
  }
});

// When the bot is online
bot.once('ready', async () => {
    console.log("SkyHiker Bot is now Online.");

    let messageID = '730948451491119286';
    let welcomeChannel = bot.channels.fetch('730940617034825774');
});

bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) {
        let { id } = reaction.message;
        if (id === '730948451491119286') {

        }
    }
});

// When the bot listened a message
bot.on('message', async message => {
    let args = message.content.substring(PREFIX.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if (command === 'help') {
      return bot.commands.get('help').help(message, bot);
    }

    // Moderation Commands
    if (command === 'ban') {
        if (!message.member.roles.cache.get("730940617030500379")) {
            const banNoPermEmbed = new Discord.MessageEmbed()
                .setColor(0xffc300) // Golden Poppy
                .setDescription("You don't have a permission to ban a player.");

            return message.channel.send(banNoPermEmbed);
        }
        if (!message.mentions.members.first()) {
            const noTagEmbed = new Discord.MessageEmbed()
                .setColor(0xffc300) // Golden Poppy
                .setDescription(
                "Please specify who you want to ban with '@' followed by his/her name."
                );

            return message.channel.send(noTagEmbed);
        }

        const options = {
            banUser: message.mentions.members.first(),
            banDuration: parseInt(args.slice(1)[0]),
            banReason: args.slice(2).join(" ")
        }
        // console.log(options.banUser.user.tag);
        return bot.commands.get('ban').ban(message, bot, options);
    }

    if (command === 'unban') {
      if (!message.member.roles.cache.get("730940617030500379")) {
        const banNoPermEmbed = new Discord.MessageEmbed()
            .setColor(0xffc300) // Golden Poppy
            .setDescription("You don't have a permission to unban a player.");

        return message.channel.send(banNoPermEmbed);
      }

      const options = {
          unbanUserID: args[0].startsWith('<') ? args[0].slice(3, -1) : args[0],
          unbanReason: args.slice(1).join(" ").trim()
      }
      return bot.commands.get('unban').unban(message, bot, options);
    }

    if (command === 'checkban') {
      return bot.commands.get('checkban').checkban(message, bot);
    }

    if(command === 'announce'){
        if(!message.member.roles.cache.get('730940617030500379')){
            return message.channel.send("You don't have permission");
        }
        if(!args.length){
            return message.channel.send(process.env.prefix + "announce <channel> <message>");
        } else {
            let announceWhosend = message.author.username
            let announceArgs = args.slice(1).join(" ")
            let announceChannel = message.mentions.channels.first()
            if(!announceChannel){
                return message.channel.send("I believe that channel did not exist!")
            } else {
                return announceChannel.send(announce.announce(announceArgs, announceWhosend))
            }
        }
    }
    if(command === 'poll'){
        if(!message.member.roles.cache.get('730940617030500379')){
            return message.channel.send("You don't have permission");
        }
        if(!args.length){
            return message.channel.send("What poll you want to create?");
        } else {
            let pollWhosend = message.author.username;
            let pollArgs = args.slice(1).join(" ");
            let pollChannel = message.mentions.channels.first()
            if(!pollChannel){
                return message.channel.send("I believe that channel did not exist")
            } else {
                return pollChannel.send(poll.poll(pollArgs, pollWhosend));
            }
        }
    }
    if(command === 'event'){
        if(!message.member.roles.cache.get('730940617030500379')){
            return message.channel.send("You don't have permission");
        }
        if(!args.length){
            return message.channel.send("What event you want to broadcast?");
        } else {
            let eventWhosend = message.author.username;
            let eventArgs = args.slice(1).join(" ");
            let eventChannel = message.mentions.channels.first()
            if(!eventChannel){
                return message.channel.send("I believe that channel did not exist")
            } else {
                return eventChannel.send(event.event(eventArgs, eventWhosend));
            }
        }
    }
    if(command === 'search'){
        if(!args.length){
            return message.channel.send("What image you want me to search?");
        } else {
            message.delete();
            let searchArgs = args.slice(0).join(" ");
            var options = {
                url: "http://results.dogpile.com/serp?qc=images&q=pinterest" + searchArgs,
                method: "GET",
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                }
            }
            request(options, function(error, response, responseBody) {

                if (error) {
                    return
                }
    
                $ = cheerio.load(responseBody)
        
                var links = $(".image a.link")
    
                var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"))
                if (!urls.length) {
                    return
                }
                let imageChannel = bot.channels.cache.get('732201985889140767');
                const searchEmbed = new Discord.MessageEmbed()
                .setImage( urls[Math.floor(Math.random() * urls.length)])
                .setColor(0xE5C918)
                .setFooter(message.author.username)
                .setTimestamp();
                imageChannel.send(searchEmbed);
            })
        }
    }
    if (message.content.substring(PREFIX.length).startsWith('suggestion')) {
        // Parsing data from template message
        const parsedMesssage = message.content.trim().split('\n');
        const user = {
            IGN: parsedMesssage[1].split(':')[1].trim(),
            suggestion: parsedMesssage[2].split(':')[1].trim(),
            reason: parsedMesssage[3].split(':')[1].trim()
        };

        try {
            const suggestionEmbed = await storeSuggestion(user, message, bot);

            return (
                message.channel.send(suggestionEmbed).then(embedMessage => {
                    embedMessage.react("⬆️");
                    embedMessage.react("⬇️");
                })
            );
        } catch (error) {
            console.log(error.message);
            return message.channel.send('An Error Occured\nMake sure your template is correct.');
        }
    }

    if (message.content.substring(PREFIX.length).startsWith('approve') || message.content.substring(PREFIX.length).startsWith('deny')) {
        if (!message.member.roles.cache.get('730940617034825772') && !message.member.roles.cache.get('730940617034825771') && !message.member.roles.cache.get('730940617034825770')) {
            return message.channel.send('You have no permission to use this command.');
        }

        const isApprove = message.content.substring(PREFIX.length).startsWith('approve');

        const userArgs = {
            suggestionID: args[0].substring('s'.length),
            reason: args.slice(1).join(" ")
        }

        try {
            const respondEmbed = isApprove ? await respondSuggestion(message, bot, {userArgs: userArgs, approve: true}) : await respondSuggestion(message, bot, {userArgs: userArgs, approve: false});
            return message.channel.send(respondEmbed);
        } catch (error) {
            console.log(error.message);
            return message.channel.send('An Error Occured\nPlease contact the Dev Team.');
        }
    }
});

bot.login(discordToken);