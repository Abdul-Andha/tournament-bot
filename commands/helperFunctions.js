const isRegistered = (id, data) => {
  let returnValue = false;
  data.forEach(ele => {
    if (ele.discordID == id) {
      returnValue = true;
    }
  });
  return returnValue;
};

exports.isRegistered = isRegistered;

const hasRole = (member, role) => {
  return member.roles.cache.some(r => r.name.indexOf(role) != -1);
};

exports.hasRole = hasRole;

const isCap = (id, game, teams) => {
  let returnValue = false;
  teams.forEach(ele => {
    if (ele.game == game && ele.capDiscordID == id)
      returnValue = true;
  });
  return returnValue;
}

exports.isCap = isCap;

const isInTeam = (id, game, teams) => {
  let returnValue = false;
  teams.forEach(ele => {
    if (ele.game == game && ele.playerDiscordIds.includes(id))
      returnValue = true;
  });
  return returnValue;
}

exports.isInTeam = isInTeam;

// const hasInvite = (id, players) => {
//   let returnValue = false;
//   players.forEach(ele => {
//     if (ele.discordID == id && ele.invite != "") {
//       returnValue = true;
//     }
//   });
//   return returnValue;
// };

const handleError = (error, receivedMessage, errorCode) => {
  receivedMessage.channel.send("An error occurred. Please screenshot this and contact Thunder#6228. Error code: " + errorCode + ".");
  receivedMessage.react('❌');
  console.log(error);
}

exports.handleError = handleError;