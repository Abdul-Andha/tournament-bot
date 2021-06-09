const helper = require('./helperFunctions');
let tourneyName;
let game;
let teamName;
let teams; //teams in the tourney that the player is referencing
let tournament; //tournament that the player is referencing 
let targetTeam; //the team the player is trying to join
let player;


module.exports = {
  name: 'invitePlayer',
  description: 'Command for players. User must be invited to the team prior to running the command. Invitee will automatically decline all other invites they may or may not have. If team reaches minimum threshold, their pending value will be changed to false. If team reaches maximum threshold, all outstading invites to that team will be deleted. Format: .acceptinvite ["tourneyName"] ["teamName"] [game]',
  execute(receivedMessage, args, Team, Tournament) {
    if (args.length != 3) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    tourneyName = args[0];
    teamName = args[1];
    game = args[2];
    player = receivedMessage.author;
    
    initialize(Team, Tournament).then(() => {
      if (targetTeam == null) {
        receivedMessage.channel.send("That team does not exist!");
        receivedMessage.react('❌');
      } else if (!targetTeam.inviteeDiscordIds.includes(player.id)) {
        receivedMessage.channel.send("You have not been invited to `" + teamName + "` for `" + tourneyName + "`.");
        receivedMessage.react('❌');
      } else {
        addPlayer();
      }
    }).catch(err => {
      receivedMessage.channel.send("An error occurred. Please screenshot this and contact Thunder#6228. Error code: 70");
      receivedMessage.react('❌');
      console.log(err);
    })
  }
}

async function addPlayer() {
  targetTeam.playerDiscordIds.push(player.id);
  teams.forEach(team => {
    while (team.inviteeDiscordIds.includes(player.id)) {
      let idx = team.inviteeDiscordIds.indexOf(player.id)
      team.inviteeDiscordIds.splice(idx, 1);
    }
    await team.save().catch((err => {
      receivedMessage.channel.send("An error occurred. Please screenshot this and contact Thunder#6228. Error code: 71");
      receivedMessage.react('❌');
      console.log(err);
    })
  });
  
}

//inits players and teams so they can be used later
async function initialize(Team, Tournament) {
  tournament = await Tournament.findOne({name: tourneyName, game: game})
  await Team.find({
    '_id': {$in: tournament.teamIds}
  }, function(err, res) {
    teams = res;
  });
  targetTeam = await teams.findOne({teamName: teamName})
}