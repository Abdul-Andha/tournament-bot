const helper = require('./helperFunctions');
let tourneyName;
let receivedMessage; //users message that called the command
let targetTeam; //team that the user is referencing
let teamCode; //code of targetTeam
let returnMsg;
let bot; //discord client

module.exports = {
	name: 'getTeamInfo',
	description: 'Command for captains in dms. Tournament and team must exist. User must be captain of the team. Will display roster using fetchUser(id), plus invitees, min, max, teamName, and pending. All team info. Format: .getinfo ["tourneyName"] ["teamCode"]',
	execute(discordBot, message, args, Team, Tournament) {
		receivedMessage = message;
		bot = discordBot;
		if (args.length != 2) {
			receivedMessage.channel.send('Invalid arguments. Check the format again.');
			return receivedMessage.react('❌');
		}
		tourneyName = args[0];
		teamCode = args[1];
		returnMsg = "";

		initialize(Team, Tournament).then((res) => {
			if (res) {
				returnMsg += "`Team Name:` " + targetTeam.teamName + "\n";
				returnMsg += "`Minimum Number of Players:` " + targetTeam.minPlayers + "\n";
				returnMsg += "`Maximum Number of Players:` " + targetTeam.maxPlayers + "\n \n";
				getRoster().then(res => {
					returnMsg += res + "\n";
					getInvitees().then(res => {
						returnMsg += res + "\n";
						returnMsg += getEligiblity();
						receivedMessage.channel.send(returnMsg);
						receivedMessage.react('✅');
					}).catch(err => helper.handleError(err, receivedMessage, 122));
				}).catch(err => helper.handleError(err, receivedMessage, 121));
			} else {
				receivedMessage.channel.send('Check your arguments. Make sure the tournament name and team name are accurate.');
				receivedMessage.react('❌');
			}
		}).catch(err => helper.handleError(err, receivedMessage, 120));
	}
}

//inits players and teams so they can be used later
async function initialize(Team, Tournament) {
	let tournament = await Tournament.findOne({
		name: tourneyName
	});
	if (!tournament)
		return false;

	targetTeam = await Team.findOne({
		'_id': {
			$in: tournament.teamIds
		},
		teamCode: teamCode
	});

	return targetTeam;
}

async function getRoster() {
	if (targetTeam.playerDiscordIds.length == 0)
		return "*There are no players on your roster.*";

	let returnMsg = "__" + targetTeam.teamName + " Roster__ \n";
	for (playerId of targetTeam.playerDiscordIds) {
		const player = await bot.users.fetch(playerId);
		returnMsg += "`" + player.username + "` \n"
	}
	return returnMsg;
}

async function getInvitees() {
	if (targetTeam.inviteeDiscordIds.length == 0)
		return "*Your team has no outstanding invites.*";

	let returnMsg = "__Invited Players__ \n";
	for (playerId of targetTeam.inviteeDiscordIds) {
		const player = await bot.users.fetch(playerId);
		returnMsg += "`" + player.username + "` \n"
	}
	return returnMsg;
}

function getEligiblity() {
	let returnMsg = "";
	let length = targetTeam.playerDiscordIds.length;
	let min = targetTeam.minPlayers;
	let max = targetTeam.maxPlayers;
	if (length < min) {
		returnMsg += "You need atleast `" + (min - length) + "` more players to be eligible for `" + tourneyName + "`."
	} else if (length == max) {
		returnMsg += "Your team is full."
	} else {
		returnMsg += "Your team is eligible for `" + tourneyName + "`. However, you can still invite `" + (max - length) + "` more players."
	}
	return returnMsg;
}