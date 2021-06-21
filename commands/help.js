const Discord = require(`discord.js`);
const helper = require('./helperFunctions');
const outputMessage = new Discord.MessageEmbed();;

module.exports = {
  name: 'help',
  description: 'Command for anyone. If not arg, will list all commands. If arg, arg must be a command, will send a message containing detailed instructions on how to use specified command.',
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
    } else if (command == "signup" || command == "s") {
	  	outputMessage.setTitle("**__Signup Command Guide__**");
	  	outputMessage.setDescription(getSignupHelp());
    } else if (command == "invite" || command == "i") {
			outputMessage.setTitle("**__Invite Command Guide__**");
	  	outputMessage.setDescription(getInviteHelp());
		}

		receivedMessage.channel.send(outputMessage);
		receivedMessage.react('✅')
  }
}

function getCommandsList() {
	let returnStr = "Signup - s\n";
	returnStr += "Invite - i\n";
	returnStr += "AcceptInvite - ai\n";
	returnStr += "RemovePlayer - rp\n";
	returnStr += "Roster - r\n";
	returnStr += "GetInfo - gi\n";
	returnStr += "GetTourneyInfo - gti\n";
	returnStr += "Help - h\n";
	returnStr += "\n*Run .help <commandName> for a detailed guide on how to use the specified command.*";
	return returnStr;
}

function getSignupHelp() {
	let returnStr = "**Format:** .signup <Tournament Name> <teamCode>\n\n";
	returnStr += "*- This command is used to signup for any open tournaments.*\n"
	returnStr += "*- This command is only for captains.*\n" 
	returnStr += "*- You must run this command in a direct message (DM) channel with the bot, so you do not share your team code.*\n"
	returnStr += "*- You must fill out the MESA Teams Application, found on our website, to get a team code.*\n"
	return returnStr;
}

function getInviteHelp() {
	let returnStr = "**Format:** .invite <Tournament Name> <Team Name> @player1 @player2\n\n";
	returnStr += "*- This command is used to invite players to your team for a specific tournament.*\n"
	returnStr += "*- You must first signup for the tournament before running this command.*\n"
	returnStr += "*- You can invite as many people as you want with one run of the command.*\n"
	returnStr += "*- The captain must invite themselves if they wish to be on the roster.*\n"
	return returnStr;
}

/*
module.exports = {
	name: 'help',
	description: 'Gives a list of commands if there are no arguments. Gives specific instructions of a command depending on the argument',
	execute(receivedMessage, args) {
		if (args.length == 0)
			receivedMessage.channel.send("__What command do you need help with?__ \n > Announce \n > Message \n \n *Do ~help command*");
		else if (args[0].toLowerCase() == "announce")
			sendAnnounceHelp(receivedMessage);
		else if (args[0].toLowerCase() == "message")
			receivedMessage.channel.send("Message help is on the way!");
		else if (args[0].toLowerCase() == "scoreboard" || args[0].toLowerCase() == "score" || args[0].toLowerCase() == "s" || args[0].toLowerCase() == "sb")
			sendScoreboardHelp(receivedMessage);
		else
		receivedMessage.channel.send("__What command do you need help with?__ \n > Announce \n > Message \n > Scoreboard \n \n *Do ~help command*");
	}
}

function sendAnnounceHelp(receivedMessage) {
	const outputMessage = new Discord.MessageEmbed();
	outputMessage.setColor("#A207FA");
	outputMessage.setTitle("**__Announce Command Guide__**");

	let body = "The following is a guide on the ~announce command. You can also do ~a or ~Announce for this command.";
	body += "\n You must use the following notation: **~announce #channel-name (Title) Message**";
	body += "\n Make the announcement look good using emojis, text decoration, etc.";
	body += "\n";
	body += "\n__Channel__";
	body += "\nYou must use #channel-name format. **This command is only to be used for announcement and news channels.**";
	body += "\n";
	body += "\n__Title__";
	body += "\nYou must put a title for your announcement. You must only use parentheses for titles that are more than one word.";
	body += "\n";
	body += "\n__Message__";
	body += "\nThe message is the actual announcement. Start on the same line as the command but go to the next line when you want your message to go to the next line.";
	body += "\n All text will have no decorations. You can add your own, if you wish.";
	body += "\n";
	body += "\n__Image__";
	body += "\nIf you want to include an image in your announcement, simply attach it with the message."; 
	body += "\nOnly works with one image. Support for multiple images may be added in the future.";
	body += "\n";
	body += "\n__Test before send__";
	body += "\n**The test will not @everyone.** Test your announcement before sending it. To test it, put a 't' before the command.";
	body += "\nYou can use the test feature of the command in **any non public channel.**";
	body += "\nEx: ~tannounce #channel-name (test announcement) Hello World!";
	body += "\n";
	body += "\nDM Thunder#6228 if you have any questions.";
	outputMessage.setDescription(body);
	outputMessage.setImage("https://media.discordapp.net/attachments/737378578370527273/816128022855548958/announcetest.png?width=1005&height=676");

	receivedMessage.channel.send(outputMessage);
}

function sendScoreboardHelp(receivedMessage) {
	const outputMessage = new Discord.MessageEmbed();
	outputMessage.setColor("#A207FA");
	outputMessage.setTitle("**__Scoreboard Commands Guide__**");

	let body = "The following is a guide on the ~score command. You can also do ~sb or ~s for this command.";
	body += "\nYou will add or subtract points first. When you are done or need to see the board, use update.";
	body += "\n You must use the following notation: **~score (w/e) (a/s/u) (@Target) Points**";
	body += "\n";
	body += "\n__w/e__";
	body += "\nThe w stands for **weekly**. The e stands for **event**. You have to use the right one for the scoreboard you are working with.";
	body += "\n";
	body += "\n__a/s/u__";
	body += "\nThe a stands for **add**.";
	body += "\nThe s stands for **subtract**.";
	body += "\nThe u stands for **update**.";
	body += "\n";
	body += "\n__@Target__";
	body += "\nYou must @ the target. Do not forget to @ them.";
	body += "\n**Do not @target for update.** For update, put nothing for @Target.";
	body += "\n";
	body += "\n__Points__";
	body += "\nRepresents how many points you are adding or subtracting."; 
	body += "\nMust be an integer."; 
	body += "\n**Do not put Points for update.**";
	body += "\n";
	body += "\n__Update Command__";
	body += "\nUpdate is a little different from the other two.";
	body += "\nFor update, put no @Target or Points.";
	body += "\nEx: ~s e u";
	body += "\n*This will update the event scoreboard.*";
	body += "\n";
	body += "\nDM Thunder#6228 if you have any questions.";
	outputMessage.setDescription(body);

	receivedMessage.channel.send(outputMessage);
}
*/