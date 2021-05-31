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