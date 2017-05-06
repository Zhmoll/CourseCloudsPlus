const WechatApi = require('wechat-api');
const config = require('config-lite').wechat;
const WechatAccessToken = require('../models/wechat-access-tokens');

const api = new WechatApi(
  config.appid,
  config.appsecret,
  WechatAccessToken.getToken,
  WechatAccessToken.setToken
);

module.exports = api;