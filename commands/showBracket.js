const Discord = require(`discord.js`);
const Canvas = require('canvas');
const helper = require('./helperFunctions');
const teamManager = require('./../helpers/teamManager');
let bracket;

module.exports = {
  name: 'showBracket',
  description: 'Command for higher staff. Uses canvas to create a bracket image. Sends the image to receivedMessage.channel. Format: .viewbracket <Tournament Name>',
  execute(receivedMessage, args, Tournament) {
    if (args.length != 1) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let tourneyName = args[0];
    Tournament.findOne({name: tourneyName}).then(tournament => {
      if (tournament.bracket.length == 0) {
        receivedMessage.channel.send("This tournament does not have a bracket yet.");
        receivedMessage.react('❌');
      } else {
        bracket = tournament.bracket;
        drawBracket(receivedMessage);
      }
    }).catch(err => helper.handleError(err, receivedMessage, 190));
	}
}

async function drawBracket(receivedMessage) {
  const canvas = Canvas.createCanvas(1278, 990);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage("https://www.ledr.com/colours/white.jpg");
  
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.font = '16px "sans-serif"';
  let storedY = 120;
  let x = 70;
  let y = storedY;
  let xToAdd = 225;
  let yToAdd = 48;
  for (let i = 0; i < bracket.length; i++) {
    for (let j = 0; j < bracket[i].length; j++) {
      let teamName = bracket[i][j];
      ctx.fillText(teamName, x, y);
      y += yToAdd;//48
    }
    x += xToAdd;
    y = (storedY + (storedY + yToAdd)) / 2;
    storedY = y;
    yToAdd *= 2;
  }

  const final = new Discord.MessageAttachment(canvas.toBuffer(), "bracket.png");
  return receivedMessage.channel.send(final);
}