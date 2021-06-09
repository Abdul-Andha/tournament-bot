const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true
  },
  capName: {
    type: String,
    required: true
  },
  capDiscordId: {
    type: String,
    required: true
  },
  playerDiscordIds: {
    type: [String],
    default: undefined,
    required: true
  },
  inviteeDiscordIds: {
    type: [String],
    default: undefined,
    required: true
  },
  minPlayers: {
    type: Number,
    required: true
  },
  maxPlayers: {
    type: Number,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;