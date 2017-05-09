const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const schema = {
  user: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  courseAttend: { type: Schema.Types.ObjectId, index: true, ref: 'CourseAttend' },
  createdAt: { type: Date, default: Date.now }
};

const option = { versionKey: false };
const CourseAttendRemarkSchema = new Schema(schema, option);

const CourseAttendRemarkModel = mongoose.model('CourseAttendRemark', CourseAttendRemarkSchema);
module.exports = CourseAttendRemarkModel;