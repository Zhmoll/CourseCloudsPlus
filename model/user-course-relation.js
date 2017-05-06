const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const schema = {
  user: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  createdAt: { type: Date, default: new Date },
  deleted: { type: Boolean, default: false }
};

const option = { versionKey: false };
const UserCourseRelationSchema = new Schema(schema, option);

// 根据用户id查找所有他参加的课程
// 返回的内容包括课程信息以及课程的老师信息
UserCourseRelationSchema.statics.findByUserid = function (id, callback) {
  return this
    .find({ user: id })
    .where('deleted').equals(false)
    .populate({
      path: 'course',
      match: { deleted: false },
      select: 'id cid name teachers',
      populate: {
        path: 'teachers',
        match: { deleted: false },
        select: 'id name avatar'
      }
    })
    .exec(callback);
};

// 根据课程id查找参加课程的学生
// 返回的内容包括课程信息以及课程的老师信息、学生的信息
UserCourseRelationSchema.statics.findByCourseid = function (id, callback) {
  return this
    .find({ course: id })
    .where('deleted').equals(false)
    .populate({
      path: 'user',
      match: { deleted: false },
      select: 'id nickname name gender avatar description'
    })
    .exec(callback);
};

// 根据课程id和用户id检查关系是否存在
// 返回的内容就是关系是否存在的依据
UserCourseRelationSchema.statics.checkRelation = function (userid, courseid, callback) {
  return this
    .findOne({ user: userid, course: courseid })
    .where('deleted').equals(false)
    .exec(callback);
};

// 查询用户的所有课表
UserCourseRelationSchema.statics.findCourseTimes = function (userid, callback) {
  return this
    .find({ user: userid, deleted: false })
    .populate({
      path: 'course',
      match: { deleted: false },
      select: '-deleted',
      populate: [
        {
          path: 'teachers',
          match: { deleted: false },
          select: 'id uid name avatar'
        },
        {
          path: 'courseTimes',
          match: { deleted: false },
          select: '-deleted'
        }
      ]
    })
    .exec((err, relations) => {
      if (err) return callback(err);
      const show = {};
      relations.forEach(relation => {
        const course = relation.course;
        const coursetimes = course.courseTimes;
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
      });
      callback(null, show);
    });
};


// 根据一定配置查询某课课表
UserCourseRelationSchema.methods.findCourseTimes = function (userid, callback) {
  return this
    .find({ user: userid, deleted: false })
    .populate({
      path: 'course',
      match: { deleted: false },
      select: '-deleted',
      populate: [
        {
          path: 'teachers',
          match: { deleted: false },
          select: 'id uid name avatar'
        },
        {
          path: 'courseTimes',
          match: { deleted: false },
          select: '-deleted'
        }
      ]
    })
    .exec((err, relations) => {
      if (err) return callback(err);
      const show = {};
      relations.forEach(relation => {
        const course = relation.course;
        const coursetimes = course.courseTimes;
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
      });
      callback(null, show);
    });
};

const UserCourseRelationModel = mongoose.model('UserCourseRelation', UserCourseRelationSchema);
module.exports = UserCourseRelationModel;