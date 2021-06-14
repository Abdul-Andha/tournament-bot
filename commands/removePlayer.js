const helper = require('./helperFunctions');
let tourneyName;
let receivedMessage; //users message that called the command
let player; //the invitee
let targetTeam; //team that the user is referencing
let teamName; //name of targetTeam
let captain;

module.exports = {
  name: 'removePlayer',
  description: 'Command for captains. User must be captain of the team and target must be in that team. Team size must be greater than minimum. Format: .remove ["tourneyName"] ["teamName"] [@player]',
  execute(message, args, Team, Tournament) {
    receivedMessage = message;
    if (args.length != 3) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    tourneyName = args[0];
    teamName = args[1];
    captain = receivedMessage.author;

    initialize(Team, Tournament).then((res) => {
      if (res) {
        let idx = targetTeam.playerDiscordIds.indexOf(player.id);
        if (targetTeam.playerDiscordIds.length <= targetTeam.minPlayers) {
          receivedMessage.channel.send('You must have more than ' + targetTeam.minPlayers + ' players on the team to remove someone.');
          receivedMessage.react('❌');
        } else if (idx == -1) {
          receivedMessage.channel.send('`' + player.username + '` is not on your team.');
          receivedMessage.react('❌');
        } else {
          targetTeam.playerDiscordIds.splice(idx, 1);
          targetTeam.save().then(() => {
            receivedMessage.channel.send('`' + player.username + '` has been removed from your team.');
            receivedMessage.react('✅');
          })
        }
      } else {
        receivedMessage.channel.send('Check your arguments. Make sure the tournament name and team name are accurate. Make sure you @ the player.');
        receivedMessage.react('❌');
      }
    }).catch(err => {
      helper.handleError(err, receivedMessage, 100);
    });
  }
}

//inits players and teams so they can be used later
async function initialize(Team, Tournament) {
  player = receivedMessage.mentions.users.first();

  let tournament = await Tournament.findOne({
    name: tourneyName
  });
  if (!tournament)
    return false;

  targetTeam = await Team.findOne({
    '_id': {
      $in: tournament.teamIds
    },
    teamName: teamName,
    capDiscordId: captain.id
  });

  return player && targetTeam;
}