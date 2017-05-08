const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');
const UserNoticeRelation = require('./user-notice-relation');
const wechatApi = require('../wechat/api');
const config = require('config-lite');
const _ = require('lodash');

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

// 发送消息
NoticeSchema.statics.sendNotice = function (senderid, receiverids, content, callback) {
  if (!content.title || !content.content)
    return callback(new Error('消息内容不完整'));

  content.from = senderid;

  this
    .create(content, (err, notice) => {
      if (err) return callback(err);
      if (Array.isArray(receiverids)) {
        const toRelations = [];
        const openids = [];
        const missions = [];

        User.findById(senderid).exec((err, sender) => {
          if (err) return callback(err);
          receiverids.forEach(receiverid => {
            toRelations.push({
              notice: notice.id,
              to: receiverid
            });
            missions.push((receiverid) => {
              return User.findById(receiverid).then(user => {
                if (user.openid)
                  wechatApi.sendNotice(notice, user.openid, sender);
              });
            });
          });
          Promise.all(missions)
            .then(() => {
              UserNoticeRelation.create(toRelations, callback);
            })
            .catch(e => {
              if (e) return callback(e);
            });
        });
      }
      else {
        User.findById(senderid).exec((err, sender) => {
          if (err) return callback(err);
          User.findById(receiverids).exec((err, receiver) => {
            if (err) return callback(err);
            if (receiver.openid)
              wechatApi.sendNotice(notice, receiver.openid, sender);
            UserNoticeRelation
              .create({ notice: notice.id, to: receiverids }, callback);
          });
        });
      };

      // 获取属于该课程的群发的所有消息
      NoticeSchema.statics.findByCourseid = function (courseid, callback) {
        return this
          .find({ course: courseid, deleted: false })
          .select('-deleted -content -course')
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
          .exec((err, notice) => {
            if (err) return callback(err);
            if (!notice) return callback(null, notice);
            const noticeid = notice.id;
            UserNoticeRelation
              .find({ notice: noticeid })
              .populate({
                path: 'to',
                match: { deleted: false },
                select: config.select.simple_user_info
              })
              .exec((err, relations) => {
                if (err) return callback(err);
                const tos = [];
                relations.forEach(relation => {
                  tos.push(relation.to);
                });
                notice.to = tos;
                callback(null, notice);
              });
          });
      };

      const NoticeModel = mongoose.model('Notice', NoticeSchema);
      module.exports = NoticeModel;