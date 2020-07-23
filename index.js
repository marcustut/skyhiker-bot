// Modules for Discord
const { Client, MessageEmbed }= require('discord.js');
const main = new Client;

// 3rd Party Modules
const cheerio = require('cheerio');
const request = require('request');

// Self defined modules
const announce = require('./src/announce');
const poll = require('./src/poll');
const event = require('./src/event');
const suggestion = require('./src/suggestion');

// Getting Environment Variables
const PREFIX = process.env.BOT_PREFIX;
const discordToken = process.env.BOT_TOKEN;

main.once('ready', () => {
    console.log("SkyHiker Bot is now Online.");
});

main.on('message', async message => {
    let args = message.content.substring(PREFIX.length).trim().split(" ");
    const command = args.shift().toLowerCase();

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
                let imageChannel = main.channels.cache.get('732201985889140767');
                const searchEmbed = new MessageEmbed()
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
            const suggestionEmbed = await suggestion.storeSuggestion(user, message, main);

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

        const respondEmbed = isApprove ? await suggestion.respondSuggestion(message, main, {userArgs: userArgs, approve: true}) : await suggestion.respondSuggestion(message, main, {userArgs: userArgs, approve: false});

        return message.channel.send(respondEmbed);
    }
});

main.login(discordToken);