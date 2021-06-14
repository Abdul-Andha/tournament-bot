let Tournament;
const validGames = ["csgo", "lol", "valorant", "r6s", "overwatch", "rocketleague", "coldwar", "pubgm", "wia", "cops", "wildrift", "codm"];

module.exports = {
  name: 'createTournament',
  description: 'Only available to higher staff. Can create a tournament. Format: .newtourney [game] [minimum] [maximum] [name]', 
  execute(receivedMessage, args, TournamentModel) {
    Tournament = TournamentModel;
    
    if (args.length != 4) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let game = args[0];
    
    if (!validGames.includes(game.toLowerCase())) {
      receivedMessage.channel.send('Invalid game. Check the list of games again.');
      return receivedMessage.react('❌');
    }
    
    let minimum = args[1];
    let maximum = args[2];
    let name = args[3];
    
    tourneyExists(name)
      .then((res) => {
        if (res) {
          receivedMessage.channel.send('Invalid name. A tournament with that name already exists!');
          return receivedMessage.react('❌');
        } else {
          const tournament = new Tournament({
          name: name,
          game: game,
          minPlayers: minimum, 
          maxPlayers: maximum,
          teamIds: [],
          rosterChanges: true
          });
    
          tournament.save()
          .then((res) => {
            receivedMessage.channel.send(name + " has been successfully created!");
            receivedMessage.react('✅');
          })
          .catch((err) => {
            helper.handleError(err, receivedMessage, 40);
          });
        }
      })
      .catch((err) => {
        helper.handleError(err, receivedMessage, 41);
      });
    
   
  }
}

async function tourneyExists(name) {
  let returnValue = false;
  await Tournament.find()
    .then ((tourneys) => {
      tourneys.forEach(ele => {
        if (ele.name == name) {
          returnValue = true;
        }
      });
    })
    .catch ((err) => {
      helper.handleError(err, receivedMessage, 42);
    })
  return returnValue;
}