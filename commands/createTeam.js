const helper = require('./helperFunctions');
let Team;
let Player;
let teamDb;
let playerDb;
const validGames = ["csgo", "lol", "valorant", "r6s", "overwatch", "rocketleague", "coldwar", "pubgm", "wia", "cops", "wildrift", "codm"];

module.exports = {
  name: 'createTeam',
  description: 'Creates a new team. The user of this command will be the captain. User must be registered and not in an existing team. args will be team name and game. The same team name can not be repeated in that game.',
  execute(receivedMessage, args, PlayerModel, TeamModel) {
    if (args.length < 2) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let game = args[0];
    let name = "";
    for (let i = 1; i < args.length - 1; i++) {
      name += args[i] + " ";
    }
    name += args[args.length - 1];
    
    if (!validGames.includes(game.toLowerCase())) {
      receivedMessage.channel.send('Invalid game. Check the list of games again.');
      return receivedMessage.react('❌');
    }
    Player = PlayerModel
    Team = TeamModel;
    
    initializeDbs()
      .then((res) => {
        if (meetsConditions(receivedMessage, name, game)) {
          createTeam(receivedMessage, name, game);
        } else {
          receivedMessage.react('❌');
        }
      })
      .catch((err) => {
        helper.handleError(err, receivedMessage, 20);
      });
  }
}

function meetsConditions(receivedMessage, name, game) {
  let returnValue = true;
  let captain = receivedMessage.author;
  let errorMsg = "";
    
  if (!helper.isRegistered(captain.id, playerDb)) {
    errorMsg += "Error: " + captain.username + ", you must be registered to create a team. \n";
    returnValue = false;
   }
  
  if (!isTeamNameUnique(name, game, teamDb)) {
    errorMsg += "Error: " + captain.username + ", a team of that name already exists for " + game + "\n";
    returnValue = false;
  }
  
  if (helper.isInTeam(captain.id, game, teamDb)) {
    errorMsg += "Error: " + captain.username + ", you are a player in a team for " + game + "\n";
    returnValue = false;
  }
  
  if (helper.isCap(captain.id, game, teamDb)) {
    errorMsg += "Error: " + captain.username + ", you are already a captain for another team in " + game + "\n";
    returnValue = false;
  }
  if (errorMsg != "")
    receivedMessage.channel.send(errorMsg);
  return returnValue;
}

function isTeamNameUnique(name, game, teams) {
  let returnValue = true;
  teams.forEach(ele => {
    if (ele.teamName == name && ele.game == game)
      returnValue = false;
  });
  return returnValue;
}
  
function createTeam(receivedMessage, name, game) {
  let captain = receivedMessage.author;
  const team = new Team({
    teamName: name,
    game: game,
    capName: captain.username,
    capDiscordID: captain.id,
    playerIDs: [captain.id],
    isInTourney: false
  });
  team.save()
    .then((result) => {
      receivedMessage.channel.send(name + " has been successfully created!");
      receivedMessage.react('✅');
    })
    .catch((err) => {
      helper.handleError(err, receivedMessage, 21);
    });
}

async function initializeDbs() {
  teamDb = await Team.find()
    .catch((err) => {
      helper.handleError(err, receivedMessage, 22);
      returnValue = false;
    });
    
  playerDb = await Player.find()
    .catch((err) => {
      helper.handleError(err, receivedMessage, 23);
      returnValue = false;
    });
    
  //console.log(playerDb, teamDb);
}
