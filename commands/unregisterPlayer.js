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
            helper.handleError(err, receivedMessage, 11);
          }
        }
      })
      .catch((err) => {
        helper.handleError(err, receivedMessage, 10);
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