const OAuth = require('wechat-oauth');
const config = require('config-lite').wechat;
const WechatUserAccessToken = require('../model/wechat-user-access-tokens');

const api = new OAuth(
  config.appid,
  config.appsecret,
  function (openid, callback) {
    // 传入一个根据openid获取对应的全局token的方法
    // 在getUser时会通过该方法来获取token
    WechatUserAccessToken.getToken(openid, callback);
  }, function (openid, token, callback) {
    // 持久化时请注意，每个openid都对应一个唯一的token!
    WechatUserAccessToken.setToken(openid, token, callback);
  }
);

module.exports = api;