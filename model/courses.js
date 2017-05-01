const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  /* 
   * - - - - - - - - 用户元信息 - - - - - - - -
   * cid        课程号
   * name       课程名
   * intros     课程简介
   * teachers   教师id
   * courseTimes课程时间
   * deleted    是否已被删除
   * - - - - - - - - - - - - - - - - - - - - -
   */
  cid: { type: String, index: true },
  name: { type: String },
  intros: { type: String },
  teachers: { type: [Schema.Types.ObjectId], ref: 'User' },
  courseTimes: { type: [Schema.Types.ObjectId], ref: 'CourseTime' },
  deleted: { type: Boolean, default: false }
};

const option = {};
const CourseSchema = new Schema(schema, option);

// 私有查询
// 包含老师的信息和上课的信息
CourseSchema.statics.privateFindById = function (id, callback) {
  return this
    .findById(id)
    .where('deleted').equals(false)
    .select('-deleted')
    .populate({
      path: 'teachers',
      match: { deleted: false },
      select: 'id uid name avatar'
    })
    .exec(callback);
};

// 公开查询
// 包含老师的信息
CourseSchema.statics.publicFindById = function (id, callback) {
  return this
    .findById(id)
    .where('deleted').equals(false)
    .select('-deleted -courseTimes')
    .populate({
      path: 'teachers',
      match: { deleted: false },
      select: 'id uid name avatar'
    })
    .exec(callback);
};

// const lessionsShowByWeekday = {
//   '2016-1': {   // term
//     1: {        // week
//       5: [      // weekday
//         { coursetimeid, course, location, rows, remark }
//       ]
//     }
//   }
// };

// 根据某一课程查询课表
CourseSchema.methods.findCourseTimes = function (callback) {
  return this.populate('courseTimes', (err, course) => {
    if (err) return callback(err);
    const coursetimes = course.courseTimes;
    const show = {};
    // 拿了course对象，返回了课表
    const course_simple = _.pick(course, ['id', 'cid', 'name', 'teachers']);
    coursetimes.forEach(item => {
      const { id, location, term, week, weekday, rows, remark } = item;
      // 创建学期
      if (!show[term])
        show[term] = {};
      // 创建周
      if (!show[term][week])
        show[term][week] = {};
      // 创建周几
      if (!show[term][week][weekday])
        show[term][week][weekday] = [];
      // 为周几添加课程
      show[term][week][weekday].push({
        coursetimeid: id,
        course: course_simple,
        rows: rows,
        location: location,
        remark: remark
      });
    });
    callback(null, show);
  });
};

const CourseModel = mongoose.model('Course', CourseSchema);
module.exports = CourseModel;