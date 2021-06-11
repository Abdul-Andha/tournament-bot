const helper = require('./helperFunctions');

let Team;
let teams = []; //teams in this tourney
let tournament; // the specific tourney the user is trying to sign up for

module.exports = {
  name: 'signupTeam',
  description: 'Format: .signup ["Tourney Name"] ["Team Name"] [teamCode] [@player] [@player] etc for all the players. Command for captains. User will be captain of the team and therefore, can not be captain of any other team in this tournament. Team of that name can not already be signed up for the tourney. Players can not be in another team in this tournament. Captain must include themselves in the @player if they want to be a player as well. Teams must have required number of players.',
  execute(receivedMessage, args, PlayerModel, TeamModel, TournamentModel) {
    if (args.length < 4) {
      receivedMessage.channel.send("Invalid format: Not enough arguments.");
      return receivedMessage.react('❌');
    }
    
    let teamName = args[1];
    let teamCode = args[2];
    Player = PlayerModel;
    Team = TeamModel;
    Tournament = TournamentModel;

    Tournament.findOne({name: args[0]})
      .then((res) => {
        if (res) {
          tournament = res;
          initialize()
          .then((res) => {
            if (nameTaken(teamName)) {
              receivedMessage.channel.send("A team of that name already exists in this tournament.");
              receivedMessage.react('❌');
            } else if (helper.isCap(receivedMessage.author.id, teams)) {
              receivedMessage.channel.send("You are already a captain for another team in this tournament.");
              receivedMessage.react('❌');
            } else if (!arePlayersUnique(receivedMessage.mentions.users.array())) {
              receivedMessage.channel.react('❌');
            } else {
              createTeam(receivedMessage, teamName, args[1])
              .then((res) => {
                signUpTeam(res)
                .then((res) => {
                  receivedMessage.channel.send("Players have been invited. To confirm sign up, the players must accept invite using the command `.acceptinvite [tournament name][team name]`");
                  receivedMessage.react('✅');
                })
              })
            }
          })
        } else {
          receivedMessage.channel.send("Tournament not found. Try again.");
          receivedMessage.react('❌');
        }
      })
      .catch((err) => {
        helper.handleError(err, receivedMessage, 60);
      });
  }
}

function nameTaken(teamName) {
  let returnValue = false;
  teams.forEach(team => {
    if (team.teamName == teamName) {
      returnValue = true;
    }
  });
  return returnValue;
}

// function isCap(capId) {
//   let returnValue = false;
//   teams.forEach(team => {
//     if (team.capDiscordId == capId) {
//       returnValue = true;
//     }
//   });
//   return returnValue;
// }

function arePlayersUnique(mentioned) {
  let returnValue = true;
  teams.forEach(team => {
    team.playerDiscordIds.forEach(id => {
      mentioned.forEach(id => {
        if (mentioned.id == id) {
          returnValue = false;
        }
      });
    });
  });
  return returnValue;
}

async function signUpTeam(team) {
  tournament.teamIds.push(team._id);
  await tournament.save()
    .catch((err) => {
      helper.handleError(err, receivedMessage, 62);
    });
}

async function createTeam(receivedMessage, name) {
  let captain = receivedMessage.author;
  let mentioned = receivedMessage.mentions.users.array();
  let mentionedIds = [];
  
  mentioned.forEach(user => {
    mentionedIds.push(user.id);
  });
  
  const team = new Team({
    teamName: name,
    capName: captain.username,
    capDiscordId: captain.id,
    playerDiscordIds: [],
    inviteeDiscordIds: mentionedIds,
    maxPlayers: tournament.maxPlayers,
    minPlayers: tournament.minPlayers,
    pending: true
  });
  await team.save()
    .catch((err) => {
      helper.handleError(err, receivedMessage, 61);
    });
  return team;
}

//inits teams in tourney so they can be used later
async function initialize() {
  await Team.find({
    '_id': {$in: tournament.teamIds}
  }, function(err, res) {
    teams = res;
  });
}