let Player;
const helper = require('./helperFunctions');

module.exports = {
  name: 'unregisterPlayer',
  description: 'Deletes the user of this command from the players collection. One must be registered as a player before they can unregister.',
  execute(receivedMessage, PlayerConstructor) {
    Player = PlayerConstructor;
    Player.find()
      .then((result) => {
        if (!helper.isRegistered(receivedMessage.author.id, result)) {
          receivedMessage.channel.send(receivedMessage.author.username + ', you are not registered.');
          receivedMessage.react('❌');
        } else {
          if (unregister(receivedMessage.author.id)) {
            receivedMessage.channel.send(receivedMessage.author.username + ', you have been unregistered.');
            receivedMessage.react('✅');
          } else {
            receivedMessage.channel.send('An error occurred. Please screenshot this and contact Thunder#6228. Error code: 11');
            receivedMessage.react('❌');
          }
        }
      })
      .catch((err) => {
        receivedMessage.channel.send('An error occurred. Please screenshot this and contact Thunder#6228. Error code: 10');
        receivedMessage.react('❌');
        console.log(err);
      });
  }
}

function unregister(id) {
  let returnValue = true;
  Player.deleteOne({ discordID: id }, function (err, res) {
    console.log(res)
    if (err) returnValue =  false;
  });
  return returnValue;
}
/*
function isRegistered(id, data) {
  let returnValue = false;
  data.forEach(ele => {
    if (ele.discordID == id) {
      returnValue = true;
    }
  });
  return returnValue;
}
*/