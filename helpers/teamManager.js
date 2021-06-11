const helper = require('./../commands/helperFunctions')

const manageThresholds = (receivedMessage, team) => {
	const min = team.minPlayers;
	const max = team.maxPlayers;
	let length = team.playerDiscordIds.length;
	if (length >= max) {
		team.inviteeDiscordIds = [];
		team.pending = false;
	} else if (length >= min) {
		team.pending = false;
	}
	team.save().catch(err => {
		helper.handleError(err, receivedMessage, 80);
	});
};

exports.manageThresholds = manageThresholds;