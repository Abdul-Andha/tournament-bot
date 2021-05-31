const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true
  },
  game: {
    type: String,
    required: true
  },
  capName: {
    type: String,
    required: true
  },
  capDiscordID: {
    type: String,
    required: true
  },
  playerIDs: {
    type: [String],
    default: undefined,
    required: true
  },
  isInTourney: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;