const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserNoticeRelation = require('./user-notice-relation');
const config = require('config-lite');

const schema = {
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: new Date() },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  deleted: { type: Boolean, default: false }
};

const option = { versionKey: false };
const NoticeSchema = new Schema(schema, option);

NoticeSchema.statics.sendNotice = function (senderid, receiverid, content, callback) {
  if (!content.title || !content.content)
    return callback(new Error('消息内容不完整'));

  content.from = senderid;

  this
    .create(content, (err, notice) => {
      if (err) return callback(err);
      if (Array.isArray(receiverid)) {
        const sets = [];
        receiverid.forEach(receiverid => {
          sets.push({
            notice: notice.id,
            to: receiverid
          });
        });
        UserNoticeRelation
          .create(sets, callback);
      }
      else {
        UserNoticeRelation
          .create({
            notice: notice.id,
            to: receiverid
          }, callback);
      }
    });
};

NoticeSchema.statics.findByCourseid = function (courseid, callback) {
  return this
    .find({ course: courseid, deleted: false })
    .populate({
      path: 'from',
      match: { deleted: false },
      select: 'id uid name avatar'
    })
    .exec(callback);
};

// 获取属于该用户发送的所有消息
NoticeSchema.statics.findBySenderId = function (senderid, callback) {
  return this
    .find({ from: senderid })
    .where('deleted').equals(false)
    .select('id title course createdAt')
    .populate({
      path: 'course',
      match: { deleted: false },
      select: 'id cid name teachers',
      populate: {
        path: 'teachers',
        match: { deleted: false },
        select: config.select.simple_teacher_info
      }
    })
    .exec(callback);
};

// 获取该用户发送的某一条消息
NoticeSchema.statics.findOneBySenderIdAndNoticeId = function (userid, noticeid, callback) {
  return this
    .findById(noticeid)
    .where('from').equals(userid)
    .where('deleted').equals(false)
    .select('-deleted')
    .populate({
      path: 'course',
      match: { deleted: false },
      select: 'id cid name teachers',
      populate: {
        path: 'teachers',
        match: { deleted: false },
        select: config.select.simple_teacher_info
      }
    })
    .populate({
      path: 'from',
      match: { deleted: false },
      select: config.select.simple_user_info
    })
    .exec(callback);
};

const NoticeModel = mongoose.model('Notice', NoticeSchema);
module.exports = NoticeModel;