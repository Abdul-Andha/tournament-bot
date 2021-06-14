module.exports = {
  name: 'rosterChange',
  description: 'Only available to higher staff. Set the value rosterChanges to args[1]. If rosterChanges is set to false, all outstanding invites for that tournament are deleted. Format: .rosterchange <tournament name> on/off', 
  execute(receivedMessage, args, TeamModel, TournamentModel) {
    Tournament = TournamentModel;
    
    if (args.length != 2) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let tourneyName = args[0];
    let preference = args[1];
    
    Tournament.findOne({name: tourneyName}).then((tournament) => {
      if (!tournament) {
        receivedMessage.channel.send('Invalid name. A tournament of that name does not exist.');
        receivedMessage.react('❌');
      } else {
        if (preference == "on") {
          tournament.rosterChanges = true;
          receivedMessage.channel.send("Roster changes are now allowed for `" + tourneyName + "`.");
          receivedMessage.react('✅');
        } else if (preference == "off") {
          tournament.rosterChanges = false;
          deleteOutstandingInvites(TeamModel, tournament).then(() => {
            receivedMessage.channel.send("Roster changes are no longer allowed for` " + tourneyName + "`. All outstanding invites have been deleted.");
            receivedMessage.react('✅');
          }).catch(err => {helper.handleError(err, receivedMessage, 92)});
        } else {
          receivedMessage.channel.send("Invalid argument. Put `'on'` or `'off'`");
          receivedMessage.react('❌');
        }
    
        tournament.save().catch((err) => {helper.handleError(err, receivedMessage, 91)});
      }
    })
    .catch((err) => {helper.handleError(err, receivedMessage, 90)});
  }
}

async function deleteOutstandingInvites(Team, tournament) {
  await Team.find({
    '_id': {$in: tournament.teamIds}
  }, function(err, res) {
    teams = res;
  });
  
  teams.forEach(team => {
    team.inviteeDiscordIds = [];
    team.save().catch(err => {helper.handleError(err, receivedMessage, 93)});
  })
}