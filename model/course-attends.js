const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const schema = {
  course: { type: Schema.Types.ObjectId, index: true, ref: 'Course' },
  createdAt: { type: Date, default: new Date() }
};

const option = { versionKey: false };
const CourseAttendSchema = new Schema(schema, option);

const CourseAttendModel = mongoose.model('CourseAttend', CourseAttendSchema);
module.exports = CourseAttendModel;