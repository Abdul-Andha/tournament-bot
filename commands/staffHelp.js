const Discord = require(`discord.js`);
const outputMessage = new Discord.MessageEmbed();;

module.exports = {
  name: 'staffHelp',
  description: 'Command for higher staff. If no arg, will list all staff commands. If arg, arg must be a command, will send a message containing detailed instructions on how to use specified command.',
  execute(receivedMessage, args) {
    if (args.length > 1) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let command = args[0];

		outputMessage.setColor("#000000");
    if (!command) {
      outputMessage.setTitle("**__Staff Commands__**");
      outputMessage.setDescription(getCommandsList());
      receivedMessage.channel.send(outputMessage);
		  return receivedMessage.react('✅');
    } else {
			command = command.toLowerCase();
		}
		
		if (command == "newtournament" || command == "newtourney" || command == "nt") {
	  	outputMessage.setTitle("**__New Tournament Command Guide__**");
	  	outputMessage.setDescription(getNewTourneyHelp());
    } else if (command == "rosterchange" || command == "rc") {
			outputMessage.setTitle("**__Roster Change Command Guide__**");
	  	outputMessage.setDescription(getRosterChangeHelp());
		} else if (command == "setsignups" || command == "ss") {
			outputMessage.setTitle("**__Set Signups Command Guide__**");
			outputMessage.setDescription(getSetSignupsHelp());
		} else if (command == "createbracket" || command == "cb") {
			outputMessage.setTitle("**__Create Bracket Command Guide__**");
			outputMessage.setDescription(getCreateBracketHelp());
		} else if (command == "reportwinner" || command == "rw") {
			outputMessage.setTitle("**__Report Winner Command Guide__**");
			outputMessage.setDescription(getReportWinnerHelp());
		} else {
			receivedMessage.channel.send("Command not found.");
			return receivedMessage.react('❌');
		}

		receivedMessage.channel.send(outputMessage);
		receivedMessage.react('✅');
  }
}

function getCommandsList() {
	let returnStr = "NewTournament - NewTourney - nt\n";
	returnStr += "RosterChange - rc\n";
	returnStr += "SetSignups - ss\n";
	returnStr += "CreateBracket - cb\n";
	returnStr += "ReportWinner - rw\n";
  returnStr += "StaffHelp - sh\n\n"
	returnStr += "*Run .staffhelp <commandName> for a detailed guide on how to use the specified command.*";
	returnStr += "\n*Run .help <tips> for tips that apply to all commands.*";
	return returnStr;
}

function getNewTourneyHelp() {
	let returnStr = "**Format:** .newtourney <Game> <Minimum> <Maximum> <Tournament Name>\n\n";
	returnStr += "*- This command is used to create a new tournament.*\n";
	returnStr += "*- You must provide the minimum and maximum number of players ";
  returnStr += "that each team in the tournament must follow.\n*";
	returnStr += "*- The <game> argument must be from the valid games list*\n";
  returnStr += "**Valid Games - csgo, lol, valorant, r6s, overwatch, rocketleague, coldwar, pubgm, wia, cops, wildrift, codm**";
	return returnStr;
}

function getRosterChangeHelp() {
	let returnStr = "**Format:** .rosterchange <Tournament Name> <on/off>\n\n";
  returnStr += "*- This command is used to turn on or off roster changes for a tournament.*\n";
  returnStr += "*- By default, roster changes are allowed (on).*"
  return returnStr;
}

function getSetSignupsHelp() {
	let returnStr = "**Format:** .setsignups <Tournament Name> <on/off>\n\n";
  returnStr += "*- This command is used to turn on or off signups for a tournament.*\n";
  returnStr += "*- By default, signups are not allowed (off).*";
  return returnStr;
}

function getCreateBracketHelp() {
	let returnStr = "**Format:** .createbracket <Tournament Name>\n\n";
  returnStr += "*- This command is used to create the bracket for a tournament.*\n";
  returnStr += "*- Only teams that have atleast the minimum number of players will be put on the roster.*\n";
  returnStr += "*- Running this command again will replace the bracket with a new one.*\n";
  returnStr += "*- The bracket is created with random seeding. Set seeding will be added later.*";
  return returnStr;
}

function getReportWinnerHelp() {
	let returnStr = "**Format:** .reportwinner <Tournament Name> <roundNum> <Winning Team Name>\n\n";
  returnStr += "*- This command is used to report the winner of a matchup.*\n";
  returnStr += "*- The winning team must be in the specified round.*\n";
  returnStr += "*- The winning team will move on to the next round (roundNum + 1).*\n";
  returnStr += "*- If you report the wrong winner of a matchup, you can simply ";
  returnStr += "run the command again with the other team and that team will replace the wrong one.*";
  return returnStr;
}