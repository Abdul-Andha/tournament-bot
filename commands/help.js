const Discord = require(`discord.js`);
const outputMessage = new Discord.MessageEmbed();;

module.exports = {
  name: 'help',
  description: 'Command for anyone. If no arg, will list all commands. If arg, arg must be a command, will send a message containing detailed instructions on how to use specified command.',
  execute(receivedMessage, args) {
    if (args.length > 1) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let command = args[0];

		outputMessage.setColor("#000000");
    if (!command) {
      outputMessage.setTitle("**__All Available Commands__**");
      outputMessage.setDescription(getCommandsList());
			receivedMessage.channel.send(outputMessage);
			return receivedMessage.react('✅');
    } else {
			command = command.toLowerCase();
		}
		
		if (command == "tips") {
	  	outputMessage.setTitle("**__General Tips__**");
	  	outputMessage.setDescription(getTips());
    } else if (command == "signup" || command == "s") {
	  	outputMessage.setTitle("**__Signup Command Guide__**");
	  	outputMessage.setDescription(getSignupHelp());
    } else if (command == "invite" || command == "i") {
			outputMessage.setTitle("**__Invite Command Guide__**");
	  	outputMessage.setDescription(getInviteHelp());
		} else if (command == "acceptInvite" || command == "ai") {
			outputMessage.setTitle("**__Accept Invite Command Guide__**");
			outputMessage.setDescription(getAcceptInviteHelp());
		} else if (command == "removeplayer" || command == "remove" || command == "rp") {
			outputMessage.setTitle("**__Remove Player Command Guide__**");
			outputMessage.setDescription(getRemovePlayerHelp());
		} else if (command == "roster" || command == "r") {
			outputMessage.setTitle("**__Roster Command Guide__**");
			outputMessage.setDescription(getRosterHelp());
		} else if (command == "getInfo" || command == "gi") {
			outputMessage.setTitle("**__Get Info Command Guide__**");
			outputMessage.setDescription(getGetInfoHelp());
		} else if (command == "gettourneyinfo" || command == "gti") {
			outputMessage.setTitle("**__Get Tourney Info Command Guide__**");
			outputMessage.setDescription(getGetTouneyInfoHelp());
		} else if (command == "bracket" || command == "b") {
			outputMessage.setTitle("**__Bracket Command Guide__**");
			outputMessage.setDescription(getBracketHelp());
		} else {
			receivedMessage.channel.send("Command not found.");
			return receivedMessage.react('❌');
		}

		receivedMessage.channel.send(outputMessage);
		receivedMessage.react('✅');
  }
}

function getCommandsList() {
	let returnStr = "Signup - s\n";
	returnStr += "Invite - i\n";
	returnStr += "AcceptInvite - ai\n";
	returnStr += "RemovePlayer - Remove - rp\n";
	returnStr += "Roster - r\n";
	returnStr += "GetInfo - gi\n";
	returnStr += "GetTourneyInfo - gti\n";
	returnStr += "Bracket - b\n";
	returnStr += "Help - h\n";
	returnStr += "\n*Run .help <commandName> for a detailed guide on how to use the specified command.*";
	returnStr += "\n*Run .help <tips> for tips that apply to all commands.*";
	return returnStr;
}

function getTips() {
	let returnStr = "**1.** *You can find a list of all commands and their short forms by running: .help*\n\n";
	returnStr += "**2.** *A short form of a command is a 1-3 letter substitute for the full word, for your convenience.*\n";
	returnStr += "*For example, .s is the short form of .signup.*\n\n";
	returnStr += "**3.** *Any time you need to put multiple words for one argument, you must enclose the full argument with <>. ";
	returnStr += "You can also enclose one word arguments, but it is not necessary.*\n"
	returnStr += "*For example, .invite tourneyName <My Team Name> @player.*\n\n";
	returnStr += "**4.** *Any command that requires the use of a team code must be run in a direct message (DM) channel with the bot. ";
	returnStr += "This will ensure that no one sees your team code. "
	returnStr += "It is up to you to keep your team code private, like a password.*"
	return returnStr;
}

function getSignupHelp() {
	let returnStr = "**Format:** .signup <Tournament Name> <teamCode>\n\n";
	returnStr += "*- This command is used to signup for any open tournaments.*\n";
	returnStr += "*- This command is only for captains.*\n" ;
	returnStr += "*- You must run this command in a direct message (DM) channel with the bot, so you do not share your team code.*\n";
	returnStr += "*- You must fill out the MESA Teams Application, found on our website, to get a team code.*\n";
	returnStr += "*- When you successfully run this command, your signup will be pending until enough players accept their invitation to your team.*\n";
	return returnStr;
}

function getInviteHelp() {
	let returnStr = "**Format:** .invite <Tournament Name> <Team Name> @player1 @player2\n\n";
	returnStr += "*- This command is used to invite players to your team for a specific tournament.*\n";
	returnStr += "*- You must first signup for the tournament before running this command.*\n";
	returnStr += "*- You can invite as many people as you want with one run of the command.*\n";
	returnStr += "*- You can not invite someone who is on another team.*\n";
	returnStr += "*- You can not invite anyone if the team is full.*\n";
	returnStr += "*- The captain must invite themselves if they wish to be on the roster.*\n";
	return returnStr;
}

function getAcceptInviteHelp() {
	let returnStr = "**Format:** .acceptinvite <Tournament Name> <Team Name>\n\n";
	returnStr += "*- This command is used to accept an invite sent by your captain.*\n";
	returnStr += "*- You must be invited to be able to run this command.*\n";
	returnStr += "*- If you have more than one invite for the specified tournament, ";
	returnStr += "all invites except for the one you accept will be deleted upon running this command.*"
	return returnStr;
}

function getRemovePlayerHelp() {
	let returnStr = "**Format:** .removeplayer <Tournament Name> <Team Name> @player\n\n";
	returnStr += "*- This command is used to remove a player from your roster.*\n";
	returnStr += "*- You must be the captain of the team and the target player ";
	returnStr += "must be on the team to be able to run this command.*\n";
	returnStr += "*- Your team size must be greater than the minimum number of players required for that tournament.*";
	return returnStr;
}

function getRosterHelp() {
	let returnStr = "**Format:** .roster <Tournament Name> <Team Name>\n\n";
	returnStr += "*- This command is used to see who is on a team's roster.*\n";
	returnStr += "*- The specified team must be signed up for the specified tournament.*\n";
	returnStr += "*- It will display the players on that teams roster who are in the server ";
	returnStr += "and say how many, if any, players on the roster are not in the server.*";
	return returnStr;
}

function getGetInfoHelp() {
	let returnStr = "**Format:** .gi <Tournament Name> <teamCode>\n\n";
	returnStr += "*- This command is only for captains.*\n";
	returnStr += "*- You must run this command in a direct message (DM) channel with the bot, ";
	returnStr += "so you do not share your team code.*\n";
	returnStr += "*- Your team must be signed up to be able to run this command.*\n";
	returnStr += "*- This command will give detailed information about the team including ";
	returnStr += "invited players, accepted players, team status, and more.*";
	return returnStr;
}

function getGetTouneyInfoHelp() {
	let returnStr = "**Format:** .gti <Tournament Name>\n\n";
	returnStr += "*- This command is used to get detailed information about a specific tournament.*\n";
	returnStr += "*- When no tournament is specified, it will give a list of active tournaments.*"
	return returnStr;
}

function getBracketHelp() {
	let returnStr = "**Format:** .bracket <Tournament Name>\n\n";
  returnStr += "*- This command is used to see the bracket for a tournament.*\n";
  returnStr += "*- Run this command again to view updates to the bracket.*\n";
  returnStr += "*- The bracket will be an image that can be saved and shared.*";
  return returnStr;
}