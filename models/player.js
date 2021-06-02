const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  discordID: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;