const mongoose = require('mongoose');
const Discord = require(`discord.js`);
const fs = require(`fs`);
const helper = require('./commands/helperFunctions');

const Player = require('./models/player.js');
const Team = require('./models/team.js');
const Tournament = require('./models/tournament.js');

const uri = "mongodb://thunder:Id223278342@mesatourneydb-shard-00-00.5e4g6.mongodb.net:27017,mesatourneydb-shard-00-01.5e4g6.mongodb.net:27017,mesatourneydb-shard-00-02.5e4g6.mongodb.net:27017/mesaDB?ssl=true&replicaSet=atlas-unw55f-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => console.log("connected to db"))
  .catch((err) => console.log(err));










const bot = new Discord.Client();
const prefix = ".";
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.on(`ready`, () => {
    console.log("Connected as " + bot.user.tag);
});

bot.on(`message`, (receivedMessage) => {
    if (receivedMessage.author == bot.user)
        return;
    if (receivedMessage.content.startsWith(prefix)) {
        processCommand(receivedMessage);
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let mainCommand = splitCommand[0].toLowerCase();
    let args = splitCommand.slice(1);
    if (mainCommand === 'register')
      bot.commands.get('registerPlayer').execute(receivedMessage, Player);
      
    else if (mainCommand === "unregister")
      bot.commands.get('unregisterPlayer').execute(receivedMessage, Player);

    else if ((mainCommand === "createteam" || mainCommand === "ct"))
      bot.commands.get('createTeam').execute(receivedMessage, args, Player, Team);
        
    else if (mainCommand === "disband")
      bot.commands.get('disbandTeam').execute(receivedMessage, args, Team);
      
    else if ((mainCommand === "invite" || mainCommand === "i"))
      bot.commands.get('invitePlayer').execute(receivedMessage, args, Player, Team);
    
    else if ( (mainCommand === "newtourney"|| mainCommand === "newtournament" || mainCommand === "nt") 
    && (helper.hasRole(receivedMessage.member, "Branch Directors") || helper.hasRole(receivedMessage.member, "Pro Manager")) )
      bot.commands.get('createTournament').execute(receivedMessage, args, Tournament);
    
    else if ((mainCommand === "signup" || mainCommand === "s"))
      bot.commands.get('signupTeam').execute(receivedMessage, args, Team, Tournament);
        
    //else receivedMessage.channel.send("Unknown Command");
}

bot.login("ODQ2ODQzMjcyNzE4MTg4NTk0.YK1aQQ.XdCM1cJV4VNDCHtYLQAjLGi7bwQ");