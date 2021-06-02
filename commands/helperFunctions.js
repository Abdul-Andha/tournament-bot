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