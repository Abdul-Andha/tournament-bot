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
  limit: {
    type: Number,
    required: true
  },
  teamIds: {
    type: [String],
    default: undefined,
    required: true
  }
  
}, { timestamps: true });

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;