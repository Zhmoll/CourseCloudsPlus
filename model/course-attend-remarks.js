const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const schema = {
  user: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  course: { type: Schema.Types.ObjectId, index: true, ref: 'Course' },
  courseAttend: { type: Schema.Types.ObjectId, index: true, ref: 'CourseAttend' },
  createdAt: { type: Date, default: new Date() }
};

const option = { versionKey: false };
const CourseAttendRemarkSchema = new Schema(schema, option);

const CourseAttendRemarkModel = mongoose.model('CourseAttendRemark', CourseAttendRemarkSchema);
module.exports = CourseAttendRemarkModel;