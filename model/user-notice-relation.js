const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  notice: { type: Schema.Types.ObjectId, ref: 'Notice' },
  to: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
  done: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
};

const option = {};
const UserNoticeRelationSchema = new Schema(schema, option);

// 获取属于该用户接收的所有消息
UserNoticeRelationSchema.statics.findByReceiverId = function (id, callback) {
  return this
    .find({ to: id })
    .where('deleted').equals(false)
    .select('-deleted')
    .populate({
      path: 'notice',
      match: { deleted: false },
      select: 'id title createdAt course',
      populate: [
        {
          path: 'course',
          match: { deleted: false },
          select: 'id cid name teachers',
          populate: {
            path: 'teachers',
            match: { deleted: false },
            select: 'id uid name avatar'
          }
        },
        {
          path: 'from',
          match: { deleted: false },
          select: 'id nickname avatar'
        }
      ]
    })
    .exec(callback);
};

// 获取属于该用户发送的所有消息
UserNoticeRelationSchema.statics.findByReceiverId = function (senderid, callback) {
  return this
    .find({ from: senderid })
    .where('deleted').equals(false)
    .select('-deleted')
    .populate({
      path: 'notice',
      match: { deleted: false },
      select: 'id title createdAt course',
      populate: [
        {
          path: 'course',
          match: { deleted: false },
          select: 'id cid name teachers',
          populate: {
            path: 'teachers',
            match: { deleted: false },
            select: 'id uid name avatar'
          }
        },
        {
          path: 'from',
          match: { deleted: false },
          select: 'id nickname avatar'
        }
      ]
    })
    .exec(callback);
};

// 获取该用户接收的某一条消息
UserNoticeRelationSchema.statics.findOneByReceiverIdAndNoticeId = function (userid, noticeid, callback) {
  return this
    .findOne({ to: userid, notice: noticeid })
    .where('deleted').equals(false)
    .select('-deleted')
    .populate({
      path: 'notice',
      match: { deleted: false },
      select: '-deleted',
      populate: [
        {
          path: 'course',
          match: { deleted: false },
          select: 'id cid name teachers',
          populate: {
            path: 'teachers',
            match: { deleted: false },
            select: 'id uid name avatar'
          }
        },
        {
          path: 'from',
          match: { deleted: false },
          select: 'id nickname avatar'
        }
      ]
    })
    .exec(callback);
};

// 获取该用户发送的某一条消息
UserNoticeRelationSchema.statics.findOneBySenderIdAndNoticeId = function (userid, noticeid, callback) {
  return this
    .findOne({ from: userid, notice: noticeid })
    .where('deleted').equals(false)
    .select('-deleted')
    .populate({
      path: 'notice',
      match: { deleted: false },
      select: '-deleted',
      populate: [
        {
          path: 'course',
          match: { deleted: false },
          select: 'id cid name teachers',
          populate: {
            path: 'teachers',
            match: { deleted: false },
            select: 'id uid name avatar'
          }
        },
        {
          path: 'from',
          match: { deleted: false },
          select: 'id nickname avatar'
        }
      ]
    })
    .exec(callback);
};

const UserNoticeRelationModel = mongoose.model('UserNoticeRelation', UserNoticeRelationSchema);
module.exports = UserNoticeRelationModel;