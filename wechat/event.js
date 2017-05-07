const OAuthApi = require('./OAuth');
const User = require('../model/users');
const UserCourseRelation = require('../model/user-course-relation');
const CourseAttend = require('../model/course-attends');
const CourseAttendRemark = require('../model/course-attend-remarks');
const UserNoticeRelation = require('../model/user-notice-relation');
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
      let courses;
      if (show && show[time.term] && show[time.term][time.week] &&
        show[time.term][time.week][time.weekday]) {
        courses = show[time.term][time.week][time.weekday];
        if (courses.length == 0) {
          result.push({ title: '恭喜你，今天没课！' });
          result.push({
            title: '点我获得完整课程表',
            url: 'http://courseclouds.zhmoll.com/coursetable.html'
          });
          return res.reply(result);
        }
      }
      else {
        result.push({ title: '恭喜你，今天没课！' });
        result.push({
          title: '点我获得完整课程表',
          url: 'http://courseclouds.zhmoll.com/coursetable.html'
        });
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
      const result = [{ title: `今天是 第${time.week}周 ${time.weekday}` }];

      courses.sort((a, b) => a.rows[0] - b.rows[0]);

      courses.forEach(item => {
        const name = item.course.name;
        const rows = item.rows.toString();
        const teachers = [];
        item.course.teachers.forEach(teacher => {
          teachers.push(teacher.name);
        });
        result.push({
          title: `课程：${item.course.name} - ${item.course.cid}`
          + '\n' + `时间：第${rows}节`
          + '\n' + `老师：` + teachers.toString()
          + '\n' + `地点：${item.location}`
        });
      });

      result.push({
        title: '点我获得完整课程表',
        url: 'http://courseclouds.zhmoll.com/coursetable.html'
      });
      res.reply(result);
    });
  });
}

// 签到
function key_attend_course(message, req, res, next) {
  const user = req.me;
  const attendid = message.ScanCodeInfo.ScanResult;

  CourseAttend.findById(attendid).exec((err, courseattend) => {
    if (!courseattend) {
      res.reply('找不到该签到');
    }
    const now = Date.now();
    const start = courseattend.createdAt.getTime();
    if (now - start > 3 * 60 * 1000)
      res.reply('该签到已结束');
    CourseAttendRemark
      .findOne({ user: user.id })
      .exec((err, check) => {
        if (err) {
          res.reply('服务器遇到了一些麻烦');
          console.error(err);
          return;
        }
        if (!check) {
          CourseAttendRemark.create({
            user: user.id,
            course: courseattend.course,
            courseAttend: attendid
          }, (err, result) => {
            if (err) {
              res.reply('服务器遇到了一些麻烦');
              console.error(err);
              return;
            }
            res.reply('签到成功！');
          });
        }
        res.reply('本课已经签过到！');
      });
  });
}

// 收件箱
function key_user_inbox(message, req, res, next) {
  const user = req.me;
  UserNoticeRelation.findByReceiverId(user.id, (err, relations) => {
    if (err) {
      res.reply('服务器遇到了一些麻烦');
      console.error(err);
      return;
    }
    const results = [{ title: `消息收件箱（最近6条消息）` }];
    relations.forEach((relation, index) => {
      if (index >= 6) return;
      if (relation.notice.course) {
        // 课程相关群发
        results.push({
          title: `${relation.notice.title}` +
          '\n' + `发送：${relation.notice.from.nickname}` +
          '\n' + `来自课堂：${relation.notice.course.name}`,
          url: 'http://courseclouds.zhmoll.com/user-center/inbox?noticeid=' + relation.notice.id
        });
      }
      else {
        // 非课程相关群发
        results.push({
          title: `${relation.notice.title}` +
          '\n' + `发送：${relation.notice.from.nickname}`,
          url: 'http://courseclouds.zhmoll.com/user-center/inbox?noticeid=' + relation.notice.id
        });
      }
    });
    results.push({ title: '点击查看完整消息收件箱', url: 'http://courseclouds.zhmoll.com/user-center/inbox' });
    res.reply(results);
  });
}

module.exports = (message, req, res, next) => {
  const openid = message.FromUserName;
  console.log(message);
  User.innerFindByOpenid(openid, (err, user) => {
    if (err) {
      res.reply('服务器遇到了一些麻烦');
      console.error(err);
      return;
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
      case 'key_attend_course': return key_attend_course(message, req, res, next);
      case 'key_user_inbox': return key_user_inbox(message, req, res, next);
    }
  });
};