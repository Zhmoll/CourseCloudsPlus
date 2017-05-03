const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  course: { type: Schema.Types.ObjectId, index: true, ref: 'Course' },
  courseTime: { type: Schema.Types.ObjectId, index: true, ref: 'CourseTime' },
  courseAttend: { type: Schema.Types.ObjectId, index: true, ref: 'CourseAttend' },
  createdAt: { type: Date, default: new Date() }
};

const option = { versionKey: false };
const CourseAttendRemarkSchema = new Schema(schema, option);

const CourseAttendRemarkModel = mongoose.model('CourseAttendRemark', CourseAttendRemarkSchema);
module.exports = CourseAttendRemarkModel;