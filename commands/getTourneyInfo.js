const helper = require('./helperFunctions');
let tournament;
let teams;

module.exports = {
  name: 'getTourneyInfo',
  description: 'Command for higher staff. Gives info about the tournament including name, game, number of teams approved, and number of teams pending. Format: .gettourneyinfo ["tourneyName"]',
  execute(receivedMessage, args, Team, Tournament) {
    if (args.length != 1) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    tourneyName = args[0];

    initialize(Team, Tournament).then((res) => {
      if (res) {
        let returnMsg = "**__Tournament Info__**\n\n";
        returnMsg += "`Name:` " + tourneyName + "\n";
        returnMsg += "`Game:` " + tournament.game + "\n";
        returnMsg += "`Roster Changes Allowed:` " + tournament.rosterChanges + "\n\n";
        returnMsg += getTeams("Approved") + "\n\n";
        returnMsg += getTeams("Pending");
        receivedMessage.channel.send(returnMsg);
        receivedMessage.react('✅');
      } else {
        receivedMessage.channel.send('Tournament not found. Make sure the tournament name is accurate.');
        receivedMessage.react('❌');
      }
    }).catch(err => helper.handleError(err, receivedMessage, 130));
  }
}

async function initialize(Team, Tournament) {
  tournament = await Tournament.findOne({name: tourneyName});
  if (!tournament)
    return false;

  teams = await Team.find({
    '_id': {
      $in: tournament.teamIds
    }
  });

  return tournament && teams;
}

function getTeams(type) {
  let returnValue = "__" + type + " Teams__\n";
  let count = 0;
  
  for (team of teams) {
    if (!team.pending && type == "Approved") {
      returnValue += "`" + team.teamName + "`\n";
      count++;
    } else if (team.pending && type == "Pending") {
      returnValue += "`" + team.teamName + "`\n";
      count++;
    }
  }
  return returnValue + "`Total:` " + count;
}