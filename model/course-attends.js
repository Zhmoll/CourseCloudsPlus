const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  course: { type: Schema.Types.ObjectId, index: true, ref: 'Course' },
  courseTime: { type: Schema.Types.ObjectId, index: true, ref: 'CourseTime' },
  createdAt: { type: Date, default: new Date() },
  enable: { type: Boolean, default: false },
  enableStart: { type: Date },
  enableEnd: { type: Date },
};

const option = { versionKey: false };
const CourseAttendSchema = new Schema(schema, option);

const CourseAttendModel = mongoose.model('CourseAttend', CourseAttendSchema);
module.exports = CourseAttendModel;