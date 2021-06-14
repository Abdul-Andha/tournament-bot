const helper = require('./helperFunctions');
let tourneyName;
let teams; //teams in the tourney that the captain is referencing
let receivedMessage; //users message that called the command
let players; //the invitee
let targetTeam;
let teamName;
let captain;
let tournament;

module.exports = {
  name: 'invitePlayer',
  description: 'Command for captains. User must be captain of the team and invitee must not be in another team. Invitee can have an outstanding invite. Team can not be full. Format: .invite ["tourneyName"] ["teamName"] [@player]',
  execute(message, args, Team, Tournament) {
    receivedMessage = message;
    if (args.length < 3) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    tourneyName = args[0];
    teamName = args[1];
    captain = receivedMessage.author;

    initialize(Team, Tournament).then((res) => {
      if (res) {
        if (!tournament.rosterChanges) {
          receivedMessage.channel.send("Roster changes are not allowed for " + "`" + tournament.name + "` at this time.");
          receivedMessage.react('❌');
        } else {
          let rejected = [];
          let invited = [];
          for (player of players) {
            if (helper.isInTeam(player.id, teams)) {
              rejected.push(player.username);
            } else if (targetTeam.playerDiscordIds.length >= targetTeam.maxPlayers) {
              receivedMessage.channel.send('Your team is full.');
              receivedMessage.react('❌');
              break;
            } else {
              targetTeam.inviteeDiscordIds.push(player.id);
              invited.push(player.username);
            }
          }
          targetTeam.save().then(() => {
            let returnMsg = "";

            invited.forEach(name => {
              returnMsg += "`" + name + "` has been invited to `" + targetTeam.teamName + "`! \n"
            })
            rejected.forEach(name => {
              returnMsg += "`" + name + "` is in another team for this tournament. \n"
            })

            receivedMessage.channel.send(returnMsg);
            receivedMessage.react('✅');
          }).catch((err) => {
            helper.handleError(err, receivedMessage, 51);
          });
        }
      } else {
        receivedMessage.channel.send('Check your arguments. Make sure the tournament name and team name are accurate. Make sure you @ the players.');
        receivedMessage.react('❌');
      }
    }).catch(err => {
      helper.handleError(err, receivedMessage, 50);
    });
  }
}

//inits players and teams so they can be used later
async function initialize(Team, Tournament) {
  players = receivedMessage.mentions.users.array();

  tournament = await Tournament.findOne({
    name: tourneyName
  });
  if (!tournament)
    return false;

  teams = await Team.find({
    '_id': {
      $in: tournament.teamIds
    }
  });

  targetTeam = await teams.find(obj => obj.teamName == teamName && obj.capDiscordId == captain.id);
  return players.length > 0 && teams && targetTeam;
}
