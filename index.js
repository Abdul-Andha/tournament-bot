//connect to db and init models
const mongoose = require('mongoose');
const uri = "mongodb://thunder:Id223278342@mesatourneydb-shard-00-00.5e4g6.mongodb.net:27017,mesatourneydb-shard-00-01.5e4g6.mongodb.net:27017,mesatourneydb-shard-00-02.5e4g6.mongodb.net:27017/mesaDB?ssl=true&replicaSet=atlas-unw55f-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

const Player = require('./models/player.js');
const Team = require('./models/team.js');
const Tournament = require('./models/tournament.js');

//require helper functions
const helper = require('./commands/helperFunctions');

//connect to and init sheets
const {GoogleSpreadsheet} = require('google-spreadsheet');
const creds = require('./creds.json');

let teamSheet;
async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet('1ZHw9BCfi_QPJOfRZPPAAKGE_Qpq0hZETdUWDGBCP21w');
  await doc.useServiceAccountAuth(creds);
  const info = await doc.loadInfo();
  teamSheet = doc.sheetsByIndex[0];
}

accessSpreadsheet().then(() => console.log("connected to sheets"))
.catch((err) => console.log(err));

//init bot
const Discord = require(`discord.js`);
const bot = new Discord.Client();

//init prefix and commands
const prefix = ".";
bot.commands = new Discord.Collection();
const fs = require(`fs`);
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

//connect to bot
bot.on(`ready`, () => {
    console.log("Connected as " + bot.user.tag);
});

//start listening for messages.
bot.on(`message`, (receivedMessage) => {
    if (receivedMessage.author == bot.user)
        return;
    if (receivedMessage.content.startsWith(prefix)) {
        processCommand(receivedMessage);
    }
})

//command handler
function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1); //removes prefix
    
    //turns command into array split on spaces
    //also checks for <> and treats everything inside a set of <>
    //a one argument for the command
    let splitCommand = [];
    let indicatorFound = false;
    let tempArg = "";
    for (let i = 0; i < fullCommand.length; i++) {
      if (fullCommand[i] == " " && !indicatorFound) {
        splitCommand.push(tempArg);
        tempArg = "";
      } else if (fullCommand[i] == "<" && !indicatorFound) {
        indicatorFound = true;
        if (tempArg != "") {
          splitCommand.push(tempArg);
          tempArg = "";
        }
      } else if (fullCommand[i] == ">" && indicatorFound) {
        indicatorFound = false;
      }
      else {
        tempArg += fullCommand[i];
      }
    }
    if (tempArg != "") {
      splitCommand.push(tempArg);
      tempArg = "";
    }
    
    //get mainCommand and args from split command
    let mainCommand = splitCommand[0].toLowerCase();
    let args = splitCommand.slice(1);
    
    //checks mainCommand to determine what command to execute
    if (mainCommand === 'register')
      bot.commands.get('registerPlayer').execute(receivedMessage, Player);
      
    else if (mainCommand === "unregister")
      bot.commands.get('unregisterPlayer').execute(receivedMessage, Player);

    else if ((mainCommand === "createteam" || mainCommand === "ct"))
      bot.commands.get('createTeam').execute(receivedMessage, args, Player, Team);
        
    else if (mainCommand === "disband")
      bot.commands.get('disbandTeam').execute(receivedMessage, args, Team);
      
    else if ((mainCommand === "invite" || mainCommand === "i"))
      bot.commands.get('invitePlayer').execute(receivedMessage, args, Team, Tournament);
      
    else if ((mainCommand === "acceptinvite" || mainCommand === "ai"))
      bot.commands.get('acceptInvite').execute(receivedMessage, args, Team, Tournament);
    
    else if ( (mainCommand === "newtourney"|| mainCommand === "newtournament" || mainCommand === "nt") 
    && (receivedMessage.member) && (helper.hasRole(receivedMessage.member, "Branch Directors") || helper.hasRole(receivedMessage.member, "Pro Manager")) )
      bot.commands.get('createTournament').execute(receivedMessage, args, Tournament);
    
    else if ( (mainCommand === "rosterchange"|| mainCommand === "rc") 
    && (receivedMessage.member) && (helper.hasRole(receivedMessage.member, "Branch Directors") || helper.hasRole(receivedMessage.member, "Pro Manager")) )
      bot.commands.get('rosterChange').execute(receivedMessage, args, Team, Tournament);
      
    else if ( (mainCommand === "setsignups"|| mainCommand === "ss") 
    && (receivedMessage.member) && (helper.hasRole(receivedMessage.member, "Branch Directors") || helper.hasRole(receivedMessage.member, "Pro Manager")) )
      bot.commands.get('updateSignups').execute(receivedMessage, args, Tournament);
    
    else if ((mainCommand === "signup" || mainCommand === "s"))
      bot.commands.get('signupTeam').execute(receivedMessage, args, Team, Tournament, teamSheet);

    else if ((mainCommand === "remove" || mainCommand === "rp"))
      bot.commands.get('removePlayer').execute(receivedMessage, args, Team, Tournament);

    else if ((mainCommand === "roster" || mainCommand === "r"))
      bot.commands.get('showRoster').execute(receivedMessage, args, Team, Tournament);
    
    else if ((mainCommand === "getinfo" || mainCommand === "gi"))
      bot.commands.get('getTeamInfo').execute(bot, receivedMessage, args, Team, Tournament);
      
    else if ((mainCommand === "gettourneyinfo"|| mainCommand === "gti"))
      bot.commands.get('getTourneyInfo').execute(receivedMessage, args, Team, Tournament);
      
    else if ( (mainCommand === "createbracket"|| mainCommand === "cb") 
    && (receivedMessage.member) && (helper.hasRole(receivedMessage.member, "Branch Directors") || helper.hasRole(receivedMessage.member, "Pro Manager")) )
      bot.commands.get('createBracket').execute(receivedMessage, args, Team, Tournament);
      
    else if ( (mainCommand === "reportwinner"|| mainCommand === "rw") 
    && (receivedMessage.member) && (helper.hasRole(receivedMessage.member, "Branch Directors") || helper.hasRole(receivedMessage.member, "Pro Manager")) )
      bot.commands.get('updateBracket').execute(receivedMessage, args, Tournament);
      
    else if (mainCommand === "help" || mainCommand === "h")
      bot.commands.get('help').execute(receivedMessage, args);
    //else receivedMessage.channel.send("Unknown Command");
}

//login as bot
bot.login("ODQ2ODQzMjcyNzE4MTg4NTk0.YK1aQQ.XdCM1cJV4VNDCHtYLQAjLGi7bwQ");