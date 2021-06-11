const helper = require('./helperFunctions');
let tourneyName;
let teams = null; //teams in the tourney that the captain is referencing
let receivedMessage; //users message that called the command
let player = null; //the invitee
let targetTeam = null;
let teamName;
let captain;

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
    
    initialize(Team, Tournament).then(() => {
      console.log(player, targetTeam, teams)
      if (player && targetTeam && teams) {
        if (helper.isInTeam(12, teams)) {
          receivedMessage.channel.send('The player you are trying to invite is in another team in this tournament.');
          receivedMessage.react('❌');
        } else if (targetTeam.playerDiscordIds.length >= targetTeam.maxPlayers) {
          receivedMessage.channel.send('Your team is full.');
          receivedMessage.react('❌');
        } else {
          invitePlayer(player, targetTeam).then(() => {
            receivedMessage.channel.send(player.username + " has been invited. To accept, they have to run `.acceptinvite [\"tourneyName\"] [\"teamName\"]` ");
            receivedMessage.react('✅');
          }).catch(err => {
            helper.handleError(err, receivedMessage, 52);
          })
        }
      } else {
        receivedMessage.channel.send('Check your arguments. Make sure the tournament name and team name are accurate. Make sure you @ the player.');
        receivedMessage.react('❌');
      }
    }).catch(err => {
      helper.handleError(err, receivedMessage, 50);
    });
  }
}

async function invitePlayer(player, team) {
  team.inviteeDiscordIds.push(player.id);
  await team.save()
    .catch((err) => {
      helper.handleError(err, receivedMessage, 51);
    });
}

//inits players and teams so they can be used later
async function initialize(Team, Tournament) {
  player = receivedMessage.mentions.users.first();
  
  let tournament = await Tournament.findOne({name: tourneyName});
  if (!tournament)
    return;
    
  await Team.find({
    '_id': {$in: tournament.teamIds}
  }, function(err, res) {
    teams = res;
  });
  
  targetTeam = await teams.find(obj => obj.teamName == teamName);
  console.log(targetTeam)
}