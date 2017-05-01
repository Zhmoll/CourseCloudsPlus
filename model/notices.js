const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserNoticeRelation = require('./user-notice-relation');

const schema = {
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: new Date() },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  deleted: { type: Boolean, default: false }
};

const option = {};
const NoticeSchema = new Schema(schema, option);

NoticeSchema.statics.sendNotice = function (senderid, receiverid, content, callback) {
  if (!content.title || !content.content)
    return callback(new Error('消息内容不完整'));

  content.from = senderid;

  this
    .create(content)
    .exec((err, notice) => {
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
          .create(sets)
          .exec(callback);
      }
      else {
        UserNoticeRelation
          .create({
            notice: notice.id,
            to: receiverid
          })
          .exec(callback);
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

const NoticeModel = mongoose.model('Notice', NoticeSchema);
module.exports = NoticeModel;