const OAuthApi = require('./OAuth');
const User = require('../model/users');
const UserCourseRelation = require('../model/user-course-relation');
const Term = require('../model/terms');

// 用户中心按钮
function key_user_center(message, req, res, next) {
  // 微信用户已绑定平台账号
  const user = req.me;
  const url = 'http://courseclouds.zhmoll.com/user-center/';
  return res.reply([{
    title: '用户中心',
    description: '欢迎回来，' + user.name + '！',
    picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
    url: url
  }]);
}

// 获取今日课表按钮
function key_today_courses(message, req, res, next) {
  const user = req.me;
  Term.getCurrentWeek(user.university, (err, time) => {
    if (err) return next(err);
    UserCourseRelation.findCourseTimes(user.id, (err, show) => {
      if (err) return next(err);
      console.log(show);

      let courses;
      if (show && show[time.term] && show[time.term][time.week] &&
        show[time.term][time.week][time.weekday]) {
        courses = show[time.term][time.week][time.weekday];
        if (courses.length == 0) {
          result.push({ title: '恭喜你，今天没课！' });
          return res.reply(result);
        }
      }
      else {
        result.push({ title: '恭喜你，今天没课！' });
        return res.reply(result);
      }

      switch (time.weekday) {
        case 0: time.weekday = '周日'; break;
        case 1: time.weekday = '周一'; break;
        case 2: time.weekday = '周二'; break;
        case 3: time.weekday = '周三'; break;
        case 4: time.weekday = '周四'; break;
        case 5: time.weekday = '周五'; break;
        case 6: time.weekday = '周六'; break;
      }
      const result = [{ title: `第${time.week}周 ${time.weekday}` }];

      courses.forEach(item => {
        const name = item.course.name;
        const rows = item.rows.toString();
        const teachers = [];
        item.course.teachers.forEach(teacher => {
          teachers.push(teacher.name);
        });
        result.push({
          title: `课程：${item.course.name}`
          + '\n' + `时间：第${rows}节`
          + '\n' + `地点：${item.location}`
          + '\n' + `老师：` + teachers.toString()
        });
      });
      res.reply(result);
    });
  });
}

module.exports = (message, req, res, next) => {
  const openid = message.FromUserName;
  User.innerFindByOpenid(openid, (err, user) => {
    if (err) {
      res.reply('服务器遇到了一些麻烦');
      console.error(err);
    }
    // 微信用户未绑定平台账号
    if (!user) {
      const url = OAuthApi.getAuthorizeURL('http://courseclouds.zhmoll.com/user-center/register', 'wechat-bind', 'snsapi_userinfo');
      return res.reply([{
        title: '请先绑定',
        description: '用户中心绑定',
        picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
        url: url
      }]);
    }
    // 分发事件
    req.me = user;
    switch (message.EventKey) {
      case 'key_user_center': return key_user_center(message, req, res, next);
      case 'key_today_courses': return key_today_courses(message, req, res, next);
    }
  });
};