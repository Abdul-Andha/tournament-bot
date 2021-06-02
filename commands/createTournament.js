let Tournament;
const validGames = ["csgo", "lol", "valorant", "r6s", "overwatch", "rocketleague", "coldwar", "pubgm", "wia", "cops", "wildrift", "codm"];

module.exports = {
  name: 'createTournament',
  description: 'Only available to higher staff. Can create a tournament. Format: .newtourney [game] [limit] [name]', 
  execute(receivedMessage, args, TournamentModel) {
    Tournament = TournamentModel;
    
    if (args.length < 3) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let game = args[0];
    
    if (!validGames.includes(game.toLowerCase())) {
      receivedMessage.channel.send('Invalid game. Check the list of games again.');
      return receivedMessage.react('❌');
    }
    
    let limit = args[1];
    let name = "";
    for (let i = 2; i < args.length - 1; i++) {
      name += args[i] + " ";
    }
    name += args[args.length - 1];
    
    tourneyExists(name)
      .then((res) => {
        if (res) {
          receivedMessage.channel.send('Invalid name. A tournament with that name already exists!');
          return receivedMessage.react('❌');
        } else {
          const tournament = new Tournament({
          name: name,
          game: game,
          limit: limit, 
          teamIds: []
          });
    
          tournament.save()
          .then((res) => {
            receivedMessage.channel.send(name + " has been successfully created!");
            receivedMessage.react('✅');
          })
          .catch((err) => {
            receivedMessage.channel.send("An error occurred. Please screenshot this and contact Thunder#6228. Error code: 40");
            receivedMessage.react('❌');
            console.log(err);
          });
        }
      })
      .catch((err) => {
        receivedMessage.channel.send("An error occurred. Please screenshot this and contact Thunder#6228. Error code: 41");
        receivedMessage.react('❌');
        console.log(err);
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
      receivedMessage.channel.send("An error occurred. Please screenshot this and contact Thunder#6228. Error code: 41");
      receivedMessage.react('❌');
      console.log(err);
    })
  return returnValue;
}