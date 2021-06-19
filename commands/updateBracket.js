const helper = require('./helperFunctions');

module.exports = {
  name: 'updateBracket',
  description: 'Command for higher staff. Winning team must be on the bracket and in the specified round. Format: .reportwinner ["tourneyName"] [round number] [winning team name]',
  execute(receivedMessage, args, Tournament) {
    if (args.length != 3) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    tourneyName = args[0];
    roundNum = parseInt(args[1]);
    winningTeam = args[2];
    
    if (winningTeam == "Bye" || winningTeam == "TBD") {
      receivedMessage.channel.send(winningTeam + " can't win.");
      return receivedMessage.react('😐');
    }

    Tournament.findOne({name: tourneyName}).then((tournament) => {
      if (tournament) {
        let winningIdx = tournament.bracket[roundNum - 1].indexOf(winningTeam);
        if (winningIdx == -1) {
          receivedMessage.channel.send("That team is not in round " + roundNum + " of this tournament.");
          receivedMessage.react('❌');
        } else {
          let nextWinningIdx = Math.floor(winningIdx / 2);
          tournament.bracket[roundNum][nextWinningIdx] = winningTeam;
          tournament.markModified('bracket');
          tournament.save().then(() => {
            receivedMessage.channel.send("`" + winningTeam + "`  has been moved on to round " + (roundNum + 1) + "!");
            receivedMessage.react('✅');
          }).catch(err => helper.handleError(err, receivedMessage, 161));
        }
      } else {
        receivedMessage.channel.send('Check your argument. Make sure the tournament name is accurate.');
        receivedMessage.react('❌');
      }
    }).catch(err => {
      helper.handleError(err, receivedMessage, 160);
    });
  }
}