const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  access_token: String,
  expires_in: Number,
  refresh_token: String,
  openid: { type: String, index: true },
  scope: String,
  create_at: String
};

const option = {};

const WechatUserAccessTokenSchema = new Schema(schema, option);

WechatUserAccessTokenSchema.statics.getToken = function (openid, cb) {
  this.findOne({ openid: openid }, function (err, result) {
    if (err) throw err;
    return cb(null, result);
  });
};

WechatUserAccessTokenSchema.statics.setToken = function (openid, token, cb) {
  var query = { openid: openid };
  var options = { upsert: true };
  this.update(query, token, options, function (err, result) {
    if (err) throw err;
    return cb(null);
  });
};

const WechatUserAccessTokenModel = mongoose.model('WechatUserAccessToken', WechatUserAccessTokenSchema);
module.exports = WechatUserAccessTokenModel;