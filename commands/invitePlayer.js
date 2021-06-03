const helper = require('./helperFunctions');

module.exports = {
  name: 'invitePlayer',
  description: 'Command for captains. User must be captain of the team and invitee must be registered and not in another team. Invitee can not have an outstanding invite. Team can not be full. Format: .invite [team] [game] [@player]',
  execute(receivedMessage, args, Player, Team) {
    if (args.length < 3) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let teamName = args[0];
    let teamGame = args[1];
    let player = receivedMessage.mentions.members.first();
    Player.find()
    .then ((players) => {
      Team.find()
      .then((teams) => {
        if (!teamExists(receivedMessage.author.id, teamGame, teams)) {
          receivedMessage.channel.send('Either that team does not exist or you are not its captain.');
          receivedMessage.react('❌');
        } else if (!helper.isRegistered(player.id, players)) {
          receivedMessage.channel.send('The player you are trying to invite is not registered. Tell them to do .register');
          receivedMessage.react('❌');
        } else if (helper.isInTeam(player.id, teamGame, teams)) {
          receivedMessage.channel.send('The player you are trying to invite is in another team.');
          receivedMessage.react('❌');
        } else if (helper.hasInvite(player.id)) {
          receivedMessage.channel.send('The player you are trying to invite has an outstanding invite.');
          receivedMessage.react('❌');
        } else {
          invitePlayer();
        }
      })
      .catch((err) => {
        receivedMessage.channel.send("An error occurred. Please screenshot this and contact Thunder#6228. Error code: 50");
        receivedMessage.react('❌');
        console.log(err);
      });
    })
    .catch((err) => {
      receivedMessage.channel.send("An error occurred. Please screenshot this and contact Thunder#6228. Error code: 51");
      receivedMessage.react('❌');
      console.log(err);
    });
  }
}

function teamExists(capID, game, teams) {
  teams.forEach(team => {
    if (team.capDiscordID === capID && team.game === game)
      return true;
  });
  return false;
}

function invitePlayer() {
  players.findOne({discordID: player.id})
    .then((player) => {
      teams.findOne({capDiscordID: receivedMessage.author.id, game: teamGame})
      .then((team) => {
        player.invite = team._id;
        player.save()
      })
    })
}