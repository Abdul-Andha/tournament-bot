const helper = require('./helperFunctions');
let tourneyName;
let game;
let teams; //teams in the tourney that the captain is referencing

module.exports = {
  name: 'invitePlayer',
  description: 'Command for captains. User must be captain of the team and invitee must not be in another team. Invitee can have an outstanding invite. Team can not be full. Format: .invite ["tourneyName"] ["teamName"] [game] [@player]',
  execute(receivedMessage, args, Team, Tournament) {
    if (args.length < 4) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    tourneyName = args[0];
    let teamName = args[1];
    game = args[2]
    let player = receivedMessage.mentions.members.first().user;
    let captain = receivedMessage.author;
    
    initialize(Team, Tournament).then(() => {
      Team.findOne({teamName: teamName, game: game, capDiscordId: captain.id})
      .then ((team) => {
        if (team) {
          if (helper.isInTeam(player.id, game, teams)) {
            receivedMessage.channel.send('The player you are trying to invite is in another team.');
            receivedMessage.react('❌');
          } else if (team.playerDiscordIds >= team.maxPlayers) {
            receivedMessage.channel.send('Your team is full.');
            receivedMessage.react('❌');
          } else {
            invitePlayer(player, team).then(() => {
              receivedMessage.channel.send(player.username + " has been invited. To accept, they have to run `.acceptinvite [team name][tournament name]` ");
              receivedMessage.react('✅');
            }).catch(err => {
              helper.handleError(err, receivedMessage, 53);
            })
          }
        } else {
          receivedMessage.channel.send('Either that team does not exist or you are not its captain.');
          receivedMessage.react('❌');
        }
      }).catch((err) => {
        helper.handleError(err, receivedMessage, 51);
      });
    }).catch(err => {
      helper.handleError(err, receivedMessage, 50);
    });
  }
}

async function invitePlayer(player, team) {
  team.inviteeDiscordIds.push(player.id);
  await team.save()
    .catch((err) => {
      helper.handleError(err, receivedMessage, 52);
    });
}

//inits players and teams so they can be used later
async function initialize(Team, Tournament) {
  let tournament = await Tournament.findOne({name: tourneyName, game: game})
  await Team.find({
    '_id': {$in: tournament.teamIds}
  }, function(err, res) {
    teams = res;
  });
}