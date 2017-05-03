const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  reason: { type: String },
  user: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  course: { type: Schema.Types.ObjectId, index: true, ref: 'Course' },
  courseTime: { type: Schema.Types.ObjectId, index: true, ref: 'CourseTime' },
  createdAt: { type: Date, default: new Date() },
  responsed: { type: Boolean, default: false },
  allow: { type: Boolean, default: false },
  allowBy: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  allowInfo: { type: String },
  deleted: { type: Boolean, default: false }
};

const option = { versionKey: false };
const CourseTimeLeaveSchema = new Schema(schema, option);

CourseTimeLeaveSchema.statics.findByUserIdAndCourseId = function (userid, courseid, callback) {
  this
    .find({ user: userid, course: courseid, deleted: false })
    .select('-deleted')
    .populate({
      path: 'courseTime',
      match: { deleted: false },
      select: '-course -deleted'
    })
    .exec(callback);
};

const CourseTimeLeaveModel = mongoose.model('CourseTimeLeave', CourseTimeLeaveSchema);
module.exports = CourseTimeLeaveModel;