const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  createdAt: { type: Date, default: new Date },
  deleted: { type: Boolean, default: false }
};

const option = {};
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
      select: 'id nickname gender avatar description'
    })
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

// 根据课程id和用户id检查关系是否存在
// 返回的内容就是关系是否存在的依据
UserCourseRelationSchema.statics.checkRelation = function (userid, courseid, callback) {
  return this
    .findOne({ user: userid, course: courseid })
    .where('deleted').equals(false)
    .exec(callback);
};

const UserCourseRelationModel = mongoose.model('UserCourseRelation', UserCourseRelationSchema);
module.exports = UserCourseRelationModel;