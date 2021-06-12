const helper = require('./helperFunctions');

let Team;
let teams = []; //teams in this tourney
let tournament; // the specific tourney the user is trying to sign up for

module.exports = {
  name: 'signupTeam',
  description: 'Format: .signup ["Tourney Name"] [teamCode]. Command for captains. User will be captain of the team and therefore, can not be captain of any other team in this tournament. Team code will be used to get team name. Team of that name can not already be signed up for the tourney. Captain must invite themselves seperately if they want to be a player.',
  execute(receivedMessage, args, TeamModel, TournamentModel, googleSheet) {
    if (args.length < 4) {
      receivedMessage.channel.send("Invalid format: Not enough arguments.");
      return receivedMessage.react('❌');
    }
    
    let teamName = args[1];
    let teamCode = args[2];
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
            } else {
              createTeam(receivedMessage, teamName, args[1])
              .then((res) => {
                signUpTeam(res)
                .then((res) => {
                  receivedMessage.channel.send("Success! To confirm sign up, invite players using `.invite <Tournament Name> <TeamName>`.");
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

async function signUpTeam(team) {
  tournament.teamIds.push(team._id);
  await tournament.save()
    .catch((err) => {
      helper.handleError(err, receivedMessage, 62);
    });
}

async function createTeam(receivedMessage, name) {
  let captain = receivedMessage.author;
  
  const team = new Team({
    teamName: name,
    capName: captain.username,
    capDiscordId: captain.id,
    playerDiscordIds: [],
    inviteeDiscordIds: [],
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