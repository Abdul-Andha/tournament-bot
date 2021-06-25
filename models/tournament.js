const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  game: {
    type: String,
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
  teamIds: {
    type: [String],
    default: undefined,
    required: true
  },
  rosterChanges: {
    type: Boolean,
    required: true
  },
  signups: {
    type: Boolean,
    required: true
  },
  bracket: {
    type: Schema.Types.Mixed,
    required: true
  }
  
}, { timestamps: true });

const Tournament = mongoose.model('Tournament', tournamentSchema);
const ArchivedTournament = mongoose.model('Archived Tournaments', tournamentSchema);

module.exports.Tournament = Tournament;
module.exports.ArchivedTournament = ArchivedTournament;