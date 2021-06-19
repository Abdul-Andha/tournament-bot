const helper = require('./helperFunctions');

module.exports = {
  name: 'updateSignups',
  description: 'Command for higher staff. Tournament must exist. Format: .setsignups ["tourneyName"] on/off',
  execute(receivedMessage, args, Tournament) {
    if (args.length != 2 || (args[1] != "on" && args[1] != "off")) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let tourneyName = args[0];
    let preference = args[1] == "on";

    Tournament.findOne({name: tourneyName}).then((tournament) => {
      if (tournament) {
        tournament.signups = preference;
        tournament.save().then(() => {
          receivedMessage.channel.send("Tournament signups status updated.");
          receivedMessage.react('✅');
        }).catch(err => helper.handleError(err, receivedMessage, 171));
      } else {
        receivedMessage.channel.send('Check your argument. Make sure the tournament name is accurate.');
        receivedMessage.react('❌');
      }
    }).catch(err => {
      helper.handleError(err, receivedMessage, 170);
    });
  }
}