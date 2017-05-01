const OAuth = require('wechat-oauth');
const config = require('config-lite').wechat;
const WechatUserAccessToken = require('../model/wechat-user-access-tokens');

const api = new OAuth(
  config.appid,
  config.appsecret,
  WechatUserAccessToken.getToken,
  WechatUserAccessToken.setToken
);

module.exports = api;