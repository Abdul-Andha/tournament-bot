module.exports = {
  name: 'disbandTeam',
  description: 'Disbands a team that matches the given name, game, and captain. Team must exist to disband. Team can not be signed up for a tournament.',
  execute(receivedMessage, args, Team) {
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
    
    Team.deleteOne({
      teamName: name,
      game: game,
      capDiscordID: receivedMessage.author.id,
      isInTourney: false
    }, function(err, res) {
      if (res.deletedCount == 0) {
        receivedMessage.channel.send(receivedMessage.author.username + ", make sure you are the captain of the team and the inputs are correct. Also, the team can not be signed up for a tournament.");
        receivedMessage.react('❌');
      } else {
        receivedMessage.channel.send(receivedMessage.author.username + ', your team has been disbanded.');
        receivedMessage.react('✅');
      }
      if (err) {
        helper.handleError(err, receivedMessage, 30);
      }
    });
  }
}