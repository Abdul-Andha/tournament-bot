const helper = require('./helperFunctions');

module.exports = {
  name: 'archiveTourney',
  description: 'Command for higher staff. Used when a tournament is finished. You archive it, so you can reuse name. Format: .archive ["tourneyName"]',
  execute(receivedMessage, args, Tournament, ArchivedTournament) {
    if (args.length != 1) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    
    let tourneyName = args[0];

    Tournament.findOne({name: tourneyName}).then((tournament) => {
      if (tournament) {
        console.log(tournament.toJSON())
        let archived = new ArchivedTournament(tournament.toJSON());
        archived.save().then(() => {
          tournament.remove().catch(err => helper.handleError(err, receivedMessage, 182));
          receivedMessage.channel.send("`" + tourneyName + "` has been archived.");
          receivedMessage.react('✅');
        }).catch(err => helper.handleError(err, receivedMessage, 181));
      } else {
        receivedMessage.channel.send('Check your argument. Make sure the tournament name is accurate.');
        receivedMessage.react('❌');
      }
    }).catch(err => helper.handleError(err, receivedMessage, 180));
  }
}