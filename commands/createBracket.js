const helper = require('./helperFunctions');
let tourneyName;
let receivedMessage; //users message that called the command
let tournament;
let teams;
let bracketSize; //the number of teams + number of byes in the bracket
let numByes; //number of byes in the bracket
let numRounds; //number of rounds
let bracket; //2d rray representing bracket

module.exports = {
  name: 'createBracket',
  description: 'Command for higher staff. Teams must be signed up and pending false to be on bracket. Once bracket is created, it can be replaced by running createBracket again. Format: .createbracket ["tourneyName"]',
  execute(message, args, Team, Tournament) {
    receivedMessage = message;
    if (args.length != 1) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    tourneyName = args[0];

    initialize(Team, Tournament).then((res) => {
      if (res) {
        if (teams.length <= 1) {
          receivedMessage.channel.send("There are not enough teams signed up. Atleast 2 teams have to be signed up.");
          receivedMessage.react('❌');
        } else {
          bracketSize = getBracketSize();
          numByes = bracketSize - teams.length;
          getNumRounds();
          initBracket();
        }
      } else {
        receivedMessage.channel.send('Check your argument. Make sure the tournament name is accurate.');
        receivedMessage.react('❌');
      }
    }).catch(err => {
      helper.handleError(err, receivedMessage, 140);
    });
  }
}

//inits players and teams so they can be used later
async function initialize(Team, Tournament) {
  tournament = await Tournament.findOne({
    name: tourneyName
  });
  if (!tournament)
    return false;

  teams = await Team.find({
    '_id': {
      $in: tournament.teamIds
    },
    pending: false
  });

  return teams && tournament;
}

function getBracketSize() {
  let size = teams.length;
  while (!Number.isInteger(Math.log(size) / Math.log(2))) {
    size++;
  }
  return size;
}

function getNumRounds() {
  let numRounds = 0;
  let temp = bracketSize;
  while (temp >= 1) {
    temp /= 2;
    numRounds++;
  }
  console.log(numRounds);
}