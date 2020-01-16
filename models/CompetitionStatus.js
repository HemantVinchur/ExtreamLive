const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let statusSchema = new Schema({
  competitionId: String,
  waiting: { type: Number },
  started: { type: Number },
  voting: { type: Number },
  judging: { type: Number },
  results: { type: Number },
  ended: { type: Number },
  cancelled: { type: Number },
  deleted: { type: Number }

});

module.exports = mongoose.model('CompetitionStatus', statusSchema);