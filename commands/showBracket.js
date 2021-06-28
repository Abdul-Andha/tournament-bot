const Discord = require(`discord.js`);
const Canvas = require('canvas');
const helper = require('./helperFunctions');
let tournament;

module.exports = {
  name: 'showBracket',
  description: 'Command for higher staff. Uses canvas to create a bracket image. Sends the image to receivedMessage.channel. Format: .viewbracket <Tournament Name>',
  execute(receivedMessage, args, Tournament) {
    if (args.length != 1) {
      receivedMessage.channel.send('Invalid arguments. Check the format again.');
      return receivedMessage.react('❌');
    }
    let tourneyName = args[0];
    Tournament.findOne({
      name: tourneyName
    }).then(res => {
      tournament = res;
      if (tournament.bracket[0].length == 0) {
        receivedMessage.channel.send("This tournament does not have a bracket yet.");
        receivedMessage.react('❌');
      } else {
        drawBracket(receivedMessage);
      }
    }).catch(err => helper.handleError(err, receivedMessage, 190));
  }
}

async function drawBracket(receivedMessage) {
  let bracket = tournament.bracket;
  //init canvas
  let width = 70 + 225 * bracket.length;
  let height = 180 + 48 * (bracket[0].length - 1);
  const canvas = Canvas.createCanvas(width, height); //x = 70 + 225*roundTotal        y = 180 + 48*teamNum - 1 
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //title
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = '32px "sans-serif"';
  ctx.fillText(tournament.name, canvas.width / 2, 60);

  //body
  ctx.font = '16px "sans-serif"';
  ctx.textAlign = "left";
  let storedY = 120;
  let x = 70;
  let y = storedY;
  let xToAdd = 225;
  let yToAdd = 48;
  for (let i = 0; i < bracket.length; i++) {
    for (let j = 0; j < bracket[i].length; j++) {
      //name
      let teamName = bracket[i][j];
      if (ctx.measureText(teamName).width > 150) {
        while (ctx.measureText(teamName).width > 135) {
          teamName = teamName.slice(0, -1);
        }
        teamName += "..";
      }
      ctx.fillText(teamName, x, y);

      //box
      ctx.rect(x - 5, y - 20, 150, 25);
      ctx.stroke();

      //lines
      if (i < bracket.length - 1) {
        ctx.beginPath();
        ctx.moveTo(x + 145, y - 8);
        ctx.lineTo(x + 145 + 37.5, y - 8);
        ctx.stroke();

        if (j % 2 == 0) {
          ctx.moveTo(x + 145 + 37.5, y - 8);
          ctx.lineTo(x + 145 + 37.5, y - 8 + yToAdd);
          ctx.stroke();

          ctx.moveTo(x + 145 + 37.5, y - 8 + yToAdd / 2);
          ctx.lineTo(x + 145 + 75, y - 8 + yToAdd / 2);
        }
      }

      y += yToAdd; //48
    }
    x += xToAdd;
    y = (storedY + (storedY + yToAdd)) / 2;
    storedY = y;
    yToAdd *= 2;
  }

  const final = new Discord.MessageAttachment(canvas.toBuffer(), "bracket.png");
  return receivedMessage.channel.send(final);
}

// y - 10 is middle of box x + 145 is end of box // whatever line length is can be used to make line 3. line 3 and 4 drawn on odds. line 4 is =  y + ytoAdd / 2, x = determined by length of line 1, length is 225/2 ish