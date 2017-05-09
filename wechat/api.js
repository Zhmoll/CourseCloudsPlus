const WechatApi = require('wechat-api');
const config = require('config-lite').wechat;
const fs = require('fs');

const api = new WechatApi(
  config.appid,
  config.appsecret,
  function (callback) {
    // 传入一个获取全局token的方法
    fs.readFile('access_token.txt', 'utf8', function (err, txt) {
      if (err) { return callback(err); }
      callback(null, JSON.parse(txt));
    });
  },
  function (token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('access_token.txt', JSON.stringify(token), callback);
  }
);

// const industryIds = {
//   "industry_id1": '1',
//   "industry_id2": "17"
// };
// api.setIndustry(industryIds, (err, result) => {
//   if (err) {
//     return console.error(err);
//   }
// });

api.sendNoticeTemplate = (notice, openid, sender) => {
  console.log('send')
  var templateId = 'Hd_qSGrxVhzPYidVJs7j4B9rq5NBa1U6dJpbQ70wHyw';
  // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
  // {{first.DATA}}
  // 标题：{{keyword1.DATA}}           
  // 内容：{{keyword2.DATA}}
  // 来自：{{keyword3.DATA}}                       
  // {{remark.DATA}}
  const url = 'http://courseclouds.zhmoll.com/user-center/notice.html?noticeid=' + notice.id;
  const data = {
    "first": {
      "value": "你收到了一条新消息",
      "color": "#173177"
    },
    "keyword1": {
      "value": notice.title,
      "color": "#173177"
    },
    "keyword2": {
      "value": notice.content,
      "color": "#173177"
    },
    "keyword3": {
      "value": sender.nickname,
      "color": "#173177"
    },
    "remark": {
      "value": "点击查看消息详情",
      "color": "#173177"
    }
  };
  return api.sendTemplate(openid, templateId, url, data, (err, result) => {
    if (err)
      return console.log(err);
  });
}

module.exports = api;