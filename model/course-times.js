const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const schema = {
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  // 上课地点
  location: { type: String },

  // 按照学校上课的标准来
  // weekday = 5, rows = [3,4,5] 就是周五的三四五节课
  term: { type: String },         // 学年，比如'2016-1' 即2016学年第一学期
  week: { type: Number },         // 第几周
  weekday: { type: Number },      // 1,2,3,4,5,6,0 分别代表周一、周二……周日
  rows: [{ type: Number }],       // 1,2,3,……,12 分别代表第一、第二……第十二节课

  remark: { type: String },       // 备注
  createdAt: { type: Date, default: new Date() },
  deleted: { type: Boolean, default: false }
};

const option = { versionKey: false };
const CourseTimeSchema = new Schema(schema, option);

CourseTimeSchema.statics.checkRelation = function (courseid, coursetimeid, callback) {
  return this
    .findById(coursetimeid)
    .where('deleted').equals(false)
    .where('course').equals(courseid)
    .select('-deleted')
    .populate({
      path: 'course',
      match: { deleted: false },
      select: 'id cid name',
      populate: {
        path: 'teachers',
        match: { deleted: false },
        select: 'id uid name avatar'
      }
    })
    .exec(callback);
};

const CourseTimeModel = mongoose.model('CourseTime', CourseTimeSchema);
module.exports = CourseTimeModel;