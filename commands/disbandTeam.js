let Team;
let teamDb;

module.exports = {
  name: 'disbandTeam',
  description: 'Disbands a team that matches the given name, game, and captain. Team must exist to disband. Team can not be signed up for a tournament.',
  execute(receivedMessage, args, TeamModel) {
    if (args.length != 2) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let name = args[0];
    let game = args[1];
    
    
    Team = TeamModel;
    let deleted = true;
    
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
        receivedMessage.channel.send('An error occurred. Please screenshot this and contact Thunder#6228. Error code: 30');
        receivedMessage.react('❌');
        console.log(err);
      }
    });
  }
}