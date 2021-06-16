const helper = require('./helperFunctions');

let Team;
let teams = []; //teams in this tourney
let tournament; // the specific tourney the user is trying to sign up for
let targetRow; //the row in sheet that stores the info of the target team. undefined if team code isnt found

module.exports = {
  name: 'signupTeam',
  description: 'Format: .signup ["Tourney Name"] [teamCode]. Command for captains. User will be captain of the team and therefore, can not be captain of any other team in this tournament. Team code will be used to get team name. Team of that name can not already be signed up for the tourney. Captain must invite themselves seperately if they want to be a player.',
  execute(receivedMessage, args, TeamModel, TournamentModel, googleSheet) {
    if (args.length != 2) {
      receivedMessage.channel.send("Invalid format: Not enough arguments.");
      return receivedMessage.react('❌');
    }
    
    let tourneyName = args[0];
    let teamCode = args[1];
    let teamName = "test";
    Team = TeamModel;
    Tournament = TournamentModel;

    Tournament.findOne({name: tourneyName})
      .then((res) => {
        if (res) {
          tournament = res;
          initialize()
          .then(() => {
            findTeam(teamCode, googleSheet).then(res => {
              if (!res) {
                receivedMessage.channel.send("That team code does not exist.");
                receivedMessage.react('❌');
              } else if (codeTaken(teamCode)) {
                receivedMessage.channel.send("That team code is already signed up for this tournament.");
                receivedMessage.react('❌');
              } else if (helper.isCap(12, teams)) { //12 = receivedMessage.author.id
                receivedMessage.channel.send("You are already a captain for another team in this tournament.");
                receivedMessage.react('❌');
              } else {
                createTeam(receivedMessage, teamName, args[1])
                .then((res) => {
                  signUpTeam(res)
                  .then((res) => {
                    receivedMessage.channel.send("Success! To confirm sign up, invite players using `.invite <Tournament Name> <Team Name>`.");
                    receivedMessage.react('✅');
                  })
                })
              }
            }).catch(err => {helper.handleError(err, receivedMessage, 63)});
          }).catch(err => {helper.handleError(err, receivedMessage, 64)});
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

function codeTaken(code) {
  let returnValue = false;
  teams.forEach(team => {
    if (team.teamCode == code) {
      returnValue = true;
    }
  });
  return returnValue;
}

async function findTeam(code, sheet) {
  let rows = await sheet.getRows();
  await sheet.loadCells(`A2:F${rows.length + 1}`);
  for (let i = 1; i < rows.length + 1; i++) {
    if (code === sheet.getCell(i, 5).value)
     targetRow = rows[i - 1];
  }
  return targetRow;
}

async function signUpTeam(team) {
  tournament.teamIds.push(team._id);
  await tournament.save()
    .catch((err) => {
      helper.handleError(err, receivedMessage, 62);
    });
}

async function createTeam(receivedMessage, name, code) {
  let captain = receivedMessage.author;
  
  const team = new Team({
    teamName: targetRow["Team Name"].trim(),
    teamCode: code,
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