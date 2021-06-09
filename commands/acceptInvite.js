const helper = require('./helperFunctions');
let tourneyName;
let teamName;
let teams; //teams in the tourney that the player is referencing
let tournament; //tournament that the player is referencing 
let targetTeam; //the team the player is trying to join
let player;


module.exports = {
  name: 'acceptInvite',
  description: 'Command for players. User must be invited to the team prior to running the command. Invitee will automatically decline all other invites they may or may not have. If team reaches minimum threshold, their pending value will be changed to false. If team reaches maximum threshold, all outstading invites to that team will be deleted. Format: .acceptinvite ["tourneyName"] ["teamName"]',
  execute(receivedMessage, args, Team, Tournament) {
    if (args.length != 2) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    tourneyName = args[0];
    teamName = args[1];
    player = receivedMessage.author;
    
    initialize(Team, Tournament).then(() => {
      if (tournament == null) {
        receivedMessage.channel.send("That tournament does not exist!");
        receivedMessage.react('❌');
      } else if (targetTeam == null) {
        receivedMessage.channel.send("That team does not exist!");
        receivedMessage.react('❌');
      } else if (!targetTeam.inviteeDiscordIds.includes(player.id)) {
        receivedMessage.channel.send("You have not been invited to `" + teamName + "`  for  `" + tourneyName + "`.");
        receivedMessage.react('❌');
      } else {
        addPlayer().then(() => {
          receivedMessage.channel.send("You have been added to the roster of `" + teamName + "`  for  `" + tourneyName + "`.");
          receivedMessage.react('✅');
        });
      }
    }).catch(err => {
      helper.handleError(err, receivedMessage, 70);
    })
  }
}

async function addPlayer() {
  targetTeam.playerDiscordIds.push(player.id);
  for (let team of teams) {
    while (team.inviteeDiscordIds.includes(player.id)) {
      let idx = team.inviteeDiscordIds.indexOf(player.id)
      team.inviteeDiscordIds.splice(idx, 1);
    }
    await team.save().catch(err => {
      helper.handleError(err, receivedMessage, 71);
    })  
  }
}

//inits players and teams so they can be used later
async function initialize(Team, Tournament) {
  tournament = await Tournament.findOne({name: tourneyName})
  if (tournament == null) { return }
  await Team.find({
    '_id': {$in: tournament.teamIds}
  }, function(err, res) {
    teams = res;
  });
  targetTeam = await teams.find(obj => obj.teamName == teamName);
}