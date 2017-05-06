const OAuthApi = require('./OAuth');
const User = require('../model/users');

function key_user_center(message, req, res, next) {
  // 确认是否认证了
  const openid = message.FromUserName;
  User.findOne({ openid: openid }, function (err, user) {
    if (err) return next(err);

    if (!user) {
      // 微信用户未绑定平台账号
      const url = OAuthApi.getAuthorizeURL('http://courseclouds.zhmoll.com/user-center/register', 'bind', 'snsapi_userinfo');
      return res.reply([{
        title: '请先绑定',
        description: '用户中心绑定',
        picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
        url: url
      }]);
    }

    // 微信用户已绑定平台账号
    const url = 'http://courseclouds.zhmoll.com/user-center/';
    return res.reply([{
      title: '用户中心',
      description: '欢迎回来，' + user.name + '！',
      picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
      url: url
    }]);
  });
}

module.exports = function (message, req, res, next) {
  switch (message.EventKey) {
    case 'key_user_center': key_user_center(message, req, res, next);
  }
};