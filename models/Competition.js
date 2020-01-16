var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var competitionSchema = new Schema({
    competitionNo: Number,
    startAt: String,
    endsAt: String,
    votingStarts: String,
    votingEnds: String,
    firstPrize: String,
    secondPrize: String,
    thirdPrize: String,
    termsCondition: String,
    url: String,
    //status
    waiting: { type: Number },
    started: { type: Number },
    voting: { type: Number },
    judging: { type: Number },
    results: { type: Number },
    ended: { type: Number },
    cancelled: { type: Number },
    deleted: { type: Number },

    createdAt: { type: Date, default: Date.now() }
});

competitionSchema.plugin(autoIncrement.plugin,
    {
        model: 'Competition',
        field: 'CompetitionNo',
        startAt: 1,
        incrementBy: 1
    });

module.exports = mongoose.model('Competition', competitionSchema);

