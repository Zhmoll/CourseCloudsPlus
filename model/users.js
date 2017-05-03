const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const schema = {
  /* 
   * - - - - - - - - 用户元信息 - - - - - - - -
   * uid        学工号             [可选公开] - realname_public
   * name       姓名               [可选公开] - realname_public
   * password   密码（已作摘要处理）
   * openid     微信openid
   * unionid    微信unionid
   * authority  权限
   * enable     账户是否被启用
   * deleted    用户是否被删除
   * - - - - - - - - - - - - - - - - - - - - -
   */
  uid: { type: String, index: true },
  name: { type: String },
  password: { type: String },
  openid: { type: String, index: true },
  unionid: { type: String, index: true },
  authority: { type: Number, default: 0 },
  enable: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },

  /* 
   * - - - - - - - - 用户公开信息 - - - - - - - -
   * nickname   昵称
   * gender     性别  0保密，1男，2女
   * avatar     头像链接
   * description个性签名
   * - - - - - - - - - - - - - - - - - - - - - -
   */
  nickname: { type: String },
  gender: { type: String, enum: [0, 1, 2] },
  avatar: { type: String },
  description: { type: String },

  /*
   * - - - - - - - - 用户个人信息 - - - - - - - -
   * telephone  电话        [可选公开] - telephone_public
   * wechat     微信号      [可选公开] - wechat_public
   * email      邮箱        [可选公开] - email_public
   * city       城市        [可选公开] - location_public
   * province   省份        [可选公开] - location_public
   * school     学院        [可选公开] - university_public
   * university 学校        [可选公开] - university_public
   */
  telephone: { type: String },
  wechat: { type: String },
  email: { type: String },
  city: { type: String },
  province: { type: String },
  school: { type: String },
  university: { type: String },

  /*
   * - - - - - - - - 认证信息 - - - - - - - -
   * telephone_verified  电话认证
   * email_verified      邮箱
   */
  telephone_verified: { type: Boolean, default: false },
  email_verified: { type: Boolean, default: false },

  /*
   * - - - - - - - - 公开信息 - - - - - - - -
   */
  realname_public: { type: Boolean, default: false },
  telephone_public: { type: Boolean, default: false },
  wechat_public: { type: Boolean, default: false },
  email_public: { type: Boolean, default: false },
  location_public: { type: Boolean, default: false },
  university_public: { type: Boolean, default: false },
  courses_public: { type: Boolean, default: false },
};

const option = { versionKey: false };
const UserSchema = new Schema(schema, option);

// 内部获取 用id
// 返回一个数据库文档记录
UserSchema.statics.innerFindById = function (id, callback) {
  return this
    .findById(id)
    .where('deleted').equals(false)
    .exec(callback);
};

// 内部获取 用openid
// 返回一个数据库文档记录
UserSchema.statics.innerFindByOpenid = function (openid, callback) {
  return this
    .findOne({ openid: openid })
    .where('deleted').equals(false)
    .exec(callback);
};

// 私有获取，用于给用户自己看的信息
// 返回一个对象，去除了'deleted', 'password', 'openid', 'unionid', 'enable'
UserSchema.statics.privateFindById = function (id, callback) {
  return this
    .findById(id)
    .where('deleted').equals(false)
    .where('enable').equals(true)
    .lean()
    .exec((err, user) => {
      if (err) return callback(err);
      return callback(null, _.omit(user, ['deleted', 'password', 'openid', 'unionid', 'enable']));
    });
};

// 公共获取，用于给别的用户看的公开的信息
// 返回一个对象
UserSchema.statics.publicFindById = function (id, callback) {
  return this
    .findById(id)
    .where('deleted').equals(false)
    .where('enable').equals(true)
    .lean()
    .exec((err, user) => {
      if (err) return callback(err);
      const pick = ['_id', 'nickname', 'gender', 'avatar', 'description', 'authority'];
      if (user.realname_public) {
        pick.push('uid');
        pick.push('name');
      }
      if (user.telephone_verified && user.telephone_public) {
        pick.push('telephone');
      }
      if (user.wechat_public) {
        pick.push('wechat');
      }
      if (user.email_verified && user.email_public) {
        pick.push('email');
      }
      if (user.location_public) {
        pick.push('city');
        pick.push('province');
      }
      if (user.university_public) {
        pick.push('school');
        pick.push('university');
      }
      if (user.courses_public) {
        const UserCourseRelation = require('./user-course-relation');
        UserCourseRelation.findByUserid(id, (err, courses) => {
          if (err) return callback(err);
          const results = _.pick(user, pick);
          results.courses = courses;
          return callback(null, results);
        });
      }
      else {
        return callback(null, _.pick(user, pick));
      }
    });
};

// 删除用户
UserSchema.statics.deletedById = function (id, callback) {
  return this
    .updateOne({ id: id }, { deleted: true })
    .exec(callback);
}

// 校验密码
UserSchema.methods.validatePassword = function (password) {
  return this.password === password;
};

// 更换密码
UserSchema.methods.changePassword = function (password, callback) {
  this.password = password;
  this.save(callback);
};

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;