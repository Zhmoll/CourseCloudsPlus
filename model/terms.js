const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const term_helper = require('../lib/term');
const _ = require('lodash');

const schema = {
  university: { type: String, required: true, index: true },
  term: { type: String, required: true, index: true },
  start_date: { type: Date }
};

const option = { versionKey: false };
const TermSchema = new Schema(schema, option);

TermSchema.statics.getCurrentWeek = function (university, callback) {
  const now = new Date();
  const term = term_helper.getTerm(now);
  return this
    .findOne({ university: university, term: term })
    .exec((err, item) => {
      if (err) return next(err);
      const start_week = term_helper.getWeek(item.start_date);
      const this_week = term_helper.getWeek(now);
      callback(null, {
        term: term,
        week: this_week - start_week + 1,
        weekday: now.getDay()
      });
    });
};

const TermModel = mongoose.model('Term', TermSchema);
module.exports = TermModel;