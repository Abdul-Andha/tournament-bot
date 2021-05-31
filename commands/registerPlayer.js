let Player;
const helper = require('./helperFunctions');

module.exports = {
  name: 'registerPlayer',
  description: 'Registers the user of this command as a player into the database. One must be registered as a player before they can join a team.',
  execute(receivedMessage, PlayerConstructor) {
    Player = PlayerConstructor;
    Player.find()
      .then((result) => {
        if (helper.isRegistered(receivedMessage.author.id, result)) {
          receivedMessage.channel.send(receivedMessage.author.username + ', you are already registered!');
          receivedMessage.react('❌');
        } else {
          if (register(receivedMessage.author, result)) {
            receivedMessage.channel.send(receivedMessage.author.username + ', you have been succesfully registered!')
            receivedMessage.react('✅');
          } else {
            receivedMessage.channel.send('An error occurred. Please screenshot this and contact Thunder#6228. Error code: 01');
            receivedMessage.react('❌');
          }
        }
      })
      .catch((err) => {
        receivedMessage.channel.send('An error occurred. Please screenshot this and contact Thunder#6228. Error code: 00');
        receivedMessage.react('❌');
        console.log(err);
      })
  }
}

async function register(user, data) {
  const player = new Player({
    username: user.username,
    discordID: user.id
  });
  await player.save();
  return helper.isRegistered(user.id, data);
}

/*

const player = new Player({
  username: 'Thundie',
  discordID: '456'
});

player.save()
  .then((result) => {
    console.log('success')
  })
  .catch((err) => {
    console.log(err)
  });

  */