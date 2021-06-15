const helper = require('./helperFunctions');
let tourneyName;
let receivedMessage; //users message that called the command
let targetTeam; //team that the user is referencing
let teamName; //name of targetTeam
let foundPlayers; //array of players on roster and in server
let notFound; //number of players on roster but not in server

module.exports = {
	name: 'showRoster',
	description: 'Command for anyone. Tournament and team must exist. Will display all users who are on that teams roster who are in the server and say how many are on roster but are not in the server. Format: .roster ["tourneyName"] ["teamName"]',
	execute(message, args, Team, Tournament) {
		receivedMessage = message;
		if (args.length != 2) {
			receivedMessage.channel.send('Invalid arguments. Check the format again.');
			return receivedMessage.react('❌');
		}
		tourneyName = args[0];
		teamName = args[1];

		initialize(Team, Tournament).then((res) => {
			if (res) {
				if (targetTeam.playerDiscordIds.length == 0) {
					receivedMessage.channel.send('`' + targetTeam.teamName + '` has no players on its roster.');
        	receivedMessage.react('❌');
				} else {
					findPlayers();
					sendResults();
				}
			} else {
				receivedMessage.channel.send('Check your arguments. Make sure the tournament name and team name are accurate.');
				receivedMessage.react('❌');
			}
		}).catch(err => {
			helper.handleError(err, receivedMessage, 110);
		});
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
		teamName: teamName
	});

	return targetTeam;
}

function findPlayers() {
	foundPlayers = [];
	notFound = 0;
	for (playerId of targetTeam.playerDiscordIds) {
		let player = receivedMessage.guild.members.cache.get(playerId);
		if (player)
			foundPlayers.push(player.user.username);
		else
			notFound++;
	}
}

function sendResults() {
	let returnMsg = "__" + teamName +" Roster__ \n";
	for (username of foundPlayers) {
		returnMsg += "`" + username + "` \n"
	}
	if (notFound == 1) {
		returnMsg += "\n*There is " + notFound + " player who is on the roster but not in this server. They must join the server in order to be eligible to play.*";
	} else if (notFound > 0) {
		returnMsg += "\n*There is " + notFound + " player who is on the roster but not in this server. They must join the server in order to be eligible to play.*";
	}
	
	receivedMessage.channel.send(returnMsg);
	receivedMessage.react('✅');
}